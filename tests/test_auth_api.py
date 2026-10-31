def test_signup_success(client):
    payload = {
        "username": "newuser",
        "name": "New User",
        "email": "newuser@example.com",
        "password": "strongpassword123"
    }
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newuser"
    assert "id" in data

def test_signup_duplicate_username(client, test_user):
    payload = {
        "username": test_user.username,
        "name": "Duplicate User",
        "email": "diff@example.com",
        "password": "password123"
    }
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == 400
    assert "Username already registered" in response.json()["detail"]
