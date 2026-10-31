from app.api.auth import create_access_token

def test_update_user_profile(client, test_user):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    payload = {"name": "Updated Name", "email": "updated@example.com"}
    response = client.put("/users/me/profile", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"
    assert response.json()["email"] == "updated@example.com"

def test_unauthenticated_profile_access(client):
    response = client.put("/users/me/profile", json={"name": "Hacker"})
    assert response.status_code == 401


def test_change_password_success(client, test_user):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "current_password": "password123",
        "new_password": "BrandNewPassword123!"
    }
    response = client.put("/users/me/password", json=payload, headers=headers)
    assert response.status_code == 200
    assert "Password updated successfully" in response.json()["message"]

def test_change_password_wrong_current(client, test_user):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "current_password": "wrongOldPassword",
        "new_password": "BrandNewPassword123!"
    }
    response = client.put("/users/me/password", json=payload, headers=headers)
    assert response.status_code == 400
