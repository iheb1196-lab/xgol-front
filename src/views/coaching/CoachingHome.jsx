import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Sparkles, Target, TrendingUp } from "lucide-react";
import { coachingApi, evaluateSnack } from "../../features/coaching/coachingService";
import AudioRecorder from "../../components/practice/AudioRecorder";
import FeedbackRenderer from "../../components/practice/FeedbackRenderer";
import CoachProfile from "./CoachProfile";
import CoachingSession from "./CoachingSession";
import { QUICK_STARTS, eventDays } from "./coachingData";
import "./coaching.scss";

export default function CoachingHome() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [practice, setPractice] = useState(null);
  const [recording, setRecording] = useState(null);
  const [mode, setMode] = useState("audio");
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [focus, setFocus] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [recorderKey, setRecorderKey] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [comparison, setComparison] = useState(null);
  const work = useRef(null);
  const mounted = useRef(true);
  const request = useRef(false);
  const load = useCallback(async () => {
    try { const result = await coachingApi(); if (mounted.current) { setData(result); setHasMore(result.sessions.length === 40); setError(""); } }
    catch (err) { if (mounted.current) setError(err.message); }
  }, []);
  useEffect(() => { mounted.current = true; load(); return () => { mounted.current = false; }; }, [load]);
  useEffect(() => {
    const selectedSession = data?.sessions.find(s => s._id === selected);
    setComparison(null);
    if (!selectedSession?.previous || data.sessions.some(s => s._id === selectedSession.previous)) return undefined;
    let ignore = false;
    coachingApi(`/sessions/${selectedSession.previous}`).then(result => { if (!ignore) setComparison(result.session); }).catch(() => {});
    return () => { ignore = true; };
  }, [selected, data?.sessions]);
  useEffect(() => {
    if (!busy) return undefined;
    const warn = e => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);
  const begin = item => {
    setPractice(item); setContext(item.prompt || item.context || ""); setFocus(item.review?.focus || item.nextFocus || item.focus || "");
    setRecording(null); setText(item.status === "FAILED" ? item.text || "" : ""); setFeedback(""); setSelected(null); setRecorderKey(k => k + 1); setError("");
    setTimeout(() => work.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };
  const changeSession = session => {
    setSelected(session.deleted ? null : session._id);
    setData(current => ({ ...current, sessions: session.deleted ? current.sessions.filter(s => s._id !== session._id) : current.sessions.map(s => s._id === session._id ? session : s) }));
    load();
  };
  const submit = async e => {
    e.preventDefault();
    if (request.current) return;
    request.current = true; setBusy(true); setError(""); setFeedback("");
    try {
      const result = await evaluateSnack({ ...(mode === "audio" ? { blob: recording.blob, duration: recording.duration } : { text }), title: practice.title, scenario: practice.scenario || practice.id, source: "snack", context, focus, previous: practice.status === "COMPLETED" ? practice._id : undefined }, { onDelta: delta => { if (mounted.current) setFeedback(previous => previous + delta); } });
      if (mounted.current) { setPractice(null); setSelected(result.session._id); setData(current => ({ ...current, credits: result.credits, sessions: [result.session, ...current.sessions] })); await load(); }
    } catch (err) { if (mounted.current) { await load(); setError(err.message); } }
    finally { request.current = false; if (mounted.current) setBusy(false); }
  };
  if (!data) return <main className="coaching-home"><p role={error ? "alert" : "status"}>{error || "Preparing your coaching space…"}</p>{error && <button onClick={load}>Try again</button>}</main>;
  const { profile, sessions, stats } = data;
  const latest = sessions.find(s => s.status === "COMPLETED");
  const active = sessions.find(s => s._id === selected);
  const days = eventDays(profile.eventDate);
  const eventActive = days !== null && days >= 0;
  const visible = sessions.filter(s => filter === "all" || (filter === "retries" ? Boolean(s.previous) : Boolean(s.review?.coach)));
  const thisWeek = stats.week ?? sessions.filter(s => s.status === "COMPLETED" && new Date(s.createdAt) >= new Date(Date.now() - 7 * 86400000)).length;
  const previous = active?.previous && (sessions.find(s => s._id === active.previous) || comparison);
  return <main className="coaching-home">
    <header className="coach-topline"><span className="coach-eyebrow"><span className="coach-dot" /> XGOL · YOUR COACHING SPACE</span><Link to="/learning">Explore Learning Lab <ArrowRight size={15} /></Link></header>
    <section className="coach-hero"><div><span className="coach-eyebrow">SMALL PRACTICE. REAL-LIFE CONFIDENCE.</span><h1>Your next conversation.<br /><em>A little more you.</em></h1><p>A short practice. Feedback that knows your goal. One useful change to take into the real world.</p><div className="coach-actions"><button className="coach-primary" disabled={busy} onClick={() => begin(latest || QUICK_STARTS[0])}>{latest ? "Continue my practice" : "Start my first coaching snack"}<ArrowRight size={17} /></button><button disabled={busy} onClick={() => setEditing(!editing)}>Personalize my coach</button></div></div><aside className="coach-goal"><Target size={26} /><span className="coach-eyebrow">WHAT WE’RE WORKING TOWARD</span><h2>{profile.goal}</h2><p>{profile.audience ? `For ${profile.audience}` : "Add your audience to get more relevant advice."}</p><div className="coach-tags"><span>{profile.minutes}-minute breaks</span><span>{profile.language}</span><span>{profile.style} feedback</span></div></aside></section>
    {editing && <CoachProfile profile={profile} onSave={saved => { setData(current => ({ ...current, profile: saved })); setEditing(false); }} onCancel={() => setEditing(false)} />}
    <section className="coach-stats" aria-label="Your practice activity"><div><TrendingUp size={18} /><strong>{stats.completed}</strong><span>Completed practices</span></div><div><Target size={18} /><strong>{stats.retries}</strong><span>Focused retries</span></div><div><Sparkles size={18} /><strong>{stats.applied}</strong><span>Real-life applications · self-reported</span></div><div><Clock size={18} /><strong>{thisWeek}</strong><span>Practices in the last 7 days</span></div></section>
    {eventActive && <section className="coach-event coach-card"><Calendar size={24} /><div><span className="coach-eyebrow">{days === 0 ? "YOUR MOMENT IS TODAY" : days === 1 ? "YOUR MOMENT IS TOMORROW" : `${days} DAYS TO YOUR MOMENT`}</span><h2>{profile.eventName || "Your upcoming conversation"}</h2><p>{days <= 1 ? "Keep it focused: practise your opening, handle one hard question, then land your next step." : "Build your message, rehearse a difficult question, and try the full opening again before the day."}</p><div className="coach-actions">{["opening", "hard question", "closing"].map(step => <button key={step} disabled={busy} onClick={() => begin({ id: `event-${step}`, title: `Prepare my ${step}`, prompt: `Prepare the ${step} for ${profile.eventName || profile.goal}, taking place on ${profile.eventDate}. Audience: ${profile.audience}. ${step === "hard question" ? "State the hardest question you expect, then answer it directly with one reason or example." : "Deliver this part of the conversation aloud, with one clear message and a practical next step."}` })}>Practise my {step}</button>)}</div></div></section>}
    <section className="coach-section-heading"><div><span className="coach-eyebrow">START WITH WHAT MATTERS TODAY</span><h2>Help me with…</h2></div><span className="coach-muted">One moment. About a minute of speaking.</span></section>
    <div className="coach-quickstarts">{QUICK_STARTS.map(item => <button className="coach-quickstart" key={item.id} disabled={busy} onClick={() => begin(item)}><span className="coach-scenario-icon">{item.icon}</span><span className="coach-eyebrow">{item.tag}</span><h3>{item.title}</h3><span>Start a coaching snack <ArrowRight size={16} /></span></button>)}</div>
    {latest && !practice && <section className="coach-weekly coach-card"><div><span className="coach-eyebrow">YOUR PRACTICE CARD THIS WEEK</span><h2>{latest.review?.focus || latest.nextFocus || "Make one deliberate change"}</h2><p className="coach-preserve">{latest.review?.exercise || latest.exercise || "Listen to your latest attempt, choose one change, and try it again."}</p><small>Based on your latest {latest.review?.focus ? "human coach review" : "AI feedback"} · {latest.title}</small></div><button disabled={busy} className="coach-primary" onClick={() => begin(latest)}>Try this exercise <ArrowRight size={16} /></button></section>}
    <div ref={work} className="coach-work">
      {practice && <section className="coach-card coach-practice"><div className="coach-row"><div><span className="coach-eyebrow">{practice.status === "COMPLETED" ? "YOUR FOCUSED RETRY" : "YOUR NEXT SMALL WIN"}</span><h2>{practice.title}</h2></div><button disabled={busy} onClick={() => setPractice(null)}>Close practice</button></div><form onSubmit={submit}>
        <fieldset disabled={busy}>
          <label>Your situation<textarea value={context} onChange={e => setContext(e.target.value)} maxLength={2500} rows={3} /></label>
          {practice.opening && <p className="coach-starter">Need a starting point? “{practice.opening}”</p>}
          <label>One thing to work on (optional)<input value={focus} onChange={e => setFocus(e.target.value)} maxLength={700} placeholder="Make my opening clear and relevant to my audience" /></label>
          <div className="coach-tabs" aria-label="Practice format"><button type="button" aria-pressed={mode === "audio"} onClick={() => setMode("audio")}>Speak · audio only</button><button type="button" aria-pressed={mode === "text"} onClick={() => setMode("text")}>Write · text feedback</button></div>
          {mode === "audio" ? <AudioRecorder key={recorderKey} disabled={busy} prompt="Respond to your situation above. A short, natural answer is enough." onRecordingChange={(blob, duration) => setRecording(blob ? { blob, duration } : null)} /> : <label>Your answer<textarea required minLength={10} maxLength={4000} rows={7} value={text} onChange={e => setText(e.target.value)} placeholder="Write what you would say…" /><small>Feedback covers your words and structure. Voice and delivery are not assessed.</small></label>}
        </fieldset>
        <div className="coach-cost"><strong>{data.cost === null ? "Pricing unavailable" : `${data.cost} credit${data.cost === 1 ? "" : "s"} per AI assessment`}</strong><span>{data.credits} credits available · one AI follow-up included</span></div><p className="coach-muted">Submitting saves this attempt to your account and sends it for AI analysis. You can remove it from your history.</p>
        {!data.canEvaluate && <p className="coach-error">AI coaching needs an active license with enough credits. <Link to="/dashboard/subscription">View your plan</Link></p>}
        <button className="coach-primary" disabled={busy || !data.canEvaluate || (mode === "audio" ? !recording : text.trim().length < 10)}>{busy ? "Your AI coach is listening…" : "Get my personalized feedback"}<Sparkles size={17} /></button>
      </form>{busy && <div role="status"><p>{feedback ? "Your feedback is arriving…" : "Preparing your assessment…"}</p><FeedbackRenderer text={feedback} streaming /></div>}</section>}
      {error && <p role="alert" className="coach-error">{error}</p>}
      {active && <>{previous && <details className="coach-card"><summary>Compare with your earlier attempt · {new Date(previous.createdAt).toLocaleDateString()}</summary><CoachingSession key={previous._id} session={previous} onChange={changeSession} /></details>}<CoachingSession key={active._id} session={active} onChange={changeSession} onRetry={begin} /></>}
    </div>
    <section className="coach-section-heading"><div><span className="coach-eyebrow">YOUR PROGRESS, IN YOUR OWN WORDS</span><h2>Saved attempts</h2></div><button disabled={busy} onClick={load}>Refresh attempts</button></section>
    <div className="coach-tabs">{[["all", "All attempts"], ["retries", "Focused retries"], ["reviews", "Human reviews"]].map(([value, label]) => <button key={value} disabled={busy} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
    {visible.length ? <div className="coach-history">{visible.map(s => <button key={s._id} disabled={busy} onClick={() => { setSelected(s._id); setPractice(null); setTimeout(() => work.current?.scrollIntoView({ behavior: "smooth" }), 0); }}><span className="coach-history-icon">{s.previous ? "↻" : "◉"}</span><div><strong>{s.title}</strong><span>{new Date(s.createdAt).toLocaleDateString()} · {s.source === "learning" ? "Learning Lab" : "Coaching snack"} · {s.duration ? "Audio" : "Text"}</span></div><span className="coach-tag">{s.review?.reviewedAt ? "Coach reviewed" : s.review?.coach ? "With your coach" : s.status === "COMPLETED" ? "Feedback ready" : s.status === "FAILED" ? "Try again" : "Processing"}</span><ArrowRight size={18} /></button>)}</div> : <div className="coach-empty"><Sparkles size={26} /><h3>{filter === "all" ? "Your first attempt is your starting point." : "No matching attempts yet."}</h3><p>Pick a real situation above. You don’t need a polished script to begin.</p></div>}
    {hasMore && <div className="coach-actions"><button disabled={busy || loadingMore} onClick={async () => {
      setLoadingMore(true);
      try {
        const result = await coachingApi(`/history?before=${sessions[sessions.length - 1]._id}`);
        setData(current => ({ ...current, sessions: [...current.sessions, ...result.sessions.filter(s => !current.sessions.some(existing => existing._id === s._id))] }));
        setHasMore(result.hasMore);
      } catch (err) { setError(err.message); } finally { setLoadingMore(false); }
    }}>{loadingMore ? "Loading…" : "Load older attempts"}</button></div>}
    <footer className="coach-footer">A little practice today. A more intentional conversation tomorrow.</footer>
  </main>;
}
