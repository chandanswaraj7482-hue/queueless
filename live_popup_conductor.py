import time
import subprocess

def run_sc(sc):
    subprocess.run(["osascript", "-e", sc], check=False)

def popup_navigate(url, title_label):
    print(f"🎬 [LIVE POPUP] Navigating to: {title_label} ({url})")
    sc = f'''
    tell application "Google Chrome"
        activate
        set bounds of front window to {{100, 60, 1340, 840}}
        set URL of active tab of front window to "{url}"
    end tell
    tell application "System Events"
        set frontmost of process "Google Chrome" to true
    end tell
    '''
    run_sc(sc)

def scroll_down(steps=10, delay=0.12):
    sc = f'''
    tell application "System Events"
        repeat {steps} times
            key code 125
            delay {delay}
        end repeat
    end tell
    '''
    run_sc(sc)

def scroll_up(steps=8, delay=0.10):
    sc = f'''
    tell application "System Events"
        repeat {steps} times
            key code 126
            delay {delay}
        end repeat
    end tell
    '''
    run_sc(sc)

# 1. Landing Page
popup_navigate("http://localhost:5173/", "1. Master Landing Page & Simulator")
time.sleep(3.5)
scroll_down(steps=10, delay=0.12)
time.sleep(2.5)
scroll_down(steps=12, delay=0.12)
time.sleep(2.5)

# 2. Patient Check-In & Vector QR Pass
popup_navigate("http://localhost:5173/check-in/caremax-opd", "2. Patient QR Check-In Entry")
time.sleep(3.5)
scroll_down(steps=8, delay=0.12)
time.sleep(2.5)

# 3. Patient Live Tracking Pass (Token A-101 / A-102)
popup_navigate("http://localhost:5173/status/ptk_50f0291d9be8a4b088d21e56", "3. Patient Live Mobile Token Pass")
time.sleep(3.5)
scroll_down(steps=8, delay=0.12)
time.sleep(2.5)

# 4. Doctor Cabin Console (Dr. Rohan Sharma)
popup_navigate("http://localhost:5173/doctor", "4. Doctor Cabin 1 Console (1-Tap Call)")
time.sleep(3.5)
scroll_down(steps=6, delay=0.12)
time.sleep(2.5)

# 5. Lobby 55-inch Smart TV Display Kiosk
popup_navigate("http://localhost:5173/display?clinic=caremax-opd", "5. 55-Inch Lobby Smart TV Kiosk")
time.sleep(4.5)

# 6. Reception Desk & Queue Management
popup_navigate("http://localhost:5173/reception", "6. Reception Desk & Daily Collections")
time.sleep(3.5)
scroll_down(steps=8, delay=0.12)
time.sleep(2.5)

# 7. Healthcare SEO Blog Library
popup_navigate("http://localhost:5173/blog", "7. Clinical Insights & SEO Blog")
time.sleep(3.5)
scroll_down(steps=10, delay=0.12)
time.sleep(2.5)

# 8. Founder & Master Super-Admin Platform HQ
popup_navigate("http://localhost:5173/founder", "8. Founder & Master Admin HQ")
time.sleep(3.5)
scroll_down(steps=6, delay=0.12)
time.sleep(2.0)

# Return to Landing Page
popup_navigate("http://localhost:5173/", "Completed Live Tour")
print("✅ Live popup tour completed successfully!")
