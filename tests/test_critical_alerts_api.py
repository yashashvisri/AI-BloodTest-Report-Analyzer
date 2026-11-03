from app.api.auth import create_access_token

def test_get_critical_alerts_api(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get(f"/reports/{test_report.id}/critical-alerts", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "has_critical_alerts" in data
    assert "alerts" in data
