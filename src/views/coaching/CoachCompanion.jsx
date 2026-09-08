import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Clock, MessageCircle, Sparkles, Zap } from "lucide-react";
import { coachingApi } from "../../features/coaching/coachingService";
import { CHECK_INS, missionPractice, startingMission } from "./coachJourney";

export default function CoachCompanion({ profile, latest, disabled, onBegin, onPlan, onPendingChange }) {
  const [energy, setEnergy] = useState("stuck");
  const [minutes, setMinutes] = useState(profile.minutes || 5);
  const [situation, setSituation] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [warmedUp, setWarmedUp] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const request = useRef(null);
  const missionHeading = useRef(null);
  const mission = profile.currentPlan || startingMission(profile, latest);
  const locked = disabled || pending;
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => { setWarmedUp(false); setChallenge(false); }, [mission.id]);
  const createPlan = async event => {
    event.preventDefault();
    if (request.current || disabled) return;
    const controller = new AbortController();
    request.current = controller;
    setPending(true); onPendingChange(true); setError("");
    try {
      const { plan } = await coachingApi("/plan", "POST", { energy, minutes, situation }, controller.signal);
      if (controller.signal.aborted) return;
      onPlan(plan);
      setAnnouncement("Your personalized plan is ready.");
      missionHeading.current?.focus();
      missionHeading.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) { if (!controller.signal.aborted) setError(err.message); }
    finally {
      request.current = null;
      if (!controller.signal.aborted) { setPending(false); onPendingChange(false); }
    }
  };

  return <>
    <section className="coach-companion" id="coach-checkin" aria-labelledby="coach-checkin-title">
      <div className="coach-companion-intro">
        <span className="coach-eyebrow">A COACH IN YOUR CORNER</span>
        <h1>A little practice.<br /><em>A more confident you.</em></h1>
        <p>That interview. The idea you want heard. The conversation you've been putting off. Let's work on it together.</p>
        <div className="coach-presence"><span className="coach-avatar" aria-hidden="true"><Sparkles size={24} /></span><div><strong>Your XGOL AI coach</strong><span>A plan. A rehearsal. A next step.</span></div></div>
        <div className="coach-coach-note" aria-live="polite"><MessageCircle size={18} aria-hidden="true" /><p>{CHECK_INS.find(item => item.id === energy).response}</p></div>
      </div>
      <form className="coach-checkin" onSubmit={createPlan} aria-busy={pending}>
        <div className="coach-row"><span className="coach-eyebrow">LET'S START WITH YOU</span><span className="coach-muted">30-second check-in</span></div>
        <h2 id="coach-checkin-title">What are we walking into?</h2>
        <label>A conversation you'd like help with<input value={situation} onChange={event => setSituation(event.target.value)} maxLength={700} disabled={locked} placeholder="e.g. Asking my manager for more responsibility" /><small>Optional. Leave this blank to work toward your saved goal.</small></label>
        <fieldset disabled={locked} className="coach-choice-group"><legend>How are you feeling about it?</legend><div>{CHECK_INS.map(item => <button type="button" key={item.id} aria-pressed={energy === item.id} onClick={() => setEnergy(item.id)}>{item.label}</button>)}</div></fieldset>
        <p className="coach-checkin-response" aria-live="polite">{CHECK_INS.find(item => item.id === energy).response}</p>
        <fieldset disabled={locked} className="coach-choice-group coach-time"><legend>How much time do you have?</legend><div>{[2, 5, 10].map(value => <button type="button" key={value} aria-pressed={minutes === value} onClick={() => setMinutes(value)}><Clock size={14} aria-hidden="true" />{value} min</button>)}</div></fieldset>
        <button className="coach-primary coach-plan-button" disabled={locked}><Sparkles size={17} aria-hidden="true" />{pending ? "Your coach is building your plan…" : "Build my practice plan"}{!pending && <ArrowRight size={17} aria-hidden="true" />}</button>
        <small className="coach-plan-note">Planning is included · No credits used<br />Your check-in, preferences and recent practice guide your AI plan.</small>
        {pending && <p role="status" className="coach-muted">Connecting your situation with one useful exercise. This can take a moment.</p>}
        {error && <p role="alert" className="coach-error">{error}</p>}
      </form>
    </section>

    <section className="coach-mission" id="coach-mission" aria-labelledby="coach-mission-title">
      <div className="coach-mission-main">
        <div className="coach-row"><span className="coach-eyebrow"><Sparkles size={14} aria-hidden="true" />{mission.createdAt ? "YOUR AI PRACTICE PLAN" : "A PLACE TO START"}</span><span className="coach-duration"><Clock size={13} aria-hidden="true" />About {mission.checkIn.minutes} min</span></div>
        <h2 id="coach-mission-title" ref={missionHeading} tabIndex={-1}>{mission.title}</h2>
        {mission.greeting && <p className="coach-mission-greeting">{mission.greeting}</p>}
        <p>{mission.reason}</p>
        {mission.createdAt && <small>Created {new Date(mission.createdAt).toLocaleDateString()} · Build a new plan whenever your situation changes.</small>}
        <div className="coach-mission-focus"><TargetMark /><div><span>One thing to work on</span><strong>{mission.focus}</strong></div></div>
        <div className="coach-actions"><button className="coach-primary" disabled={locked} onClick={() => onBegin(missionPractice(mission))}>{mission.previousSession ? "Continue my practice" : "Let's rehearse this"}<ArrowRight size={17} aria-hidden="true" /></button><span className="coach-muted">Speak or write. Feedback pricing shown before you submit.</span></div>
      </div>
      <div className="coach-mission-steps">
        <span className="coach-eyebrow">YOUR SMALL-STEP GAME PLAN</span>
        <div className={`coach-mission-step${warmedUp ? " is-done" : ""}`}><span className="coach-step-number" aria-hidden="true">{warmedUp ? <Check size={15} /> : "1"}</span><div><h3>Find your first words <span>20 sec</span></h3><p>{mission.warmup}</p><button className="coach-text-button" aria-pressed={warmedUp} onClick={() => setWarmedUp(!warmedUp)}>{warmedUp ? "Warm-up done" : "I've got my first words"}</button></div></div>
        <div className="coach-mission-step"><span className="coach-step-number" aria-hidden="true">2</span><div><h3>Say it. See what works.</h3><p>Rehearse for 30–60 seconds. Get specific feedback, then try one change.</p><span className="coach-step-caption">Your words or your voice · your choice</span></div></div>
        <div className="coach-mission-step"><span className="coach-step-number" aria-hidden="true">3</span><div><h3>Take it into real life</h3><p>{mission.takeaway}</p></div></div>
      </div>
      <div className="coach-curveball"><div><Zap size={19} aria-hidden="true" /><div><strong>Practice the unexpected</strong><span>A safe place for the question you didn't see coming.</span></div></div><button disabled={locked} aria-expanded={challenge} aria-controls="coach-curveball-question" onClick={() => setChallenge(!challenge)}>{challenge ? "Hide the question" : "Give me a curveball"}<ArrowRight size={15} aria-hidden="true" /></button></div>
      {challenge && <div id="coach-curveball-question" className="coach-curveball-question"><span className="coach-eyebrow">YOUR AUDIENCE ASKS…</span><p>{mission.curveball}</p><button disabled={locked} onClick={() => onBegin(missionPractice(mission, true))}>Rehearse my response <ArrowRight size={15} aria-hidden="true" /></button><small>Optional, separate practice. Assessment pricing appears before you submit.</small></div>}
    </section>
    <span className="coach-sr-only" role="status">{announcement}</span>
  </>;
}

function TargetMark() { return <span className="coach-focus-mark" aria-hidden="true">◎</span>; }
