import { useEffect, useState } from "react";
import { coachingApi } from "../../features/coaching/coachingService";
import CoachingSession from "./CoachingSession";
import "./coaching.scss";

function ReviewForm({ session, onSave }) {
  const [feedback, setFeedback] = useState("");
  const [focus, setFocus] = useState("");
  const [exercise, setExercise] = useState("");
  const [moments, setMoments] = useState([]);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const reviewed = Boolean(session.review?.reviewedAt);
  if (reviewed && (!session.review.question || session.review.answer)) return null;
  return <form className="coach-card" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setError("");
    try { const data = await coachingApi(`/sessions/${session._id}/${reviewed ? "review-answer" : "review"}`, "POST", reviewed ? { answer } : { feedback, focus, exercise, moments }); onSave(data.session); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }}><h2>{reviewed ? "Answer the learner’s follow-up" : "Leave one useful next step"}</h2><fieldset disabled={busy}>{reviewed ? <><p>{session.review.question}</p><label>Your reply<textarea value={answer} onChange={e => setAnswer(e.target.value)} minLength={3} maxLength={2000} required /></label></> : <>
    <label>Your review<textarea value={feedback} onChange={e => setFeedback(e.target.value)} minLength={10} maxLength={4000} required /></label>
    <label>One change to practise<input value={focus} onChange={e => setFocus(e.target.value)} maxLength={350} required /></label>
    <label>A two-minute exercise<textarea value={exercise} onChange={e => setExercise(e.target.value)} maxLength={650} required /></label>
    {moments.map((moment, i) => <div className="coach-form-grid" key={i}><label>Moment in seconds<input type="number" min={0} max={session.duration} required value={moment.seconds} onChange={e => setMoments(moments.map((m, index) => index === i ? { ...m, seconds: Number(e.target.value) } : m))} /></label><label>Your observation<input maxLength={300} required value={moment.note} onChange={e => setMoments(moments.map((m, index) => index === i ? { ...m, note: e.target.value } : m))} /></label><button type="button" onClick={() => setMoments(moments.filter((_, index) => index !== i))}>Remove moment</button></div>)}
    {session.duration > 0 && moments.length < 5 && <button type="button" onClick={() => setMoments([...moments, { seconds: 0, note: "" }])}>Add a timestamped observation</button>}
  </>}</fieldset>{error && <p role="alert">{error}</p>}<button disabled={busy} className="coach-primary">{busy ? "Sending…" : "Send to learner"}</button></form>;
}

export default function CoachInbox() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hours, setHours] = useState(48);
  const [available, setAvailable] = useState(false);
  const load = async () => { try { const result = await coachingApi("/inbox"); setData(result); setHours(result.profile?.responseHours || 48); setAvailable(Boolean(result.profile?.availableForReviews)); setError(""); } catch (err) { setError(err.message); } };
  useEffect(() => { load(); }, []);
  const update = session => { setData(current => ({ ...current, sessions: current.sessions.map(s => s._id === session._id ? { ...session, user: s.user } : s) })); };
  const active = data?.sessions.find(s => s._id === selected);
  return <main className="coaching-home"><span className="coach-eyebrow">XGOL · HUMAN COACHING</span><h1>Your coaching inbox.</h1><p>A focused review can unlock someone’s next conversation.</p>{error && <p role="alert" className="coach-error">{error}</p>}
    {data && <><form className="coach-card" onSubmit={async e => { e.preventDefault(); setBusy(true); try { await coachingApi("/availability", "PUT", { availableForReviews: available, responseHours: Number(hours) }); await load(); } catch (err) { setError(err.message); } finally { setBusy(false); } }}><h2>Your availability</h2><p>Accepting reviews makes your name and response estimate visible to learners. Reviews and one follow-up currently carry no extra credit charge.</p><label className="coach-checkbox"><input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} /> Accept new review requests</label><label>Expected response time in hours<input type="number" required min={1} max={168} value={hours} onChange={e => setHours(e.target.value)} /></label><button disabled={busy} className="coach-primary">{busy ? "Saving…" : "Save availability"}</button></form>
      <div className="coach-section-heading"><h2>Assigned requests</h2><button onClick={load}>Refresh inbox</button></div><div className="coach-history">{data.sessions.map(s => <button key={s._id} onClick={() => setSelected(s._id)}><div><strong>{s.title}</strong><span>{s.user?.firstName || s.user?.userName || "Learner"} · expected {new Date(s.review.expectedBy).toLocaleString()}</span></div><span className="coach-tag">{s.review.question && !s.review.answer ? "Follow-up waiting" : s.review.reviewedAt ? "Reviewed" : "Review requested"}</span></button>)}</div>{!data.sessions.length && <p>No assigned requests yet.</p>}
      {active && <><CoachingSession key={active._id} session={active} expertMode onChange={update} /><ReviewForm key={`form-${active._id}`} session={active} onSave={update} /></>}
    </>}
  </main>;
}
