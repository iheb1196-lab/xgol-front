import { useCallback, useEffect, useRef, useState } from "react";
import { TAKE_SECONDS } from "./rehearsalData";

export default function useRehearsalRecorder(onComplete) {
  const [status, setStatus] = useState("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const recorder = useRef(null);
  const stream = useRef(null);
  const timer = useRef(null);
  const started = useRef(0);
  const mounted = useRef(true);
  const complete = useRef(onComplete);
  complete.current = onComplete;

  const release = useCallback(() => {
    clearInterval(timer.current);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, []);

  const stop = useCallback(() => {
    if (recorder.current?.state === "recording") {
      setStatus("stopping");
      clearInterval(timer.current);
      recorder.current.stop();
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (recorder.current) {
        recorder.current.onstop = null;
        recorder.current.ondataavailable = null;
        recorder.current.onerror = null;
        if (recorder.current.state !== "inactive") recorder.current.stop();
      }
      release();
    };
  }, [release]);

  const start = async () => {
    if (["requesting", "recording", "stopping"].includes(status)) return;
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Recording isn’t available here. Open this app in a browser with microphone support over HTTPS or localhost.");
      return;
    }
    setStatus("requesting");
    try {
      const input = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      if (!mounted.current) {
        input.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = input;
      const media = new MediaRecorder(input);
      recorder.current = media;
      const chunks = [];
      media.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      media.onstop = () => {
        const duration = Math.min(TAKE_SECONDS, (Date.now() - started.current) / 1000);
        release();
        if (!mounted.current) return;
        setStatus("idle");
        const blob = new Blob(chunks, { type: media.mimeType || "audio/webm" });
        if (!blob.size) {
          setError("No audio was captured. Check your microphone and try again.");
          return;
        }
        complete.current({ blob, duration });
      };
      media.onerror = () => {
        media.onstop = null;
        if (media.state !== "inactive") media.stop();
        release();
        if (mounted.current) {
          setStatus("idle");
          setError("Recording was interrupted. Check your microphone and try again.");
        }
      };
      media.start(250);
      started.current = Date.now();
      setElapsed(0);
      setStatus("recording");
      timer.current = setInterval(() => {
        const seconds = (Date.now() - started.current) / 1000;
        setElapsed(Math.min(TAKE_SECONDS, seconds));
        if (seconds >= TAKE_SECONDS) stop();
      }, 200);
    } catch (err) {
      release();
      if (!mounted.current) return;
      setStatus("idle");
      setError(err.name === "NotAllowedError"
        ? "Microphone access was denied. Allow it in your browser settings, then try again."
        : "We couldn’t start your microphone. Check that it’s connected and try again.");
    }
  };

  return { start, stop, status, elapsed, error };
}
