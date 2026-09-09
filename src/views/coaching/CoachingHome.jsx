import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, Clock, Compass, FileText, Settings2, Sparkles, Target, TrendingUp, Users, X } from "lucide-react";
import { coachingApi, evaluateSnack } from "../../features/coaching/coachingService";
import AudioRecorder from "../../components/practice/AudioRecorder";
import FeedbackRenderer from "../../components/practice/FeedbackRenderer";
import CoachProfile from "./CoachProfile";
import CoachingSession from "./CoachingSession";
import CoachCompanion from "./CoachCompanion";
import CoachTour, { scrollToTourTarget } from "./CoachTour";
import { QUICK_STARTS, eventDays } from "./coachingData";
import "./coaching.scss";
import "./coachJourney.scss";

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
  const [planning, setPlanning] = useState(false);
  const [tour, setTour] = useState(false);
  const [guideDismissed, setGuideDismissed] = useState(false);
  const work = useRef(null);
  const preferences = useRef(null);
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
    if (busy || planning || tour) return;
    setPractice(item); setContext(item.prompt || item.context || ""); setFocus(item.review?.focus || item.nextFocus || item.focus || "");
    setRecording(null); setText(item.status === "FAILED" ? item.text || "" : ""); setFeedback(""); setSelected(null); setRecorderKey(k => k + 1); setError("");
    setTimeout(() => { work.current?.focus({ preventScroll: true }); work.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 0);
  };
  const dismissGuide = () => {
    setTour(false); setGuideDismissed(true);
    coachingApi("/guide", "PATCH", {}).then(result => {
      if (mounted.current) setData(current => ({ ...current, profile: { ...current.profile, guideDismissedAt: result.guideDismissedAt } }));
    }).catch(() => {});
  };
  const editPreferences = () => {
    setEditing(true);
    setTimeout(() => preferences.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };
  const changeSession = session => {
    setSelected(session.deleted ? null : session._id);
    setData(current => ({ ...current, sessions: session.deleted ? current.sessions.filter(s => s._id !== session._id) : current.sessions.map(s => s._id === session._id ? session : s) }));
    load();
  };
  const submit = async e => {
    e.preventDefault();
    if (request.current || planning || tour || !practice || !data?.canEvaluate || (mode === "audio" ? !recording : text.trim().length < 10)) return;
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
  const locked = busy || planning || tour;
  return <main className="coaching-home coaching-journey">
    <header className="coach-topline"><span className="coach-eyebrow"><span className="coach-dot" /> MY COACHING</span><div className="coach-header-actions"><button disabled={locked} onClick={() => setTour(true)}><Compass size={15} />Show me around</button><button disabled={locked} onClick={editPreferences}><Settings2 size={15} />Personalize my coach</button></div></header>
    {!profile.guideDismissedAt && !guideDismissed && <section className="coach-welcome" aria-label="Welcome to your coaching space"><span className="coach-welcome-icon"><Sparkles size={21} aria-hidden="true" /></span><div><strong>Welcome in. Let me show you what's possible.</strong><p>A quick tour of your coach, your practice tools, and how they work together.</p></div><button disabled={locked} onClick={() => setTour(true)}>Take the 1-minute tour <ArrowRight size={15} /></button><button className="coach-icon-button" aria-label="Dismiss tour invitation" disabled={locked} onClick={dismissGuide}><X size={17} /></button></section>}
    <CoachCompanion profile={profile} latest={latest} disabled={busy || tour || editing} onBegin={begin} onPendingChange={setPlanning} onPlan={plan => setData(current => ({ ...current, profile: { ...current.profile, currentPlan: plan } }))} />
    {eventActive && <section className="coach-event coach-card"><Calendar size={24} /><div><span className="coach-eyebrow">{days === 0 ? "YOUR MOMENT IS TODAY" : days === 1 ? "YOUR MOMENT IS TOMORROW" : `${days} DAYS TO YOUR MOMENT`}</span><h2>{profile.eventName || "Your upcoming conversation"}</h2><p>{days <= 1 ? "Keep it focused: practise your opening, handle one hard question, then land your next step." : "Build your message, rehearse a difficult question, and try the full opening again before the day."}</p><div className="coach-actions">{["opening", "hard question", "closing"].map(step => <button key={step} disabled={locked} onClick={() => begin({ id: `event-${step}`, title: `Prepare my ${step}`, prompt: `Prepare the ${step} for ${profile.eventName || profile.goal}, taking place on ${profile.eventDate}. Audience: ${profile.audience}. ${step === "hard question" ? "State the hardest question you expect, then answer it directly with one reason or example." : "Deliver this part of the conversation aloud, with one clear message and a practical next step."}` })}>Practise my {step}</button>)}</div></div></section>}
    <section id="coach-toolbox" aria-labelledby="coach-toolbox-title">
    <div className="coach-section-heading"><div><span className="coach-eyebrow">BRING YOUR REAL LIFE</span><h2 id="coach-toolbox-title">Or start with a moment that matters.</h2></div><span className="coach-muted">Pick a situation. I'll help you practice it.</span></div>
    <div className="coach-quickstarts">{QUICK_STARTS.map(item => <button className="coach-quickstart" key={item.id} disabled={locked} onClick={() => begin(item)}><span className="coach-scenario-icon">{item.icon}</span><span className="coach-eyebrow">{item.tag}</span><h3>{item.title}</h3><span>Practice this moment <ArrowRight size={16} /></span></button>)}</div>
    <div className="coach-tool-links"><Link to="/my_speeches/write_speech"><FileText size={20} aria-hidden="true" /><div><strong>Find the words</strong><span>Build a speech with AI in Speech Studio</span></div><ArrowRight size={16} /></Link><Link to="/learning"><BookOpen size={20} aria-hidden="true" /><div><strong>Learn by doing</strong><span>Explore guided scenarios in Learning Lab</span></div><ArrowRight size={16} /></Link><div><Users size={20} aria-hidden="true" /><div><strong>Add a human perspective</strong><span>Request an available coach's review from a completed attempt</span></div></div></div>
    </section>
    {latest && profile.currentPlan && !practice && <section className="coach-weekly coach-card"><div><span className="coach-eyebrow">PICK UP WHERE YOU LEFT OFF</span><h2>{latest.review?.focus || latest.nextFocus || "Make one deliberate change"}</h2><p className="coach-preserve">{latest.review?.exercise || latest.exercise || "Listen to your latest attempt, choose one change, and try it again."}</p><small>Based on your latest {latest.review?.focus ? "human coach review" : "AI feedback"} · {latest.title}</small></div><button disabled={locked} className="coach-primary" onClick={() => begin(latest)}>Try this exercise <ArrowRight size={16} /></button></section>}
    <div ref={work} className="coach-work" tabIndex={-1}>
      {practice && <section className="coach-card coach-practice"><div className="coach-row"><div><span className="coach-eyebrow">{practice.status === "COMPLETED" ? "YOUR FOCUSED RETRY" : "YOUR NEXT SMALL WIN"}</span><h2>{practice.title}</h2></div><button disabled={locked} onClick={() => setPractice(null)}>Close practice</button></div><form onSubmit={submit}>
        <p className="coach-practice-intro"><Sparkles size={18} aria-hidden="true" />Try it in your own words. I'll help you spot what works and choose one thing to improve.</p>
        <fieldset disabled={locked}>
          <label>Your situation<textarea value={context} onChange={e => setContext(e.target.value)} maxLength={2500} rows={3} /></label>
          {practice.opening && <p className="coach-starter">Need a starting point? “{practice.opening}”</p>}
          <label>One thing to work on (optional)<input value={focus} onChange={e => setFocus(e.target.value)} maxLength={700} placeholder="Make my opening clear and relevant to my audience" /></label>
          <div className="coach-tabs" aria-label="Practice format"><button type="button" aria-pressed={mode === "audio"} onClick={() => setMode("audio")}>Speak · audio only</button><button type="button" aria-pressed={mode === "text"} onClick={() => setMode("text")}>Write · text feedback</button></div>
          {mode === "audio" ? <AudioRecorder key={recorderKey} disabled={locked} prompt="Respond to your situation above. A short, natural answer is enough." onRecordingChange={(blob, duration) => setRecording(blob ? { blob, duration } : null)} /> : <label>Your answer<textarea required minLength={10} maxLength={4000} rows={7} value={text} onChange={e => setText(e.target.value)} placeholder="Write what you would say…" /><small>Feedback covers your words and structure. Voice and delivery are not assessed.</small></label>}
        </fieldset>
        <div className="coach-cost"><strong>{data.cost === null ? "Pricing unavailable" : `${data.cost} credit${data.cost === 1 ? "" : "s"} per AI assessment`}</strong><span>{data.credits} credits available · one AI follow-up included</span></div><p className="coach-muted">Submitting saves this attempt to your account and sends it for AI analysis. You can remove it from your history.</p>
        {!data.canEvaluate && <p className="coach-error">AI coaching needs an active license with enough credits. <Link to="/dashboard/subscription">View your plan</Link></p>}
        <button className="coach-primary" disabled={locked || !data.canEvaluate || (mode === "audio" ? !recording : text.trim().length < 10)}>{busy ? "Your coach is reviewing your attempt…" : "Get my personalized feedback"}<Sparkles size={17} /></button>
      </form>{busy && <div role="status"><p>{feedback ? "Your feedback is arriving…" : "Preparing your assessment…"}</p><FeedbackRenderer text={feedback} streaming /></div>}</section>}
      {error && <p role="alert" className="coach-error">{error}</p>}
      {active && <>{previous && <details className="coach-card"><summary>Compare with your earlier attempt · {new Date(previous.createdAt).toLocaleDateString()}</summary><CoachingSession key={previous._id} session={previous} onChange={changeSession} /></details>}<CoachingSession key={active._id} session={active} onChange={changeSession} onRetry={begin} /></>}
    </div>
    <section id="coach-progress" aria-labelledby="coach-progress-title">
    <div className="coach-section-heading"><div><span className="coach-eyebrow">SMALL STEPS ADD UP</span><h2 id="coach-progress-title">Your practice, becoming progress.</h2></div><button disabled={locked} onClick={load}>Refresh attempts</button></div>
    <section className="coach-stats" aria-label="Your practice activity"><div><TrendingUp size={18} /><strong>{stats.completed}</strong><span>Completed practices</span></div><div><Target size={18} /><strong>{stats.retries}</strong><span>Focused retries</span></div><div><Sparkles size={18} /><strong>{stats.applied}</strong><span>Real-life applications · self-reported</span></div><div><Clock size={18} /><strong>{thisWeek}</strong><span>Practices in the last 7 days</span></div></section>
    <h3 className="coach-history-title">Saved attempts</h3>
    <div className="coach-tabs">{[["all", "All attempts"], ["retries", "Focused retries"], ["reviews", "Human reviews"]].map(([value, label]) => <button key={value} disabled={locked} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
    {visible.length ? <div className="coach-history">{visible.map(s => <button key={s._id} disabled={locked} onClick={() => { setSelected(s._id); setPractice(null); setTimeout(() => work.current?.scrollIntoView({ behavior: "smooth" }), 0); }}><span className="coach-history-icon">{s.previous ? "↻" : "◉"}</span><div><strong>{s.title}</strong><span>{new Date(s.createdAt).toLocaleDateString()} · {s.source === "learning" ? "Learning Lab" : "Coaching snack"} · {s.duration ? "Audio" : "Text"}</span></div><span className="coach-tag">{s.review?.reviewedAt ? "Coach reviewed" : s.review?.coach ? "With your coach" : s.status === "COMPLETED" ? "Feedback ready" : s.status === "FAILED" ? "Try again" : "Processing"}</span><ArrowRight size={18} /></button>)}</div> : <div className="coach-empty"><Sparkles size={26} /><h3>{filter === "all" ? "Your first attempt is your starting point." : "No matching attempts yet."}</h3><p>Pick a real situation above. You don’t need a polished script to begin.</p></div>}
    {hasMore && <div className="coach-actions"><button disabled={locked || loadingMore} onClick={async () => {
      setLoadingMore(true);
      try {
        const result = await coachingApi(`/history?before=${sessions[sessions.length - 1]._id}`);
        setData(current => ({ ...current, sessions: [...current.sessions, ...result.sessions.filter(s => !current.sessions.some(existing => existing._id === s._id))] }));
        setHasMore(result.hasMore);
      } catch (err) { setError(err.message); } finally { setLoadingMore(false); }
    }}>{loadingMore ? "Loading…" : "Load older attempts"}</button></div>}
    </section>
    <section id="coach-memory" className="coach-memory" ref={preferences} aria-labelledby="coach-memory-title"><div><span className="coach-eyebrow"><Target size={15} aria-hidden="true" />WHAT WE'RE WORKING TOWARD</span><h2 id="coach-memory-title">{profile.goal}</h2><p>{profile.audience ? `Speaking to ${profile.audience}` : "Tell your coach who you speak to for more relevant practice."}</p><div className="coach-preferences-tags"><span>{profile.language}</span><span>{profile.style} feedback</span><span>{profile.minutes}-minute breaks</span></div></div><button disabled={locked} onClick={() => setEditing(!editing)}><Settings2 size={16} aria-hidden="true" />{editing ? "Close preferences" : "Update my preferences"}</button></section>
    {editing && <CoachProfile profile={profile} onSave={saved => { setData(current => ({ ...current, profile: saved })); setEditing(false); }} onCancel={() => setEditing(false)} />}
    <footer className="coach-footer"><Sparkles size={15} aria-hidden="true" />Practice here. Find your voice out there.</footer>
    {tour && <CoachTour run={tour} onClose={() => { dismissGuide(); scrollToTourTarget(document.getElementById("coach-checkin")); }} />}
  </main>;
}
