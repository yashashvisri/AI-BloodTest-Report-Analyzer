import pytest
from app.services.progress_manager import AnalysisProgressManager

def test_progress_manager_lifecycle():
    pm = AnalysisProgressManager()
    pm.init_report(99)
    assert 99 in pm._progress
    assert pm._progress[99]["progress"] == 5
    assert pm._progress[99]["step"] == "initializing"

    pm.update_step(99, "ocr", 25, "OCR Extraction running")
    assert pm._progress[99]["progress"] == 25
    assert pm._progress[99]["step"] == "ocr"

    pm.update_step(99, "completed", 100, "Done")
    assert pm._progress[99]["progress"] == 100
    assert pm._progress[99]["step"] == "completed"

    pm.cleanup(99)
    assert 99 not in pm._progress
