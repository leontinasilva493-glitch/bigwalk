from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:3210"
SCRIPT_URL = (
    "https://pl31052446.profitableratecpmnetwork.com/"
    "ad7a012e1693b7d27de84829a3838a5c/invoke.js"
)
CONTAINER_SELECTOR = "#container-ad7a012e1693b7d27de84829a3838a5c"


def assert_native_ad_slot(page, expected_width, minimum_height):
    region = page.get_by_role("region", name="Advertisement")
    region.wait_for(state="visible")
    assert region.get_attribute("data-ad-filled") == "false"

    container = page.locator(CONTAINER_SELECTOR)
    container.wait_for(state="attached")
    box = container.bounding_box()
    assert box is not None
    assert expected_width - 4 <= box["width"] <= expected_width
    assert box["height"] >= minimum_height

    script = page.locator(f'script[src="{SCRIPT_URL}"][data-cfasync="false"]')
    assert script.count() == 1
    assert script.evaluate("node => node.async") is True
    assert container.evaluate("node => node.previousElementSibling === node.parentElement.querySelector('script')")
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")

    container.evaluate("node => node.append(document.createElement('article'))")
    page.wait_for_function(
        "selector => document.querySelector(selector)?.closest('section')?.dataset.adFilled === 'true'",
        arg=CONTAINER_SELECTOR,
    )


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    cases = (
        ({"width": 390, "height": 844}, 342, 460, "/"),
        ({"width": 900, "height": 900}, 836, 300, "/puzzles"),
        ({"width": 1440, "height": 900}, 1120, 220, "/"),
    )

    for viewport, expected_width, minimum_height, path in cases:
        page = browser.new_page(viewport=viewport)
        page.route("https://www.clarity.ms/**", lambda route: route.abort())
        page.route("https://*.clarity.ms/**", lambda route: route.abort())
        page.route(
            SCRIPT_URL,
            lambda route: route.fulfill(
                status=200,
                content_type="application/javascript",
                body="",
            ),
        )

        page.goto(f"{BASE_URL}{path}", wait_until="networkidle")
        assert_native_ad_slot(page, expected_width, minimum_height)
        page.close()

    browser.close()
