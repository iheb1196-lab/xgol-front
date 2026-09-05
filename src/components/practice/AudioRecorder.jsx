/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import "./audioRecorder.scss";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import { MAX_RECORDING_SECONDS } from "../../constants/practice.constant";

const BAR_COUNT = 28;

export const formatSeconds = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

/**
 * Audio-only recorder.
 * States: idle -> recording -> review. Calls onRecordingChange(blob|null, durationSeconds)
 * whenever a take is completed or discarded.
 */
const AudioRecorder = ({ onRecordingChange, disabled, prompt }) => {
  const [status, setStatus] = useState("idle"); // idle | recording | review | denied
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState(new Array(BAR_COUNT).fill(0));
  const [audioUrl, setAudioUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);
  const levelsRef = useRef(new Array(BAR_COUNT).fill(0));
  const durationRef = useRef(0);
  const audioUrlRef = useRef(null);
  const mountedRef = useRef(true);
  const requestingRef = useRef(false);

  const cleanupStream = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.ondataavailable = null;
        if (mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
      }
      cleanupStream();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  const startLevelMeter = (stream) => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i += 1) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      levelsRef.current = [
        ...levelsRef.current.slice(1),
        Math.min(1, rms * 4),
      ];
      setLevels(levelsRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const startRecording = async () => {
    if (disabled || requestingRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setErrorMessage("Recording is unavailable in this browser. Try a supported browser over HTTPS, or use text practice.");
      setStatus("denied");
      return;
    }
    requestingRef.current = true;
    setStatus("requesting");
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      if (!mountedRef.current) { stream.getTracks().forEach(track => track.stop()); return; }
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        if (!mountedRef.current) { cleanupStream(); return; }
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          audioUrlRef.current = url;
          return url;
        });
        setStatus("review");
        onRecordingChange?.(blob, durationRef.current);
        cleanupStream();
      };

      recorder.start(250);
      startTimeRef.current = Date.now();
      durationRef.current = 0;
      setElapsed(0);
      setStatus("recording");
      // Recording still works if this browser cannot create a visual level meter.
      try { startLevelMeter(stream); } catch (_) { /* visual meter is optional */ }

      timerRef.current = setInterval(() => {
        const seconds = (Date.now() - startTimeRef.current) / 1000;
        durationRef.current = seconds;
        setElapsed(seconds);
        if (seconds >= MAX_RECORDING_SECONDS) {
          stopRecording();
        }
      }, 250);
    } catch (error) {
      cleanupStream();
      if (!mountedRef.current) return;
      setStatus("denied");
      setErrorMessage(
        "Microphone access is blocked. Allow the microphone in your browser and try again."
      );
    } finally {
      requestingRef.current = false;
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const discardRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioUrlRef.current = null;
    setAudioUrl(null);
    setElapsed(0);
    durationRef.current = 0;
    levelsRef.current = new Array(BAR_COUNT).fill(0);
    setLevels(levelsRef.current);
    setStatus("idle");
    onRecordingChange?.(null, 0);
  };

  const remaining = Math.max(0, MAX_RECORDING_SECONDS - elapsed);

  return (
    <div className={classNames("audio_recorder", { disabled })}>
      {status === "idle" || status === "denied" || status === "requesting" ? (
        <div className="recorder_idle">
          <button
            type="button"
            className="mic_button"
            onClick={startRecording}
            disabled={disabled || status === "requesting"}
            aria-label="Start recording"
          >
            <Icon icon="mdi:microphone" width={34} />
          </button>
          <h3>{status === "requesting" ? "Allow microphone access…" : "Ready when you are"}</h3>
          <p>
            {prompt || "Read your script out loud."} You can record up to{" "}
            {formatSeconds(MAX_RECORDING_SECONDS)} and re-record as many times
            as you like.
          </p>
          {errorMessage && <span className="recorder_error">{errorMessage}</span>}
        </div>
      ) : status === "recording" ? (
        <div className="recorder_recording">
          <div className="recording_status">
            <span className="recording_dot" />
            <span className="recording_label">Recording</span>
            <span className="recording_time">{formatSeconds(elapsed)}</span>
            <span className="recording_remaining">
              {formatSeconds(remaining)} left
            </span>
          </div>
          <div className="level_bars" aria-hidden="true">
            {levels.map((level, index) => (
              <span
                key={index}
                style={{ height: `${8 + level * 40}px` }}
                className="level_bar"
              />
            ))}
          </div>
          <button type="button" className="stop_button" onClick={stopRecording}>
            <Icon icon="mdi:stop" width={22} />
            Stop recording
          </button>
        </div>
      ) : (
        <div className="recorder_review">
          <div className="review_header">
            <Icon icon="mdi:check-circle" width={22} className="review_check" />
            <span>
              Take recorded — {formatSeconds(durationRef.current)}
            </span>
          </div>
          <audio controls src={audioUrl} className="review_player" />
          <button
            type="button"
            className="retake_button"
            onClick={discardRecording}
            disabled={disabled}
          >
            <Icon icon="mdi:refresh" width={18} />
            Record again
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
