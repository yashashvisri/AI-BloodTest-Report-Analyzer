from unittest.mock import patch
from app.api.auth import create_access_token

def test_get_diet_plan_mocked(client, test_user, test_report):
    token = create_access_token({"sub": test_user.username, "role": test_user.role})
    headers = {"Authorization": f"Bearer {token}"}

    mock_diet_response = "### 7-Day Nutrition Plan\n- **Breakfast**: Oatmeal with blueberries\n- **Lunch**: Grilled chicken salad"

    with patch("app.ai.gemini_service.generate_diet_plan", return_value=mock_diet_response):
        response = client.get(f"/reports/{test_report.id}/diet-plan", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "diet_plan" in data
        assert "7-Day Nutrition Plan" in data["diet_plan"]
