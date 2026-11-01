from app.api.auth import create_access_token

def test_update_user_profile(client, test_user):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    payload = {"name": "Updated Name", "email": "updated@example.com"}
    response = client.put("/users/me", json=payload, headers=headers)
    assert response.status_code == 200
    assert "Profile updated successfully" in response.json()["message"]

def test_unauthenticated_profile_access(client):
    response = client.put("/users/me", json={"name": "Hacker", "email": "hack@example.com"})
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
    assert "Incorrect current password" in response.json()["detail"]
from app.api.auth import create_access_token

def test_delete_user_account_cascades(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.delete("/users/me", headers=headers)
    assert response.status_code == 200
    assert "Account deleted successfully" in response.json()["message"]

    # Verify login no longer works
    login_resp = client.post("/auth/login", data={"username": test_user.username, "password": "password123"})
    assert login_resp.status_code == 401
