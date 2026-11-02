import { useState, useEffect, useRef } from "react";

export function useAnalysisProgress(reportId, isAnalyzing, onComplete) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("initializing");
  const [statusMessage, setStatusMessage] = useState("");
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!isAnalyzing || !reportId) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      return;
    }

    setProgress(5);
    setStatusMessage("Opening real-time event stream...");
    const url = `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/reports/progress/${reportId}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.progress) setProgress(payload.progress);
        if (payload.step) setCurrentStep(payload.step);
        if (payload.message) setStatusMessage(payload.message);

        if (payload.step === "completed") {
          es.close();
          if (onComplete) onComplete(payload.data);
        }
      } catch (err) {
        console.warn("SSE parse error:", err);
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, [reportId, isAnalyzing]);

  return { progress, currentStep, statusMessage };
}
