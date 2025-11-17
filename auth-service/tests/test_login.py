import pytest
import requests


BASE_URL = "http://localhost:8000"


def test_registration_success():
    response = requests.post(f"{BASE_URL}/register", json={
        "username": "testuser",
        "password": "TestPassword123",
        "email": "testuser@example.com"
    })
    assert response.status_code == 201
    assert response.json()["message"] == "User registered successfully"


def test_registration_missing_username():
    response = requests.post(f"{BASE_URL}/register", json={
        "password": "TestPassword123",
        "email": "testuser@example.com"
    })
    assert response.status_code == 400
    assert response.json()["error"] == "Username is required"


def test_registration_missing_password():
    response = requests.post(f"{BASE_URL}/register", json={
        "username": "testuser",
        "email": "testuser@example.com"
    })
    assert response.status_code == 400
    assert response.json()["error"] == "Password is required"


def test_registration_missing_email():
    response = requests.post(f"{BASE_URL}/register", json={
        "username": "testuser",
        "password": "TestPassword123"
    })
    assert response.status_code == 400
    assert response.json()["error"] == "Email is required"


def test_registration_invalid_email():
    response = requests.post(f"{BASE_URL}/register", json={
        "username": "testuser",
        "password": "TestPassword123",
        "email": "invalid-email"
    })
    assert response.status_code == 400
    assert response.json()["error"] == "Invalid email format"
