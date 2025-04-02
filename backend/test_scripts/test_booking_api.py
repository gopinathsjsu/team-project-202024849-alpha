import requests
import json
from datetime import datetime, timedelta

# Base URL for the API
BASE_URL = 'http://127.0.0.1:8000/api'

# Test case descriptions
test_cases = [
    "1. Login as customer",
    "2. Login as manager",
    "3. Login as admin",
    "4. Check restaurant availability",
    "5. Create a booking",
    "6. List bookings (as customer)",
    "7. List bookings (as manager)",
    "8. List bookings (as admin)",
    "9. Update booking",
    "10. Confirm booking (as manager)",
    "11. Cancel booking (as customer)",
    "12. Complete booking (as manager)"
]

# Store test results
test_results = {i+1: False for i in range(len(test_cases))}
total_tests = len(test_cases)

# Store tokens and IDs for later use
tokens = {}
booking_id = None
restaurant_id = None

def print_test_result(test_num, passed, message=""):
    if passed:
        print(f"✅ {test_cases[test_num-1]}: PASSED")
        if message:
            print(f"   {message}")
        test_results[test_num] = True
    else:
        print(f"❌ {test_cases[test_num-1]}: FAILED")
        if message:
            print(f"   {message}")
    print()

# Step 1: Login as customer
customer_login_data = {
    'username': 'customer1',
    'password': 'testpass123'
}
print("Testing Customer Login:")
customer_login_response = requests.post(f'{BASE_URL}/users/login/', json=customer_login_data)
print(f"Response status: {customer_login_response.status_code}")
print(f"Response: {customer_login_response.text}")

if customer_login_response.status_code == 200:
    tokens['customer'] = customer_login_response.json()['access']
    print_test_result(1, True, f"Customer token: {tokens['customer'][:20]}...")
else:
    print_test_result(1, False, "Failed to login as customer")
    exit(1)

# Step 2: Login as manager
manager_login_data = {
    'username': 'manager1',
    'password': 'testpass123'
}
print("Testing Manager Login:")
manager_login_response = requests.post(f'{BASE_URL}/users/login/', json=manager_login_data)
print(f"Response status: {manager_login_response.status_code}")
print(f"Response: {manager_login_response.text}")

if manager_login_response.status_code == 200:
    tokens['manager'] = manager_login_response.json()['access']
    print_test_result(2, True, f"Manager token: {tokens['manager'][:20]}...")
else:
    print_test_result(2, False, "Failed to login as manager")
    exit(1)

# Step 3: Login as admin
admin_login_data = {
    'username': 'admin',
    'password': 'testpassword'
}
print("Testing Admin Login:")
admin_login_response = requests.post(f'{BASE_URL}/users/login/', json=admin_login_data)
print(f"Response status: {admin_login_response.status_code}")
print(f"Response: {admin_login_response.text}")

if admin_login_response.status_code == 200:
    tokens['admin'] = admin_login_response.json()['access']
    print_test_result(3, True, f"Admin token: {tokens['admin'][:20]}...")
else:
    print_test_result(3, False, "Failed to login as admin")
    exit(1)

# Step 4: Get a restaurant ID for testing
print("Getting restaurant ID for testing:")
headers = {'Authorization': f'Bearer {tokens["manager"]}'}
restaurants_response = requests.get(f'{BASE_URL}/restaurants/', headers=headers)
if restaurants_response.status_code == 200 and restaurants_response.json():
    restaurant_id = restaurants_response.json()[0]['id']
    print(f"Found restaurant ID: {restaurant_id}")
else:
    print("Failed to get restaurant ID")
    exit(1)

# Step 5: Check availability
print("\nChecking restaurant availability:")
availability_url = f'{BASE_URL}/bookings/bookings/check-availability/'
availability_params = {
    'restaurant_id': restaurant_id,
    'date': '2025-05-13',
    'time': '19:00',
    'party_size': 4
}
availability_response = requests.get(
    availability_url,
    params=availability_params,
    headers={'Authorization': f'Bearer {tokens["customer"]}'}
)
print(f"Response status: {availability_response.status_code}")
print(f"Response: {availability_response.text}")

if availability_response.status_code == 200:
    print_test_result(4, True, f"Availability: {availability_response.json()['available']}")
else:
    print_test_result(4, False, "Failed to check availability")

# Step 6: Create a booking
booking_data = {
    'restaurant': restaurant_id,
    'date': '2025-05-13',
    'time': '19:00',
    'party_size': 4
}
print("\nCreating a booking:")
booking_url = f'{BASE_URL}/bookings/bookings/'
print(f"Request URL: {booking_url}")
print(f"Request Headers: {headers}")
print(f"Request Data: {json.dumps(booking_data, indent=2)}")
create_response = requests.post(
    booking_url,
    json=booking_data,
    headers={'Authorization': f'Bearer {tokens["customer"]}'}
)
print(f"Response status: {create_response.status_code}")
print(f"Response headers: {dict(create_response.headers)}")
print(f"Response: {create_response.text}")

