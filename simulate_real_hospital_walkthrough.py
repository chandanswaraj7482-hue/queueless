import os
import time
import subprocess

VIDEO_OUTPUT = "/Users/apple/Desktop/Queueless_Hospital_Live_Simulation.mp4"
TOTAL_RECORD_SECONDS = 68

print(f"🏥 Starting Real Hospital Live Walkthrough Simulation ({TOTAL_RECORD_SECONDS}s)...")
print(f"📁 Output Video: {VIDEO_OUTPUT}")

# Launch screencapture
screencap_proc = subprocess.Popen([
    "screencapture",
    "-V",
    str(TOTAL_RECORD_SECONDS),
    VIDEO_OUTPUT
])

time.sleep(1.5)

def run_applescript(sc):
    subprocess.run(["osascript", "-e", sc], check=False)

def set_chrome_url(url):
    sc = f'''
    tell application "Google Chrome"
        activate
        set bounds of front window to {{0, 0, 1440, 900}}
        set URL of active tab of front window to "{url}"
    end tell
    '''
    run_applescript(sc)

def smooth_scroll_down(steps=12, delay=0.10):
    sc = f'''
    tell application "System Events"
        repeat {steps} times
            key code 125
            delay {delay}
        end repeat
    end tell
    '''
    run_applescript(sc)

def smooth_scroll_up(steps=12, delay=0.08):
    sc = f'''
    tell application "System Events"
        repeat {steps} times
            key code 126
            delay {delay}
        end repeat
    end tell
    '''
    run_applescript(sc)

def page_down(times=1, delay=0.8):
    sc = f'''
    tell application "System Events"
        repeat {times} times
            key code 121
            delay {delay}
        end repeat
    end tell
    '''
    run_applescript(sc)

try:
    # ==============================================================
    # 1. LANDING PAGE: REAL-TIME HOSPITAL OS OVERVIEW
    # ==============================================================
    print("🎬 Scene 1: Hospital Landing Page & Commercial Overview")
    set_chrome_url("http://localhost:5173/")
    time.sleep(3.5)
    
    # Smooth scroll down to view Interactive OPD Simulator
    smooth_scroll_down(steps=10, delay=0.12)
    time.sleep(2.5)
    
    # Smooth scroll down to view 5-Pillar Operating Suite & Reviews
    smooth_scroll_down(steps=14, delay=0.12)
    time.sleep(2.5)
    
    # Smooth scroll down to view ROI Calculator
    smooth_scroll_down(steps=12, delay=0.12)
    time.sleep(2.0)

    # ==============================================================
    # 2. CLINICAL BLOG & SEO KNOWLEDGE BASE
    # ==============================================================
    print("🎬 Scene 2: Clinical Blog & Articles Index")
    set_chrome_url("http://localhost:5173/blog")
    time.sleep(3.0)
    
    # Scroll down to see featured article and grid
    smooth_scroll_down(steps=12, delay=0.12)
    time.sleep(2.5)
    
    # Open full article
    print("   -> Opening Featured Clinical Article")
    set_chrome_url("http://localhost:5173/blog/eliminating-hospital-waiting-room-crowding-india")
    time.sleep(3.0)
    smooth_scroll_down(steps=14, delay=0.12)
    time.sleep(2.5)

    # ==============================================================
    # 3. RECEPTION DESK: REAL-TIME OPD PATIENT FLOW
    # ==============================================================
    print("🎬 Scene 3: Reception Desk & Walk-in OPD Queue")
    set_chrome_url("http://localhost:5173/reception")
    time.sleep(3.5)
    smooth_scroll_down(steps=10, delay=0.12)
    time.sleep(3.0)
    smooth_scroll_up(steps=8, delay=0.08)
    time.sleep(1.5)

    # ==============================================================
    # 4. DOCTOR CABIN: 1-TAP CLINICAL CALLING CONSOLE
    # ==============================================================
    print("🎬 Scene 4: Doctor Cabin Console (Dr. Rohan Sharma)")
    set_chrome_url("http://localhost:5173/doctor")
    time.sleep(3.5)
    smooth_scroll_down(steps=8, delay=0.12)
    time.sleep(3.0)

    # ==============================================================
    # 5. LOBBY 55" SMART TV KIOSK (LIVE WAITING HALL DISPLAY)
    # ==============================================================
    print("🎬 Scene 5: Lobby 55-inch Smart TV Kiosk")
    set_chrome_url("http://localhost:5173/display?clinic=caremax-opd")
    time.sleep(5.0)

    # ==============================================================
    # 6. PATIENT MOBILE LIVE PASS
    # ==============================================================
    print("🎬 Scene 6: Patient Live Mobile Token Pass")
    set_chrome_url("http://localhost:5173/status/ptk_50f0291d9be8a4b088d21e56")
    time.sleep(3.5)
    smooth_scroll_down(steps=10, delay=0.12)
    time.sleep(3.0)
    smooth_scroll_up(steps=8, delay=0.08)
    time.sleep(2.0)

finally:
    screencap_proc.wait()
    print("✅ Full Live Hospital Simulation Recording Finished!")

if os.path.exists(VIDEO_OUTPUT):
    mb = os.path.getsize(VIDEO_OUTPUT) / (1024 * 1024)
    print(f"🎉 Saved Master Video to Desktop: {VIDEO_OUTPUT} ({mb:.2f} MB)")
else:
    print("⚠️ Video file not found.")
