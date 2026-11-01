from app.api.auth import create_access_token

def test_compare_two_reports_success(client, test_user, test_report, test_second_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get(f"/reports/compare/{test_report.id}/{test_second_report.id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "comparisons" in data
    assert "summary" in data
    assert data["summary"]["total_params"] >= 1

    # Check that Hemoglobin changed from normal to low (worsened)
    hb_comp = next((c for c in data["comparisons"] if c["parameter"] == "Hemoglobin"), None)
    assert hb_comp is not None
    assert hb_comp["change"] == "worsened"

def test_compare_reports_not_found(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get(f"/reports/compare/{test_report.id}/99999", headers=headers)
    assert response.status_code == 404
