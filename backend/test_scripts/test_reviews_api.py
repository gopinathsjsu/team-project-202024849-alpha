import requests
import json
from datetime import datetime

# Base URL for the API
BASE_URL = 'http://127.0.0.1:8000/api'

# Test case descriptions
test_cases = [
    "1. Login as customer",
    "2. Login as manager",
    "3. Login as admin",
    "4. Create a review",
    "5. List reviews (as customer)",
    "6. List reviews (as manager)",
    "7. List reviews (as admin)",
    "8. Update review",
    "9. Delete review",
    "10. Get restaurant reviews"
]

# Store test results
test_results = {i+1: False for i in range(len(test_cases))}
total_tests = len(test_cases)

# Store tokens and IDs for later use
tokens = {}
review_id = None
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

# Step 5: Create a review
review_data = {
    'restaurant': restaurant_id,
    'rating': 5,
    'comment': 'Great food and service!'
}
print("\nCreating a review:")
create_response = requests.post(
    f'{BASE_URL}/reviews/reviews/',
    json=review_data,
    headers={'Authorization': f'Bearer {tokens["customer"]}'}
)
print(f"Response status: {create_response.status_code}")
print(f"Response: {create_response.text}")

if create_response.status_code == 201:
    review_id = create_response.json()['id']
    print_test_result(4, True, f"Created review ID: {review_id}")
else:
    print_test_result(4, False, f"Failed to create review. Status: {create_response.status_code}")
    exit(1)

# Step 6: List reviews as customer
print("\nListing reviews as customer:")
customer_list_response = requests.get(
    f'{BASE_URL}/reviews/reviews/',
    headers={'Authorization': f'Bearer {tokens["customer"]}'}
)
print(f"Response status: {customer_list_response.status_code}")
print(f"Response: {customer_list_response.text}")

if customer_list_response.status_code == 200:
    print_test_result(5, True, f"Found {len(customer_list_response.json())} reviews")
else:
    print_test_result(5, False, "Failed to list reviews as customer")

# Step 7: List reviews as manager
print("\nListing reviews as manager:")
manager_list_response = requests.get(
    f'{BASE_URL}/reviews/reviews/',
    headers={'Authorization': f'Bearer {tokens["manager"]}'}
)
print(f"Response status: {manager_list_response.status_code}")
print(f"Response: {manager_list_response.text}")

if manager_list_response.status_code == 200:
    print_test_result(6, True, f"Found {len(manager_list_response.json())} reviews")
else:
    print_test_result(6, False, "Failed to list reviews as manager")

# Step 8: List reviews as admin
print("\nListing reviews as admin:")
admin_list_response = requests.get(
    f'{BASE_URL}/reviews/reviews/',
    headers={'Authorization': f'Bearer {tokens["admin"]}'}
)
print(f"Response status: {admin_list_response.status_code}")
print(f"Response: {admin_list_response.text}")

if admin_list_response.status_code == 200:
    print_test_result(7, True, f"Found {len(admin_list_response.json())} reviews")
else:
    print_test_result(7, False, "Failed to list reviews as admin")

# Step 9: Update review
update_data = {
    'rating': 4,
    'comment': 'Updated review: Still good but could be better'
}
print("\nUpdating review:")
update_response = requests.patch(
    f'{BASE_URL}/reviews/reviews/{review_id}/',
    json=update_data,
    headers={'Authorization': f'Bearer {tokens["customer"]}'}
)
print(f"Response status: {update_response.status_code}")
print(f"Response: {update_response.text}")

if update_response.status_code == 200:
    print_test_result(8, True, "Review updated successfully")
else:
    print_test_result(8, False, "Failed to update review")

# Step 10: Get restaurant reviews
print("\nGetting restaurant reviews:")
restaurant_reviews_response = requests.get(
    f'{BASE_URL}/reviews/reviews/restaurant_reviews/?restaurant_id={restaurant_id}',
    headers={'Authorization': f'Bearer {tokens["customer"]}'}
)
print(f"Response status: {restaurant_reviews_response.status_code}")
print(f"Response: {restaurant_reviews_response.text}")

if restaurant_reviews_response.status_code == 200:
    print_test_result(10, True, f"Found {len(restaurant_reviews_response.json())} reviews for restaurant")
else:
    print_test_result(10, False, "Failed to get restaurant reviews")

# Step 11: Delete review
print("\nDeleting review:")
delete_response = requests.delete(
    f'{BASE_URL}/reviews/reviews/{review_id}/',
    headers={'Authorization': f'Bearer {tokens["customer"]}'}
)
print(f"Response status: {delete_response.status_code}")

if delete_response.status_code == 204:
    print_test_result(9, True, "Review deleted successfully")
else:
    print_test_result(9, False, "Failed to delete review")

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