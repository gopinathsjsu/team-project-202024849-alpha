import requests
import json

# Base URL for the API
BASE_URL = 'http://127.0.0.1:8000/api'

# Login credentials
login_data = {
    'username': 'manager1',
    'password': 'testpass123'
}

# Test case descriptions
test_cases = [
    "1. Login as manager",
    "2. List all restaurants",
    "3. Create a new restaurant",
    "4. Update a restaurant",
    "5. Delete a restaurant",
    "6. Admin approval (if admin exists)",
    "7. Search/filter restaurants"
]

# Counter for successful test cases
success_count = 0
total_tests = len(test_cases)

# Step 1: Login to get the JWT token
login_response = requests.post(f'{BASE_URL}/users/login/', json=login_data)
if login_response.status_code == 200:
    token = login_response.json()['access']
    print('Login successful. Token:', token)
    print(f"✅ {test_cases[0]}: PASSED\n")
    success_count += 1
else:
    print('Login failed:', login_response.text)
    print(f"❌ {test_cases[0]}: FAILED\n")
    exit(1)

# Headers for authenticated requests
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Step 2: List all restaurants
list_response = requests.get(f'{BASE_URL}/restaurants/', headers=headers)
print('List Restaurants Response:', list_response.status_code)
print(list_response.json())
if list_response.status_code == 200:
    print(f"✅ {test_cases[1]}: PASSED\n")
    success_count += 1
else:
    print(f"❌ {test_cases[1]}: FAILED\n")

# Step 3: Create a new restaurant
create_data = {
    'name': 'Matching Restaurant',
    'address': '456 Test Ave',
    'city': 'Test City',
    'state': 'TS',
    'zip_code': '12345',
    'cuisine': 'Test Cuisine',
    'cost_rating': 3,
    'description': 'A restaurant that matches search criteria',
    'is_approved': True
}
create_response = requests.post(f'{BASE_URL}/restaurants/', headers=headers, json=create_data)
print('Create Restaurant Response:', create_response.status_code)
print(create_response.json())
if create_response.status_code == 201:
    print(f"✅ {test_cases[2]}: PASSED\n")
    success_count += 1
else:
    print(f"❌ {test_cases[2]}: FAILED\n")

# Step 4: Update the restaurant (assuming the first restaurant in the list)
if list_response.status_code == 200 and list_response.json():
    restaurant_id = list_response.json()[0]['id']
    update_data = {
        'name': 'Updated Restaurant Name'
    }
    update_response = requests.patch(f'{BASE_URL}/restaurants/{restaurant_id}/', headers=headers, json=update_data)
    print('Update Restaurant Response:', update_response.status_code)
    print(update_response.json())
    if update_response.status_code == 200:
        print(f"✅ {test_cases[3]}: PASSED\n")
        success_count += 1
    else:
        print(f"❌ {test_cases[3]}: FAILED\n")

    # Step 5: Delete the restaurant
    delete_response = requests.delete(f'{BASE_URL}/restaurants/{restaurant_id}/', headers=headers)
    print('Delete Restaurant Response:', delete_response.status_code)
    if delete_response.status_code == 204:
        print(f"✅ {test_cases[4]}: PASSED\n")
        success_count += 1
    else:
        print(f"❌ {test_cases[4]}: FAILED\n")

# Step 6: Test admin approval (only if an admin user exists)
admin_login_data = {
    'username': 'admin',  # Replace with your admin username
    'password': 'testpassword'  # Replace with your admin password
}
print("\nTesting Admin Approval:")
print(f"Attempting to login as admin with username: {admin_login_data['username']}")
admin_login_response = requests.post(f'{BASE_URL}/users/login/', json=admin_login_data)
print(f"Admin login response status: {admin_login_response.status_code}")
print(f"Admin login response: {admin_login_response.text}")

if admin_login_response.status_code == 200:
    admin_token = admin_login_response.json()['access']
    admin_headers = {
        'Authorization': f'Bearer {admin_token}',
        'Content-Type': 'application/json'
    }
    
    # Verify admin user's role
    print("\nVerifying admin user's role:")
    profile_response = requests.get(f'{BASE_URL}/users/profile/', headers=admin_headers)
    print(f"Profile response status: {profile_response.status_code}")
    print(f"Profile response: {profile_response.text}")
    
    if profile_response.status_code == 200:
        user_role = profile_response.json().get('role', 'unknown')
        print(f"User role: {user_role}")
        if user_role != 'admin':
            print("❌ User does not have admin privileges!")
            print("Please ensure the user has the 'admin' role in the database.")
    else:
        print("❌ Failed to fetch user profile!")

    # Get the latest restaurant ID from the list response
    list_response = requests.get(f'{BASE_URL}/restaurants/', headers=headers)
    if list_response.status_code == 200 and list_response.json():
        latest_restaurant = list_response.json()[0]  # Get the first (most recent) restaurant
        restaurant_id = latest_restaurant['id']
        print(f"\nFound restaurant to approve - ID: {restaurant_id}, Name: {latest_restaurant['name']}")
        
        # Attempt to approve restaurant
        approve_data = {'is_approved': True}
        print(f"\nAttempting to approve restaurant ID: {restaurant_id}")
        approve_response = requests.patch(f'{BASE_URL}/restaurants/{restaurant_id}/approve/', headers=admin_headers, json=approve_data)
        print('Admin Approve Restaurant Response:', approve_response.status_code)
        print('Admin Approve Restaurant Response:', approve_response.json())
        if approve_response.status_code == 200:
            print(f"✅ {test_cases[5]}: PASSED\n")
            success_count += 1
        else:
            print(f"❌ {test_cases[5]}: FAILED - Status code: {approve_response.status_code}\n")
    else:
        print("❌ No restaurants found to approve!")
        print(f"❌ {test_cases[5]}: FAILED - No restaurants available\n")
else:
    print(f"❌ {test_cases[5]}: FAILED - Admin login failed with status code: {admin_login_response.status_code}")
    print("Please ensure you have created an admin user with the correct credentials.")
    print("Expected admin credentials:")
    print(f"  Username: {admin_login_data['username']}")
    print(f"  Password: {admin_login_data['password']}\n")

# Step 7: Test search/filter restaurants
search_params = {
    'city': 'Test City',
    'state': 'TS',
    'zip_code': '12345'
}
search_response = requests.get(f'{BASE_URL}/restaurants/search/', headers=headers, params=search_params)
print('Search Restaurants Response:', search_response.status_code)
print(search_response.json())
print(f"Response length: {len(search_response.json())}")
if search_response.status_code == 200 and len(search_response.json()) > 0:
    print(f"✅ {test_cases[6]}: PASSED\n")
    success_count += 1
else:
    print(f"❌ {test_cases[6]}: FAILED\n")

# Print summary
print("="*50)
print(f'Test Summary: {success_count}/{total_tests} tests passed.')
print("="*50)
print('Passed test cases:')
for i in range(success_count):
    print(f"✅ {test_cases[i]}")
print('\nFailed test cases:')
for i in range(success_count, total_tests):
    print(f"❌ {test_cases[i]}")
print("="*50) 