import axios from "axios";
import { backendUrl } from "../../url";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

/**
 * Consumes a Server-Sent-Events stream over fetch and forwards each parsed
 * JSON payload to `onEvent`. Resolves once the stream is fully consumed.
 */
export const consumeSSE = async (response, onEvent) => {
  if (!response.ok || !response.body) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch (e) {
      /* non-JSON error body */
    }
    throw new Error(message);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const dispatchEvent = (rawEvent) => {
    const data = rawEvent
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!data) return;

    let event;
    try {
      event = JSON.parse(data);
    } catch (_error) {
      return;
    }
    onEvent(event);
  };

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split(/\r?\n\r?\n/);
    buffer = parts.pop();
    parts.forEach(dispatchEvent);
  }

  buffer += decoder.decode();
  if (buffer.trim()) dispatchEvent(buffer);
};

/**
 * Streams an AI-improved version of a script.
 * Calls onDelta(text) as the improved script arrives.
 * Resolves with { text, credits } once complete.
 */
export const improveScriptStream = async (
  { text, objective, duration },
  { onDelta, signal } = {}
) => {
  const response = await fetch(`${backendUrl}/api/practice/improve-script`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ text, objective, duration }),
    signal,
  });

  let result = null;
  let streamError = null;
  await consumeSSE(response, (event) => {
    if (event.type === "delta" && onDelta) onDelta(event.text);
    if (event.type === "done") result = event;
    if (event.type === "error") streamError = new Error(event.message);
  });
  if (streamError) throw streamError;
  if (!result) {
    throw new Error("The improvement stream ended unexpectedly");
  }
  return result;
};

/**
 * Submits a practice recording and streams the AI feedback.
 * Calls onDelta(text) for each feedback fragment.
 * Resolves with { sessionId, feedback, credits } once complete.
 */
export const submitPracticeStream = async (
  { audioBlob, speechId, objective, duration },
  { onDelta, onSession, onStatus, signal } = {}
) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "practice.wav");
  formData.append("speech", speechId);
  formData.append("objective", objective || "");
  formData.append("duration", duration || 0);

  const response = await fetch(`${backendUrl}/api/practice/sessions`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
    signal,
  });

  let result = null;
  let streamError = null;
  await consumeSSE(response, (event) => {
    if (event.type === "session" && onSession) onSession(event.sessionId);
    if (event.type === "status" && onStatus) onStatus(event.stage);
    if (event.type === "delta" && onDelta) onDelta(event.text);
    if (event.type === "done") result = event;
    if (event.type === "error") {
      streamError = Object.assign(new Error(event.message), {
        stage: event.stage,
        sessionId: event.sessionId,
        audioSaved: event.audioSaved,
      });
    }
  });
  if (streamError) throw streamError;
  if (!result) {
    throw new Error("The feedback stream ended unexpectedly");
  }
  return result;
};

export const getAllSessions = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/practice/sessions`, {
      headers: { "Content-Type": "application/json", ...authHeader() },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getOneSession = async (sessionId) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/practice/sessions/${sessionId}`,
      { headers: { "Content-Type": "application/json", ...authHeader() } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const getSpeechSessions = async (speechId) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/practice/speeches/${speechId}/sessions`,
      { headers: { "Content-Type": "application/json", ...authHeader() } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

export const deleteSessionService = async (sessionId) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/practice/sessions/${sessionId}`,
      { headers: { "Content-Type": "application/json", ...authHeader() } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message;
  }
};

/** Fetches the recording audio (auth-protected) and returns an object URL. */
export const getSessionAudioUrl = async (sessionId) => {
  const response = await fetch(
    `${backendUrl}/api/practice/sessions/${sessionId}/audio`,
    { headers: authHeader() }
  );
  if (!response.ok) {
    throw new Error("Could not load the recording");
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
