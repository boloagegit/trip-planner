from playwright.sync_api import sync_playwright
import json

# Sample small itinerary to render
sample_itinerary = [
  {
    "date": "2025-12-28",
    "dayOfWeek": "週日",
    "events": [
      {
        "id": "1228-1",
        "time": "12:50",
        "title": "Test Event 1",
        "description": "Desc 1",
        "type": "flight",
        "location": "Airport"
      }
    ]
  },
  {
      "date": "2025-12-29",
      "dayOfWeek": "週一",
      "events": []
  },
  {
      "date": "2025-12-30",
      "dayOfWeek": "週二",
      "events": []
  },
  {
      "date": "2025-12-31",
      "dayOfWeek": "週三",
      "events": []
  },
  {
      "date": "2026-01-01",
      "dayOfWeek": "週四",
      "events": []
  }
]

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Navigate to the app first to set localStorage domain
        print("Navigating to app...")
        page.goto("http://localhost:3000")

        # Inject data into localStorage
        print("Injecting data...")
        page.evaluate(f"""() => {{
            localStorage.setItem('tokyo-trip-itinerary', JSON.stringify({json.dumps(sample_itinerary)}));
            localStorage.setItem('tokyo-trip-sheet-url', 'https://dummy');
        }}""")

        # Reload to pick up data
        page.reload()

        # Wait for the app to render days
        try:
            page.wait_for_selector(".days-container", timeout=5000)
            print("Days container loaded")
        except:
            print("Days container not found, taking screenshot of current state")
            page.screenshot(path="verification/error_state.png")
            raise

        # Take a screenshot of the main view
        page.screenshot(path="verification/main_view.png")
        print("Screenshot main_view.png saved")

        # Check if scroll buttons are present (might be hidden if content fits, but let's check class)
        # In my fix, they are always rendered but might have opacity 0.
        # But wait, if content fits, showLeftButton/showRightButton might be false.
        # I need enough content to scroll. 5 days might be enough depending on width.

        # Open Notes Modal to verify that fix too
        page.click("button[title='隨身筆記本']")
        page.wait_for_selector(".notes-modal-content")
        page.screenshot(path="verification/notes_modal.png")
        print("Screenshot notes_modal.png saved")

        browser.close()

if __name__ == "__main__":
    verify_app()
