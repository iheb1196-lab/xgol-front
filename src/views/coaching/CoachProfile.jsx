import { useState } from "react";
import { coachingApi } from "../../features/coaching/coachingService";
import { profileFields } from "./coachingData";

export default function CoachProfile({ profile, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => profileFields(profile));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const field = (key, label, placeholder, maxLength = 200) => <label>{label}<input value={draft[key]} maxLength={maxLength} required={key === "goal" || key === "language"} placeholder={placeholder} onChange={e => setDraft({ ...draft, [key]: e.target.value })} /></label>;
  const select = (key, label, options) => <label>{label}<select value={draft[key]} onChange={e => setDraft({ ...draft, [key]: key === "minutes" ? Number(e.target.value) : e.target.value })}>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
  return <form className="coach-profile coach-card" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setError("");
    try { const result = await coachingApi("/profile", "PUT", draft); onSave(result.profile); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }}>
    <span className="coach-eyebrow">YOUR COACH SHOULD KNOW YOU</span><h2>Make this personal.</h2><p>These details guide your AI feedback and the practice you come back to. You can change them anytime.</p>
    <fieldset disabled={busy} className="coach-form-grid">
      {field("goal", "What would you like to achieve?", "Win support for my first team proposal", 300)}
      {field("role", "Your role or situation", "Founder, student, new manager…", 120)}
      {field("audience", "Who do you speak to?", "Investors, customers, my team…")}
      {field("challenge", "What feels hardest?", "I rush when someone challenges my idea", 500)}
      {select("level", "Your experience", [["starting", "Getting started"], ["developing", "Building confidence"], ["experienced", "Fine-tuning my delivery"]])}
      {select("style", "How should your coach respond?", [["supportive", "Encouraging and gentle"], ["direct", "Direct and practical"], ["challenging", "Challenge me to go further"]])}
      {field("language", "Feedback language", "English", 60)}
      {select("minutes", "Time for a practice break", [[2, "2 minutes"], [5, "5 minutes"], [10, "10 minutes"]])}
      {field("eventName", "An upcoming speaking moment (optional)", "My pitch to the investment committee")}
      <label>When is it? (optional)<input type="date" value={draft.eventDate} onChange={e => setDraft({ ...draft, eventDate: e.target.value })} /></label>
    </fieldset>
    {error && <p role="alert" className="coach-error">{error}</p>}
    <div className="coach-actions"><button className="coach-primary" disabled={busy}>{busy ? "Saving…" : "Save my coaching preferences"}</button>{onCancel && <button type="button" onClick={onCancel} disabled={busy}>Cancel</button>}</div>
  </form>;
}
