from unittest.mock import patch
from app.api.auth import create_access_token

def test_translate_summary_mocked(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    mock_translation = "सभी पैरामीटर सामान्य सीमाओं के भीतर हैं।"

    with patch("app.api.translate.translate_summary", return_value=mock_translation):
        payload = {"language": "hi"}
        response = client.post(f"/reports/{test_report.id}/translate", json=payload, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "translated_summary" in data
        assert "सामान्य" in data["translated_summary"]
