import subprocess

def test_frontend_package_json_exists():
    import json
    with open("frontend/package.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data["name"] == "frontend"
    assert "build" in data["scripts"]
    assert "vite" in data["devDependencies"] or "vite" in data["dependencies"]
