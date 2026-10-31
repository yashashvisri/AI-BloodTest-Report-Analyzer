from app.api.auth import create_access_token

def test_patient_cannot_access_admin_endpoints(client, test_user):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/admin/users", headers=headers)
    assert response.status_code == 403
    assert "Admin privileges required" in response.json()["detail"]

def test_admin_can_access_user_list(client, test_admin, test_user):
    token = create_access_token({"sub": test_admin.username, "role": test_admin.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/admin/users", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "users" in data
    assert any(u["username"] == test_user.username for u in data["users"])

def test_admin_change_user_role(client, test_admin, test_user):
    token = create_access_token({"sub": test_admin.username, "role": test_admin.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.put(f"/admin/users/{test_user.id}/role", json={"role": "doctor"}, headers=headers)
    assert response.status_code == 200
    assert "Role updated from" in response.json()["message"]
    assert "doctor" in response.json()["message"]
