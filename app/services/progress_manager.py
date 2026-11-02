import asyncio
import json
from typing import Dict, AsyncGenerator
from datetime import datetime

class AnalysisProgressManager:
    """
    Manages in-memory streaming progress updates for report analysis.
    Supports asynchronous SSE generation and step dispatching.
    """
    def __init__(self):
        self._progress: Dict[int, dict] = {}
        self._queues: Dict[int, asyncio.Queue] = {}

    def init_report(self, report_id: int):
        self._progress[report_id] = {
            "report_id": report_id,
            "step": "initializing",
            "progress": 5,
            "message": "Initializing analysis pipeline...",
            "timestamp": datetime.utcnow().isoformat()
        }
        self._queues[report_id] = asyncio.Queue()

    def update_step(self, report_id: int, step: str, progress: int, message: str, data: dict = None):
        payload = {
            "report_id": report_id,
            "step": step,
            "progress": progress,
            "message": message,
            "data": data or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        self._progress[report_id] = payload
        if report_id in self._queues:
            self._queues[report_id].put_nowait(payload)

    async def stream_progress(self, report_id: int) -> AsyncGenerator[str, None]:
        """Generate Server-Sent Events (SSE) formatted text stream."""
        # Yield initial status if exists
        if report_id in self._progress:
            yield f"data: {json.dumps(self._progress[report_id])}\n\n"

        queue = self._queues.get(report_id)
        if not queue:
            queue = asyncio.Queue()
            self._queues[report_id] = queue

        while True:
            try:
                # Wait for next step update or timeout
                payload = await asyncio.wait_for(queue.get(), timeout=25.0)
                yield f"data: {json.dumps(payload)}\n\n"
                if payload.get("step") in ["completed", "error"]:
                    break
            except asyncio.TimeoutError:
                # Keep-alive heartbeat comment
                yield ": ping\n\n"

    def cleanup(self, report_id: int):
        self._progress.pop(report_id, None)
        self._queues.pop(report_id, None)

progress_manager = AnalysisProgressManager()
