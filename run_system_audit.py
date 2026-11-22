import urllib.request
import json
import time

BASE_API = 'https://queueless-api-rho.vercel.app'
BASE_FRONTEND = 'https://queueless-os.vercel.app'
LOCAL_FRONTEND = 'http://localhost:5173'
LOCAL_BACKEND = 'http://localhost:5001'

results = []

def test(name, url, method='GET', data=None, headers=None, expected_status=200):
    start = time.time()
    req_headers = {'User-Agent': 'Queueless-Auto-Auditor/1.0'}
    if headers:
        req_headers.update(headers)
    
    body = None
    if data:
        body = json.dumps(data).encode('utf-8')
        req_headers['Content-Type'] = 'application/json'

    req = urllib.request.Request(url, data=body, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            code = response.getcode()
            dur = int((time.time() - start) * 1000)
            res_body = response.read().decode('utf-8', errors='ignore')
            ok = (code == expected_status)
            status_label = 'PASS' if ok else 'FAIL'
            results.append({'name': name, 'ok': ok, 'code': code, 'ms': dur, 'err': None, 'len': len(res_body)})
            print(f"[{status_label}] {name} ({code}) - {dur}ms")
            return res_body
    except urllib.error.HTTPError as e:
        dur = int((time.time() - start) * 1000)
        err_body = e.read().decode('utf-8', errors='ignore')
        results.append({'name': name, 'ok': False, 'code': e.code, 'ms': dur, 'err': err_body[:100], 'len': len(err_body)})
        print(f"[FAIL] {name} - HTTP {e.code} ({dur}ms)")
        return err_body
    except Exception as e:
        dur = int((time.time() - start) * 1000)
        results.append({'name': name, 'ok': False, 'code': 0, 'ms': dur, 'err': str(e), 'len': 0})
        print(f"[FAIL] {name} - Error: {e} ({dur}ms)")
        return None

print("\n========================================================")
print("🚀 QUEUELESS OS - COMPREHENSIVE PRODUCTION & LOCAL AUDIT")
print("========================================================\n")

print("--- 1. Testing Production Frontend Routes ---")
routes = [
    '/',
    '/features',
    '/pricing',
    '/roi-calculator',
    '/about',
    '/blog',
    '/blog/eliminating-hospital-waiting-room-crowding-india',
    '/blog/abdm-m1-m2-certification-guide-for-clinics',
    '/blog/smart-tv-kiosks-vs-traditional-token-dispensers',
    '/blog/reducing-patient-walkout-rate-opd',
    '/blog/patient-privacy-zero-app-download-architecture',
    '/blog/doctor-burnout-and-opd-desk-shouting',
    '/reception',
    '/doctor',
    '/display',
    '/portal',
    '/admin',
    '/login',
    '/signup',
    '/privacy',
    '/terms',
    '/security',
    '/refund-policy'
]
for r in routes:
    test(f"Prod Route: {r}", f"{BASE_FRONTEND}{r}")

print("\n--- 2. Testing Local Development Servers ---")
test("Local Backend Health", f"{LOCAL_BACKEND}/health")
test("Local Frontend Root", f"{LOCAL_FRONTEND}/")
test("Local Frontend Blog", f"{LOCAL_FRONTEND}/blog")

print("\n--- 3. Testing Core API & Clinical Lifecycle ---")
test("API Gateway Healthz", f"{BASE_API}/health")
test("Public Clinic Query: Caremax OPD", f"{BASE_API}/api/v1/clinics/public/caremax-opd")
test("Public Clinic Query: City Health", f"{BASE_API}/api/v1/clinics/public/city-health")
test("Display Kiosk Payload: Caremax", f"{BASE_API}/api/v1/queue/clinics/caremax-opd/display")

# Reception Authentication
test("Auth Verify: Reception Desk", f"{BASE_API}/api/v1/clinics/auth/verify", method='POST', data={
    'role': 'RECEPTION',
    'password': 'reception123',
    'slug': 'caremax-opd'
})

# Doctor Authentication
test("Auth Verify: Doctor Station", f"{BASE_API}/api/v1/clinics/auth/verify", method='POST', data={
    'role': 'DOCTOR',
    'password': '1234',
    'slug': 'caremax-opd',
    'doctorId': '30c5ab66-ddeb-4181-a74b-d52b69274fc6'
})

# New Patient Check-In
checkin_res = test("Patient Check-In (Token Generation)", f"{BASE_API}/api/v1/queue/public/clinics/d90d9e09-cb33-4220-a4de-cf210c0022aa/check-ins", method='POST', data={
    'name': 'Deep Comprehensive Audit Patient',
    'mobile': '+919876501234',
    'doctorId': '30c5ab66-ddeb-4181-a74b-d52b69274fc6',
    'serviceName': 'General Consultation OPD'
})

entry_id = None
pub_tok = None
token_num = None
if checkin_res:
    try:
        cdata = json.loads(checkin_res)
        entry_id = cdata.get('data', {}).get('queueEntryId')
        pub_tok = cdata.get('data', {}).get('publicToken')
        token_num = cdata.get('data', {}).get('token')
        print(f"   -> [Verified] Generated Token #{token_num} (Entry: {entry_id}, Public: {pub_tok})")
    except Exception as ex:
        print(f"   -> Parse error: {ex}")

if pub_tok:
    test(f"Patient Live Status ({token_num})", f"{BASE_API}/api/v1/queue/patient/{pub_tok}")

if entry_id:
    test(f"Doctor Call Next Transition ({token_num} -> CALLED)", f"{BASE_API}/api/v1/queue/{entry_id}/transition", method='POST', data={
        'targetStatus': 'CALLED',
        'actorName': 'Dr. Rohan Sharma, MD'
    })
    test(f"Patient Virtual Wait Setting ({token_num} -> CAR)", f"{BASE_API}/api/v1/queue/{entry_id}/virtual-wait", method='POST', data={
        'location': 'CAR',
        'note': 'Waiting in car parking basement'
    })
    test(f"Consultation Start ({token_num} -> IN_CONSULTATION)", f"{BASE_API}/api/v1/queue/{entry_id}/transition", method='POST', data={
        'targetStatus': 'IN_CONSULTATION',
        'actorName': 'Dr. Rohan Sharma, MD'
    })
    test(f"Consultation Complete ({token_num} -> COMPLETED)", f"{BASE_API}/api/v1/queue/{entry_id}/transition", method='POST', data={
        'targetStatus': 'COMPLETED',
        'actorName': 'Dr. Rohan Sharma, MD'
    })

passed = sum(1 for r in results if r['ok'])
total = len(results)
rate = (passed / total) * 100 if total else 0

print("\n" + "=" * 56)
print(f"FINAL AUDIT SUMMARY: {passed}/{total} Passed ({rate:.1f}%)")
print("=" * 56)
