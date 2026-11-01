from unittest.mock import patch
from app.api.auth import create_access_token

def test_report_chat_rag_mocked(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    mock_answer = "Your hemoglobin level is 14.5 g/dL, which is well within normal limits."

    with patch("app.api.chat.chat_with_report", return_value=mock_answer):
        payload = {"question": "What is my hemoglobin level?"}
        response = client.post(f"/reports/{test_report.id}/chat", json=payload, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "answer" in data
        assert "14.5 g/dL" in data["answer"]
