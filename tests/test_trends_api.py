from app.api.auth import create_access_token

def test_get_patient_trends(client, test_user, test_report, test_second_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/trends/John%20Doe", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["patient_name"] == "John Doe"
    assert "trends" in data
    assert len(data["trends"]) == 2
    assert data["trends"][0]["name"] == "Test 1"
    assert data["trends"][1]["name"] == "Test 2"

def test_get_trends_no_patient_found(client, test_user):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/trends/NobodyHere", headers=headers)
    assert response.status_code == 404
