import json
import sys

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:4178"
ROUTES = {
    "/beginner-guide/lost-items-and-lost-found": "What kind of item is missing?",
    "/multiplayer/hosting-and-saves": "What persists between sessions?",
    "/troubleshooting/cant-connect-or-join": "Where does connection fail?",
    "/troubleshooting/voice-chat-not-working": "Platform-specific checks",
    "/puzzles": "Choose how much help to reveal",
    "/walkthrough/true-ending": "True ending completion checklist",
    "/multiplayer/how-to-find-players": "Private join handoff",
}
VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "mobile": {"width": 390, "height": 844},
}


def main():
    results = []
    failures = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for viewport_name, viewport in VIEWPORTS.items():
            context = browser.new_context(viewport=viewport)
            for route, expected_text in ROUTES.items():
                page = context.new_page()
                console_errors = []
                page_errors = []
                page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
                page.on("pageerror", lambda error: page_errors.append(str(error)))

                response = page.goto(f"{BASE_URL}{route}", wait_until="networkidle", timeout=20000)
                h1_count = page.locator("h1").count()
                has_expected_text = page.get_by_text(expected_text, exact=True).count() >= 1
                overflow = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")

                mobile_table_state = None
                if viewport_name == "mobile" and page.locator(".route-recovery__table-wrap").count():
                    mobile_table_state = {
                        "desktop_table_visible": page.locator(".route-recovery__table-wrap").first.is_visible(),
                        "mobile_cards_visible": page.locator(".route-recovery__mobile-list").first.is_visible(),
                    }

                check = {
                    "viewport": viewport_name,
                    "route": route,
                    "status": response.status if response else None,
                    "h1_count": h1_count,
                    "expected_text": has_expected_text,
                    "horizontal_overflow": overflow,
                    "console_errors": console_errors,
                    "page_errors": page_errors,
                    "mobile_table_state": mobile_table_state,
                }
                results.append(check)

                valid_mobile_state = mobile_table_state is None or (
                    not mobile_table_state["desktop_table_visible"]
                    and mobile_table_state["mobile_cards_visible"]
                )
                if not all([
                    check["status"] == 200,
                    h1_count == 1,
                    has_expected_text,
                    not overflow,
                    not console_errors,
                    not page_errors,
                    valid_mobile_state,
                ]):
                    failures.append(check)
                    page.screenshot(
                        path=f".local-review/p0-failure-{viewport_name}-{route.strip('/').replace('/', '-')}.png",
                        full_page=True,
                    )
                page.close()
            context.close()
        browser.close()

    print(json.dumps({"checks": len(results), "failures": failures, "results": results}, ensure_ascii=False))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
