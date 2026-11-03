"""
Clinical Critical Laboratory Value Rules Engine.
Detects panic values that require immediate medical attention.
"""

CRITICAL_THRESHOLDS = {
    "hemoglobin": {
        "critical_low": 7.0,
        "critical_high": 20.0,
        "unit": "g/dL",
        "condition_low": "Severe Anemia (Risk of cardiac compromise/hypoxia)",
        "condition_high": "Polycythemia Crisis (Hyperviscosity syndrome)"
    },
    "platelets": {
        "critical_low": 30000,
        "critical_high": 1000000,
        "unit": "/cumm",
        "condition_low": "Severe Thrombocytopenia (Critical spontaneous hemorrhage risk)",
        "condition_high": "Extreme Thrombocytosis (Thrombosis risk)"
    },
    "wbc": {
        "critical_low": 2000,
        "critical_high": 30000,
        "unit": "/cumm",
        "condition_low": "Severe Leukopenia / Neutropenia (Life-threatening infection risk)",
        "condition_high": "Severe Leukocytosis (Severe acute infection / leukemoid reaction)"
    },
    "blood_sugar": {
        "critical_low": 50.0,
        "critical_high": 350.0,
        "unit": "mg/dL",
        "condition_low": "Severe Hypoglycemia (Risk of loss of consciousness/seizure)",
        "condition_high": "Severe Hyperglycemia (Diabetic ketoacidosis/HHS risk)"
    }
}

def evaluate_critical_alerts(parameters: dict) -> list:
    """
    Evaluate parameters against critical panic bounds.
    Returns list of urgent clinical action alerts.
    """
    alerts = []
    if not parameters or not isinstance(parameters, dict):
        return alerts

    for key, val in parameters.items():
        if val is None:
            continue
        param_clean = key.lower().replace(" ", "_")

        # Try to match key against critical definitions
        matched_rule = None
        for rule_key, rule_bounds in CRITICAL_THRESHOLDS.items():
            if rule_key in param_clean or param_clean in rule_key:
                matched_rule = rule_bounds
                break

        if not matched_rule:
            continue

        try:
            num_val = float(''.join(c for c in str(val) if c.isdigit() or c == '.'))
        except (ValueError, TypeError):
            continue

        if num_val < matched_rule["critical_low"]:
            alerts.append({
                "parameter": key,
                "value": f"{num_val} {matched_rule['unit']}",
                "severity": "CRITICAL_LOW",
                "condition": matched_rule["condition_low"],
                "recommendation": "Immediate clinical evaluation and physician notification recommended."
            })
        elif num_val > matched_rule["critical_high"]:
            alerts.append({
                "parameter": key,
                "value": f"{num_val} {matched_rule['unit']}",
                "severity": "CRITICAL_HIGH",
                "condition": matched_rule["condition_high"],
                "recommendation": "Immediate clinical evaluation and physician notification recommended."
            })

    return alerts
