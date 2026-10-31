from app.services.analyzer import analyze_parameters

def test_analyze_normal_parameters():
    params = {"Hemoglobin": 14.0}
    analysis = analyze_parameters(params)
    assert "Hemoglobin" in analysis
    assert analysis["Hemoglobin"]["status"] == "normal"

def test_analyze_abnormal_parameters():
    params = {
        "Hemoglobin": 9.5,   # Low
        "Blood Sugar": 180.0  # High
    }
    analysis = analyze_parameters(params)
    if "Hemoglobin" in analysis:
        assert analysis["Hemoglobin"]["status"] == "low"
    if "Blood Sugar" in analysis:
        assert analysis["Blood Sugar"]["status"] == "high"
