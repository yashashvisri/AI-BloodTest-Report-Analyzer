from app.services.analyzer import analyze_parameters

def test_analyze_normal_parameters():
    params = {"hemoglobin": 14.0}
    analysis = analyze_parameters(params)
    assert "hemoglobin" in analysis
    assert analysis["hemoglobin"]["status"] == "Normal"

def test_analyze_abnormal_parameters():
    params = {
        "hemoglobin": 9.5,   # Low
        "wbc": 15000          # High
    }
    analysis = analyze_parameters(params)
    assert analysis["hemoglobin"]["status"] == "Low"
    assert analysis["wbc"]["status"] == "High"
