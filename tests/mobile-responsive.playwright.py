import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get("REVIEW_BASE_URL", "http://localhost:3015")
MOBILE_VIEWPORTS = [
    {"width": 320, "height": 720},
    {"width": 375, "height": 812},
    {"width": 390, "height": 844},
    {"width": 430, "height": 932},
    {"width": 844, "height": 390},
]


def assert_target_size(locator, label):
    for index in range(locator.count()):
        box = locator.nth(index).bounding_box()
        assert box, f"{label} {index} is not measurable"
        assert box["width"] >= 44 and box["height"] >= 44, (
            f"{label} {index} is {box['width']:.0f}x{box['height']:.0f}, expected at least 44x44"
        )


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    console_errors = []
    page_errors = []

    page = browser.new_page(viewport=MOBILE_VIEWPORTS[0])
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.goto(BASE + "/", wait_until="networkidle")
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), "homepage overflows at 320px"
    nav_box = page.locator(".mobile-nav summary").bounding_box()
    assert nav_box and nav_box["x"] + nav_box["width"] <= 320, "mobile menu trigger leaves the viewport"
    page.locator(".mobile-nav summary").click()
    panel_box = page.locator(".mobile-nav-panel").bounding_box()
    assert panel_box and panel_box["x"] >= 0 and panel_box["x"] + panel_box["width"] <= 320, "mobile menu panel leaves the viewport"
    page.close()

    for viewport in MOBILE_VIEWPORTS:
        page = browser.new_page(viewport=viewport)
        page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.goto(BASE + "/map", wait_until="networkidle")
        assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), f"map overflows at {viewport['width']}px"
        assert_target_size(page.locator(".map-marker"), "map marker")
        assert_target_size(page.locator(".map-location-list article > button"), "checklist toggle")
        assert_target_size(page.locator(".map-location-list article > a"), "checklist guide link")
        page.close()

    browser.close()

assert not console_errors, console_errors
assert not page_errors, page_errors
print("mobile_nav=pass map_touch_targets=pass overflow=pass console_errors=0 page_errors=0")
