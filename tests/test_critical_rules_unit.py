from app.services.critical_rules import evaluate_critical_alerts

def test_critical_low_hemoglobin():
    params = {"hemoglobin": 6.2}
    alerts = evaluate_critical_alerts(params)
    assert len(alerts) == 1
    assert alerts[0]["severity"] == "CRITICAL_LOW"
    assert "Severe Anemia" in alerts[0]["condition"]

def test_critical_high_blood_sugar():
    params = {"blood_sugar": 420.0}
    alerts = evaluate_critical_alerts(params)
    assert len(alerts) == 1
    assert alerts[0]["severity"] == "CRITICAL_HIGH"
    assert "Severe Hyperglycemia" in alerts[0]["condition"]

def test_normal_parameters_no_alerts():
    params = {"hemoglobin": 14.5, "platelets": 250000, "wbc": 7500}
    alerts = evaluate_critical_alerts(params)
    assert len(alerts) == 0
