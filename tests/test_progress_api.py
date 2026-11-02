def test_progress_stream_not_found(client):
    response = client.get("/reports/progress/99999")
    assert response.status_code == 404

def test_progress_stream_success(client, test_report):
    response = client.get(f"/reports/progress/{test_report.id}")
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
