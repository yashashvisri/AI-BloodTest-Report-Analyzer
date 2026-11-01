from app.api.auth import create_access_token

def test_list_reports_authenticated(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/reports/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "reports" in data
    assert len(data["reports"]) >= 1
    assert data["reports"][0]["patient_name"] == "John Doe"

def test_list_reports_unauthenticated(client):
    response = client.get("/reports/")
    assert response.status_code == 401
