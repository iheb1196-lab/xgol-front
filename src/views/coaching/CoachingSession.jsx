import { useEffect, useRef, useState } from "react";
import FeedbackRenderer from "../../components/practice/FeedbackRenderer";
import { coachingApi, coachingAudio } from "../../features/coaching/coachingService";
import { exportBrief, replayMoments } from "./coachingData";

export default function CoachingSession({ session, onChange = () => {}, onRetry, expertMode = false }) {
  const [audioUrl, setAudioUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [coachQuestion, setCoachQuestion] = useState("");
  const [coaches, setCoaches] = useState(null);
  const [coachId, setCoachId] = useState("");
  const [note, setNote] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const player = useRef(null);
  const urlRef = useRef("");
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; if (urlRef.current) URL.revokeObjectURL(urlRef.current); }; }, []);
  const run = async action => { setBusy(true); setError(""); try { await action(); } catch (err) { setError(err.message); } finally { if (mounted.current) setBusy(false); } };
  const update = async (route, method, body) => { const data = await coachingApi(`/sessions/${session._id}${route}`, method, body); onChange(data.session || { ...session, ...data }); };
  const play = seconds => run(async () => {
    if (!urlRef.current) {
      const url = await coachingAudio(session._id);
      if (!mounted.current) { URL.revokeObjectURL(url); return; }
      urlRef.current = url; setAudioUrl(url);
      if (player.current) { player.current.src = url; await new Promise(resolve => { player.current.onloadedmetadata = resolve; player.current.onerror = resolve; }); }
    }
    if (player.current) { player.current.currentTime = seconds; await player.current.play(); }
  });
  const review = session.review;
  const moments = replayMoments(session.feedback, session.duration);
  return <section className="coach-session coach-card">
    <div className="coach-row"><div><span className="coach-eyebrow">{session.source === "learning" ? "LEARNING LAB" : "SNACK COACHING"} · {session.previous ? "RETRY" : "PRACTICE"}</span><h2>{session.title}</h2></div><span className="coach-tag">{session.duration ? `${Math.round(session.duration)}s · Audio` : "Text practice"}</span></div>
    <p className="coach-muted">{new Date(session.createdAt).toLocaleString()} · {session.profile?.goal || "Your speaking practice"}</p>
    {session.duration > 0 && <><audio controls ref={player} src={audioUrl || undefined} aria-label="Saved coaching recording" /><div className="coach-actions"><button disabled={busy} onClick={() => play(0)}>Listen to recording</button>{audioUrl && <a download="xgol-coaching.wav" href={audioUrl}>Download audio</a>}</div></>}
    {session.text && <details><summary>Your practice text</summary><p className="coach-preserve">{session.text}</p></details>}
    {session.status === "FAILED" ? <p role="status">AI feedback was unavailable for this attempt. You can review your saved input and try again.</p> : session.status === "PROCESSING" ? <p role="status">Feedback is still processing. Refresh your attempts shortly.</p> : <>
      <FeedbackRenderer text={session.feedback} />
      {moments.length > 0 && <div className="coach-actions" aria-label="AI replay suggestions">{moments.map((m, i) => <button key={i} disabled={busy} onClick={() => play(m.seconds)}>{Math.floor(m.seconds / 60)}:{String(m.seconds % 60).padStart(2, "0")} · {m.note}</button>)}</div>}
      {session.duration > 0 && <small>AI timestamps are approximate. The transcript is a draft and may contain errors.</small>}
      {!expertMode && <>
        <div className="coach-focus"><span className="coach-eyebrow">YOUR NEXT SMALL WIN</span><h3>{review?.focus || session.nextFocus || "Apply one change from your feedback"}</h3><p className="coach-preserve">{review?.exercise || session.exercise}</p><div className="coach-actions">{onRetry && <button className="coach-primary" onClick={() => onRetry(session)}>Practise this change</button>}<button disabled={busy} aria-pressed={Boolean(session.appliedAt)} onClick={() => run(() => update("", "PATCH", { applied: !session.appliedAt }))}>{session.appliedAt ? "✓ Tried in a real conversation" : "I tried this in a real conversation"}</button></div></div>
        <details className="coach-followup"><summary>Ask your AI coach · one follow-up included</summary>{session.followup?.answer ? <><p><strong>You:</strong> {session.followup.question}</p><FeedbackRenderer text={session.followup.answer} /></> : <form onSubmit={e => { e.preventDefault(); run(async () => { const data = await coachingApi(`/sessions/${session._id}/followup`, "POST", { question }); onChange({ ...session, followup: data.followup }); }); }}><label>Your question<textarea value={question} onChange={e => setQuestion(e.target.value)} minLength={3} maxLength={700} required placeholder="How can I make that opening more relevant to my audience?" /></label><button disabled={busy} className="coach-primary">{busy ? "Working…" : "Ask AI coach"}</button></form>}</details>
        <div className="coach-actions"><span>Was this feedback useful?</span><button disabled={busy} aria-pressed={session.helpful === true} onClick={() => run(() => update("", "PATCH", { helpful: true }))}>Yes</button><button disabled={busy} aria-pressed={session.helpful === false} onClick={() => run(() => update("", "PATCH", { helpful: false }))}>Not yet</button></div>
      </>}
    </>}
    <section className="coach-human"><span className="coach-eyebrow">THE HUMAN PERSPECTIVE</span>
      {review?.coach ? <><h3>{review.reviewedAt ? "Your coach’s review" : "Your review is in the coach’s inbox"}</h3>{!review.reviewedAt && <p>Expected by {new Date(review.expectedBy).toLocaleString()}. This is the coach’s estimate.</p>}{review.note && <p><strong>Your request:</strong> {review.note}</p>}{review.reviewedAt && <><FeedbackRenderer text={review.feedback} /><p><strong>One change:</strong> {review.focus}</p><p className="coach-preserve">{review.exercise}</p><div className="coach-actions">{review.moments?.map((m, i) => <button disabled={busy} key={i} onClick={() => play(m.seconds)}>{m.seconds}s · {m.note}</button>)}</div>{review.question ? <><p><strong>Your follow-up:</strong> {review.question}</p><p>{review.answer || "Waiting for your coach’s reply."}</p></> : !expertMode && <form onSubmit={e => { e.preventDefault(); run(() => update("/review-question", "POST", { question: coachQuestion })); }}><label>Ask your coach one follow-up<textarea required minLength={3} maxLength={700} value={coachQuestion} onChange={e => setCoachQuestion(e.target.value)} /></label><button disabled={busy}>Send to my coach</button></form>}</>}</> : !expertMode && session.status === "COMPLETED" ? <><h3>A second perspective, when you need it.</h3><p>Share this attempt and your goal with an available human coach. Reviews and one follow-up currently use no additional credits.</p>{coaches === null ? <button disabled={busy} onClick={() => run(async () => { const data = await coachingApi("/coaches"); setCoaches(data.coaches); setCoachId(data.coaches[0]?.id || ""); })}>Find an available coach</button> : coaches.length === 0 ? <p>No coaches are accepting reviews right now. You can download your brief to bring to your own coach.</p> : <form onSubmit={e => { e.preventDefault(); run(() => update("/review-request", "POST", { coach: coachId, note })); }}><label>Choose your coach<select value={coachId} onChange={e => setCoachId(e.target.value)}>{coaches.map(c => <option key={c.id} value={c.id}>{c.name} · usually within {c.responseHours} hours</option>)}</select></label><label>What should they listen for?<textarea maxLength={1000} value={note} onChange={e => setNote(e.target.value)} /></label><p>Your selected coach will receive this recording or text, AI feedback, and the coaching preferences saved with this attempt.</p><button className="coach-primary" disabled={busy}>Share this attempt with coach</button></form>}</> : <p>Complete an AI assessment to request a human review.</p>}
    </section>
    {error && <p role="alert" className="coach-error">{error}</p>}
    <div className="coach-actions"><button onClick={() => exportBrief(session)}>Download coaching brief</button>{!expertMode && session.status !== "PROCESSING" && <button onClick={() => setConfirmDelete(true)}>Remove attempt</button>}</div>
    {confirmDelete && <div role="alert"><p>Remove this attempt from your history and the coach’s inbox?</p><div className="coach-actions"><button disabled={busy} onClick={() => run(async () => { await coachingApi(`/sessions/${session._id}`, "DELETE"); onChange({ ...session, deleted: true }); })}>Remove attempt</button><button onClick={() => setConfirmDelete(false)}>Keep it</button></div></div>}
    {session.status === "FAILED" && onRetry && <button className="coach-primary" onClick={() => onRetry(session)}>Try this practice again</button>}
  </section>;
}