if create_response.status_code == 201:
    booking_id = create_response.json()['id']
    print_test_result(5, True, f"Created booking ID: {booking_id}")
else:
    print_test_result(5, False, f"Failed to create booking. Status: {create_response.status_code}")
    exit(1)

# Step 7: List bookings as customer
print("\nListing bookings as customer:")
customer_list_response = requests.get(
    f'{BASE_URL}/bookings/',
    headers={'Authorization': f'Bearer {tokens["customer"]}'}
)
print(f"Response status: {customer_list_response.status_code}")
print(f"Response: {customer_list_response.text}")

if customer_list_response.status_code == 200:
    print_test_result(6, True, f"Found {len(customer_list_response.json())} bookings")
else:
    print_test_result(6, False, "Failed to list bookings as customer")

# Step 8: List bookings as manager
print("\nListing bookings as manager:")
manager_list_response = requests.get(
    f'{BASE_URL}/bookings/',
    headers={'Authorization': f'Bearer {tokens["manager"]}'}
)
print(f"Response status: {manager_list_response.status_code}")
print(f"Response: {manager_list_response.text}")

if manager_list_response.status_code == 200:
    print_test_result(7, True, f"Found {len(manager_list_response.json())} bookings")
else:
    print_test_result(7, False, "Failed to list bookings as manager")

# Step 9: List bookings as admin
print("\nListing bookings as admin:")
admin_list_response = requests.get(
    f'{BASE_URL}/bookings/',
    headers={'Authorization': f'Bearer {tokens["admin"]}'}
)
print(f"Response status: {admin_list_response.status_code}")
print(f"Response: {admin_list_response.text}")

if admin_list_response.status_code == 200:
    print_test_result(8, True, f"Found {len(admin_list_response.json())} bookings")
else:
    print_test_result(8, False, "Failed to list bookings as admin")

# Step 10: Update booking
update_data = {
    'party_size': 6
}
print("\nUpdating booking:")
update_url = f'{BASE_URL}/bookings/bookings/{booking_id}/'
update_response = requests.patch(
    update_url,
    json=update_data,
    headers={'Authorization': f'Bearer {tokens["customer"]}'}
)
print(f"Response status: {update_response.status_code}")
print(f"Response: {update_response.text}")

if update_response.status_code == 200:
    print_test_result(9, True, "Booking updated successfully")
else:
    print_test_result(9, False, "Failed to update booking")

# Step 11: Confirm booking as manager
print("\nConfirming booking as manager:")
confirm_url = f'{BASE_URL}/bookings/bookings/{booking_id}/confirm/'
confirm_response = requests.post(
    confirm_url,
    headers={'Authorization': f'Bearer {tokens["manager"]}'}
)
print(f"Response status: {confirm_response.status_code}")
print(f"Response: {confirm_response.text}")

if confirm_response.status_code == 200:
    print_test_result(10, True, "Booking confirmed successfully")
else:
    print_test_result(10, False, "Failed to confirm booking")

# Step 12: Cancel booking as customer
print("\nCancelling booking as customer:")
cancel_url = f'{BASE_URL}/bookings/bookings/{booking_id}/cancel/'
cancel_response = requests.post(
    cancel_url,
    headers={'Authorization': f'Bearer {tokens["customer"]}'}
)
print(f"Response status: {cancel_response.status_code}")
print(f"Response: {cancel_response.text}")

if cancel_response.status_code == 200:
    print_test_result(11, True, "Booking cancelled successfully")
else:
    print_test_result(11, False, "Failed to cancel booking")

# Step 13: Complete booking as manager
print("\nCompleting booking as manager:")
complete_url = f'{BASE_URL}/bookings/bookings/{booking_id}/complete/'
complete_response = requests.post(
    complete_url,
    headers={'Authorization': f'Bearer {tokens["manager"]}'}
)
print(f"Response status: {complete_response.status_code}")
print(f"Response: {complete_response.text}")

if complete_response.status_code == 200:
    print_test_result(12, True, "Booking marked as completed")
else:
    print_test_result(12, False, "Failed to complete booking")

# Print summary
print("="*50)
success_count = sum(1 for passed in test_results.values() if passed)
print(f'Test Summary: {success_count}/{total_tests} tests passed.')
print("="*50)
print('Passed test cases:')
for test_num, passed in test_results.items():
    if passed:
        print(f"✅ {test_cases[test_num-1]}")
print('\nFailed test cases:')
for test_num, passed in test_results.items():
    if not passed:
        print(f"❌ {test_cases[test_num-1]}")
print("="*50) 