from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:3210"
SCRIPT_URL = (
    "https://pl31052446.profitableratecpmnetwork.com/"
    "ad7a012e1693b7d27de84829a3838a5c/invoke.js"
)
CONTAINER_SELECTOR = "#container-ad7a012e1693b7d27de84829a3838a5c"


def assert_native_ad(page):
    region = page.get_by_role("region", name="Advertisement")
    region.wait_for(state="visible")
    assert region.get_attribute("data-ad-filled") == "true"

    container = page.locator(CONTAINER_SELECTOR)
    container.wait_for(state="attached")
    page.wait_for_function(
        "selector => document.querySelector(selector)?.dataset.adTestLoaded === 'true'",
        arg=CONTAINER_SELECTOR,
    )

    script = page.locator(f'script[src="{SCRIPT_URL}"][data-cfasync="false"]')
    assert script.count() == 1
    assert script.evaluate("node => node.async") is True
    assert container.evaluate("node => node.previousElementSibling === node.parentElement.querySelector('script')")
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.route("https://www.clarity.ms/**", lambda route: route.abort())
    page.route("https://*.clarity.ms/**", lambda route: route.abort())
    page.route(
        SCRIPT_URL,
        lambda route: route.fulfill(
            status=200,
            content_type="application/javascript",
            body=(
                "const container=document.getElementById("
                "'container-ad7a012e1693b7d27de84829a3838a5c');"
                "container.dataset.adTestLoaded='true';"
                "container.append(document.createElement('article'));"
            ),
        ),
    )

    page.goto(BASE_URL, wait_until="networkidle")
    assert_native_ad(page)

    page.locator('main a[href="/puzzles"]').first.click()
    page.wait_for_url(f"{BASE_URL}/puzzles")
    assert_native_ad(page)

    browser.close()
