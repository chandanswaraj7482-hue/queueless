import os
import time
import subprocess

VIDEO_OUTPUT = "/Users/apple/Desktop/Queueless_OS_Full_Working_Demo.mp4"
RECORD_SECONDS = 32

print(f"🎬 Starting Autonomous Screen Recording ({RECORD_SECONDS}s) to: {VIDEO_OUTPUT}")

# Launch screencapture in background
screencap_proc = subprocess.Popen([
    "screencapture",
    "-V",
    str(RECORD_SECONDS),
    VIDEO_OUTPUT
])

# Give screencapture 1 second to initialize
time.sleep(1.5)

# AppleScript helper to open URL in Google Chrome and bring to front
def chrome_navigate(url, wait_sec=4.5):
    script = f'''
    tell application "Google Chrome"
        activate
        if (count of windows) is 0 then
            make new window
        end if
        set URL of active tab of front window to "{url}"
    end tell
    '''
    subprocess.run(["osascript", "-e", script], check=False)
    time.sleep(wait_sec)

try:
    # 1. Landing Page (Showing Hero, ABDM badge, Simulator, and new Blog link)
    print("📍 Scene 1: Landing Page")
    chrome_navigate("http://localhost:5173/", wait_sec=5)

    # 2. Blog Index Page (Showing new SEO articles and categories)
    print("📍 Scene 2: Clinical Blog & SEO Index")
    chrome_navigate("http://localhost:5173/blog", wait_sec=5)

    # 3. Blog Article View (Showing deep article, takeaways, author card)
    print("📍 Scene 3: Blog Article Detail View")
    chrome_navigate("http://localhost:5173/blog/eliminating-hospital-waiting-room-crowding-india", wait_sec=5)

    # 4. Reception Desk (Showing walk-in OPD queue)
    print("📍 Scene 4: Reception Desk & Queue Management")
    chrome_navigate("http://localhost:5173/reception", wait_sec=4.5)

    # 5. Doctor Cabin Console (Dr. Rohan Sharma)
    print("📍 Scene 5: Doctor Cabin Console")
    chrome_navigate("http://localhost:5173/doctor", wait_sec=4.5)

    # 6. Lobby 55" Smart TV Kiosk (Live chime and token display)
    print("📍 Scene 6: Lobby 55-inch Smart TV Kiosk")
    chrome_navigate("http://localhost:5173/display?clinic=caremax-opd", wait_sec=4.5)

    # 7. Patient Live Mobile Token Pass
    print("📍 Scene 7: Patient Live Mobile Pass")
    chrome_navigate("http://localhost:5173/status/ptk_50f0291d9be8a4b088d21e56", wait_sec=4)

finally:
    screencap_proc.wait()
    print("✅ Screen Recording Completed Successfully!")

if os.path.exists(VIDEO_OUTPUT):
    size_mb = os.path.getsize(VIDEO_OUTPUT) / (1024 * 1024)
    print(f"🎉 Generated Video: {VIDEO_OUTPUT} ({size_mb:.2f} MB)")
else:
    print("⚠️ Video file was not found.")
