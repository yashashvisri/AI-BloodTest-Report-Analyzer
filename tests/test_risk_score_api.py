from unittest.mock import patch
from app.api.auth import create_access_token
import json

def test_get_health_risk_score_mocked(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    mock_gemini_score = {
        "overall_score": 85,
        "risk_level": "Low",
        "categories": [
            {"name": "Cardiovascular", "score": 90, "status": "Low Risk"}
        ],
        "top_concerns": [],
        "positive_indicators": ["Normal hemoglobin and WBC count"]
    }

    with patch("app.api.health_score.generate_health_risk_score", return_value=json.dumps(mock_gemini_score)):
        response = client.get(f"/reports/{test_report.id}/risk-score", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "risk_assessment" in data
        assessment = data["risk_assessment"]
        assert assessment["overall_score"] == 85
        assert assessment["risk_level"] == "Low"
        assert "Normal hemoglobin" in assessment["positive_indicators"][0]
