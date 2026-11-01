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

def test_search_reports_by_patient_name(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/reports/?search=John", headers=headers)
    assert response.status_code == 200
    assert len(response.json()["reports"]) == 1

    response_empty = client.get("/reports/?search=NonExistentPatient", headers=headers)
    assert response_empty.status_code == 200
    assert len(response_empty.json()["reports"]) == 0

def test_get_single_report_details(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get(f"/reports/{test_report.id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_report.id
    assert data["patient_name"] == test_report.patient_name
    assert data["original_filename"] == "sample_report.pdf"

def test_get_nonexistent_report_404(client, test_user):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/reports/99999", headers=headers)
    assert response.status_code == 404

def test_doctor_can_access_patient_reports(client, test_doctor, test_report):
    token = create_access_token({"sub": test_doctor.username, "role": test_doctor.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get(f"/reports/{test_report.id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["patient_name"] == test_report.patient_name

def test_patient_cannot_access_other_patient_report(client, db_session, test_report):
    from app.database.models import User
    from app.api.auth import get_password_hash

    other_user = User(
        username="otherpatient",
        name="Other",
        email="other@example.com",
        hashed_password=get_password_hash("pass123"),
        role="patient",
        is_active="active"
    )
    db_session.add(other_user)
    db_session.commit()

    token = create_access_token({"sub": other_user.username, "role": other_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get(f"/reports/{test_report.id}", headers=headers)
    assert response.status_code == 404

def test_delete_report_success(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.delete(f"/reports/{test_report.id}", headers=headers)
    assert response.status_code == 200
    assert "deleted successfully" in response.json()["message"].lower()

    verify_resp = client.get(f"/reports/{test_report.id}", headers=headers)
    assert verify_resp.status_code == 404
