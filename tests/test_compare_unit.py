from app.api.compare import parse_value

def test_parse_value_numeric():
    assert parse_value("14.5 g/dL") == 14.5
    assert parse_value("7,500 /cumm") == 7500.0
    assert parse_value("120") == 120.0

def test_parse_value_invalid_or_none():
    assert parse_value(None) is None
    assert parse_value("N/A") is None
    assert parse_value("") is None
