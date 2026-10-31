from app.parser.blood_parser import extract_blood_parameters

def test_extract_hemoglobin():
    sample_text = "Hemoglobin 13.5 g/dL Normal range 12.0 - 15.0"
    params = extract_blood_parameters(sample_text)
    assert "hemoglobin" in params
    assert params["hemoglobin"] == 13.5

def test_extract_multiple_parameters():
    sample_text = """
    COMPLETE BLOOD COUNT
    Hemoglobin 14.2 g/dL
    RBC Count 4.8 mill/cumm
    WBC Count 7500 /cumm
    Platelet Count 250000 /cumm
    """
    params = extract_blood_parameters(sample_text)
    assert "hemoglobin" in params
    assert "platelets" in params
    assert params["hemoglobin"] == 14.2
    assert params["platelets"] == 250000.0

def test_empty_text_returns_none_values():
    params = extract_blood_parameters("")
    assert "hemoglobin" in params
    assert params["hemoglobin"] is None
