import requests
import json
from datetime import datetime, timedelta
import sys

BASE_URL = 'http://localhost:8000/api'

def print_test_result(test_name, passed, response=None):
    status = "✅ PASSED" if passed else "❌ FAILED"
    print(f"{status}: {test_name}")
    if not passed and response:
        print(f"Response: {response.status_code}")
        print(f"Error: {response.text}")

def login(username, password):
    response = requests.post(f'{BASE_URL}/users/login/', json={
        'username': username,
        'password': password
    })
    if response.status_code == 200:
        return response.json()['access']
    return None

def run_filter_tests():
    # Login as admin for full access
    admin_token = login('admin', 'testpassword')
    if not admin_token:
        print("Failed to login as admin")
        return

    headers = {'Authorization': f'Bearer {admin_token}'}
    test_results = {}

    # Test Restaurant Filtering
    print("\nTesting Restaurant Filtering:")
    
    # Test name filter
    response = requests.get(f'{BASE_URL}/restaurants/?name=Italian', headers=headers)
    test_results['Restaurant name filter'] = response.status_code == 200
    
    # Test city filter
    response = requests.get(f'{BASE_URL}/restaurants/?city=New York', headers=headers)
    test_results['Restaurant city filter'] = response.status_code == 200
    
    # Test cost range filter
    response = requests.get(f'{BASE_URL}/restaurants/?min_cost=3&max_cost=5', headers=headers)
    test_results['Restaurant cost range filter'] = response.status_code == 200
    
    # Test cuisine filter
    response = requests.get(f'{BASE_URL}/restaurants/?cuisine=Italian', headers=headers)
    test_results['Restaurant cuisine filter'] = response.status_code == 200

    # Test Booking Filtering
    print("\nTesting Booking Filtering:")
    
    # Test date range filter
    today = datetime.now().date()
    next_week = today + timedelta(days=7)
    response = requests.get(
        f'{BASE_URL}/bookings/?min_date={today}&max_date={next_week}',
        headers=headers
    )
    test_results['Booking date range filter'] = response.status_code == 200
    
    # Test status filter
    response = requests.get(f'{BASE_URL}/bookings/?status=confirmed', headers=headers)
    test_results['Booking status filter'] = response.status_code == 200
    
    # Test party size filter
    response = requests.get(f'{BASE_URL}/bookings/?min_party_size=2&max_party_size=4', headers=headers)
    test_results['Booking party size filter'] = response.status_code == 200
    
    # Test upcoming filter
    response = requests.get(f'{BASE_URL}/bookings/?upcoming=true', headers=headers)
    test_results['Booking upcoming filter'] = response.status_code == 200

    # Test Review Filtering
    print("\nTesting Review Filtering:")
    
    # Test rating range filter
    response = requests.get(f'{BASE_URL}/reviews/?min_rating=4&max_rating=5', headers=headers)
    test_results['Review rating range filter'] = response.status_code == 200
    
    # Test date range filter
    last_month = datetime.now() - timedelta(days=30)
    response = requests.get(
        f'{BASE_URL}/reviews/?min_date={last_month.isoformat()}',
        headers=headers
    )
    test_results['Review date range filter'] = response.status_code == 200
    
    # Test has_comment filter
    response = requests.get(f'{BASE_URL}/reviews/?has_comment=true', headers=headers)
    test_results['Review has_comment filter'] = response.status_code == 200

    # Print Results
    print("\nTest Results Summary:")
    print("=" * 50)
    total_tests = len(test_results)
    passed_tests = sum(1 for result in test_results.values() if result)
    
    for test_name, passed in test_results.items():
        print_test_result(test_name, passed)
    
    print("\nSummary:")
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.2f}%")

if __name__ == '__main__':
    run_filter_tests() 