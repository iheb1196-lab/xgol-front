import { backendUrl } from "../../url";
import { consumeSSE } from "../practice/practiceService";
import { blobToWav } from "../../utils/audioWav";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

export async function coachingApi(route = "", method = "GET", body, signal) {
  const response = await fetch(`${backendUrl}/api/coaching${route}`, { method, headers: { ...headers(), "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}), signal });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Could not complete your request");
  return data;
}

export async function evaluateSnack({ blob, ...fields }, { onDelta, onSession, signal } = {}) {
  const form = new FormData();
  if (blob) form.append("audio", await blobToWav(blob, 12000), "coaching.wav");
  Object.entries(fields).forEach(([key, value]) => { if (value !== undefined && value !== null) form.append(key, String(value)); });
  const response = await fetch(`${backendUrl}/api/coaching/sessions`, { method: "POST", headers: headers(), body: form, signal });
  let result; let error; let savedId;
  await consumeSSE(response, event => {
    if (event.type === "delta") onDelta?.(event.text);
    if (event.type === "session") { savedId = event.sessionId; onSession?.(savedId); }
    if (event.type === "done") result = event;
    if (event.type === "error") error = Object.assign(new Error(event.message), { sessionId: event.sessionId });
  });
  if (error) throw error;
  if (!result) throw Object.assign(new Error("Connection interrupted. Check your saved attempts before submitting again."), { sessionId: savedId });
  return result;
}

export async function coachingAudio(id) {
  const response = await fetch(`${backendUrl}/api/coaching/sessions/${id}/audio`, { headers: headers() });
  if (!response.ok) throw new Error("Could not load this recording");
  return URL.createObjectURL(await response.blob());
}
