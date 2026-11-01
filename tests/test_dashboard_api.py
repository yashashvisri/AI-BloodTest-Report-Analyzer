from app.api.auth import create_access_token

def test_dashboard_stats(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_reports" in data
    assert "total_patients" in data
    assert "overall_health_score" in data
    assert data["total_reports"] >= 1
