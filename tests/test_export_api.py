from app.api.auth import create_access_token

def test_export_reports_csv_success(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/reports/export/csv", headers=headers)
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "attachment; filename=blood_reports_export.csv" in response.headers.get("content-disposition", "")
    content = response.text
    assert "Patient Name" in content
    assert "Hemoglobin" in content
    assert test_report.patient_name in content

def test_export_reports_csv_no_reports(client, test_user):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/reports/export/csv", headers=headers)
    assert response.status_code == 404
    assert "No reports found" in response.json()["detail"]
