import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Briefcase, Check, CheckCircle2, Clock, Download, Headphones, MessageSquare, Mic, RotateCcw, Shuffle, Square, Target, Users, Zap } from "lucide-react";
import useRehearsalRecorder from "./useRehearsalRecorder";
import useLearningCoach from "./useLearningCoach";
import LearningAIFeedback from "./LearningAIFeedback";
import { SCENARIOS, FOCUSES, TAKE_SECONDS, OBJECTION_SECONDS, CLOSE_SECONDS, formatTime, buildCoachBrief } from "./rehearsalData";
import "./leadershipRehearsal.scss";

const scenarioIcons = { shuffle: Shuffle, briefcase: Briefcase, message: MessageSquare };

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function TakePlayer({ take, index }) {
  const player = useRef(null);
  const extension = take.blob.type.includes("mp4") ? "m4a" : take.blob.type.includes("ogg") ? "ogg" : "webm";
  return (
    <article className="lr-take">
      <div className="lr-row"><h3>Take {index + 1} <span>{index ? "Focused replay" : "First delivery"}</span></h3><span>{formatTime(take.duration)}</span></div>
      <audio ref={player} controls src={take.url} aria-label={`Take ${index + 1} recording`} />
      <div className="lr-markers">{take.markers.map((time, i) => <button key={i} onClick={() => {
        if (player.current) { player.current.currentTime = time; player.current.play().catch(() => {}); }
      }}><Bookmark size={13} /> {formatTime(time)}</button>)}</div>
      <div className="lr-row"><small>Self-reported confidence: {take.confidence}/5</small><button className="lr-text-button" onClick={() => download(take.blob, `leadership-take-${index + 1}.${extension}`)}><Download size={15} /> Download take {index + 1}</button></div>
    </article>
  );
}

export default function LeadershipRehearsal() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [mode, setMode] = useState("guided");
  const [stage, setStage] = useState("setup");
  const [takes, setTakes] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [focus, setFocus] = useState(FOCUSES[0]);
  const [coachCue, setCoachCue] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [checks, setChecks] = useState([]);
  const [reflection, setReflection] = useState("");
  const [notice, setNotice] = useState("");
  const [resetConfirm, setResetConfirm] = useState(false);
  const urls = useRef([]);
  const heading = useRef(null);
  const activeAudio = useRef(null);
  const aiCoach = useLearningCoach((url, patch) => {
    setTakes(previous => previous.map(take => take.url === url ? { ...take, ...patch, ...(patch.delta ? { aiText: (take.aiText || "") + patch.delta } : {}) } : take));
  });
  const recorder = useRehearsalRecorder((take) => {
    const url = URL.createObjectURL(take.blob);
    urls.current.push(url);
    setTakes((previous) => [...previous, { ...take, url, markers: markers.filter((time) => time <= take.duration), confidence: 3, checks: [] }]);
    setConfidence(3);
    setChecks([]);
    setStage("reflect");
    if (aiCoach.enabled) aiCoach.evaluate({ ...take, url }, scenario, takes.length ? coachCue.trim() || focus.tip : scenario.outcome, takes[takes.length - 1]);
  });
  const busy = ["requesting", "recording", "stopping"].includes(recorder.status) || aiCoach.busy;
  const isRecording = recorder.status === "recording";
  const challenged = recorder.elapsed >= OBJECTION_SECONDS;
  const closing = recorder.elapsed >= CLOSE_SECONDS;

  useEffect(() => () => urls.current.forEach((url) => URL.revokeObjectURL(url)), []);
  useEffect(() => {
    if (stage !== "setup") heading.current?.focus();
  }, [stage]);
  useEffect(() => {
    if (!takes.length && !busy) return undefined;
    const warn = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [takes.length, busy]);

  const saveReflection = () => {
    setTakes((previous) => previous.map((take, i) => i === previous.length - 1 ? { ...take, confidence, checks } : take));
    setStage(takes.length === 1 ? "focus" : "review");
  };
  const reset = () => {
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current = [];
    setTakes([]); setMarkers([]); setReflection(""); setNotice(""); setResetConfirm(false); setStage("setup");
  };
  const exportBrief = () => {
    download(new Blob([buildCoachBrief({ scenario, mode, focus, coachCue, reflection, takes })], { type: "text/plain;charset=utf-8" }), "leadership-coach-brief.txt");
    setNotice("Brief downloaded. Download each recording below to bring all three files to your coach.");
  };
  const progress = stage === "setup" ? 0 : stage === "focus" ? 2 : stage === "review" ? 3 : takes.length === 0 || (stage === "reflect" && takes.length === 1) ? 1 : 2;

  return (
    <main className="leadership-lab">
      <header className="lr-header"><div className="lr-eyebrow"><span className="lr-brand-dot" /> XGOL LEARNING LAB</div><span className="lr-header-note"><Headphones size={16} /> Built for practice. Made better with your coach.</span></header>
      <section className="lr-intro">
        <div><div className="lr-eyebrow lr-purple">REAL SITUATIONS. REAL PROGRESS.</div><h1>Leadership Rehearsal<span>.</span></h1><p>The important conversation deserves a practice run.</p></div>
        <div className="lr-session-tag"><Clock size={18} /><div><strong>6-minute practice</strong><span>Two takes. One deliberate change.</span></div></div>
      </section>

      <ol className="lr-steps" aria-label="Rehearsal progress">{["Choose your moment", "Deliver & respond", "Change one thing", "Debrief with your coach"].map((label, i) => <li key={label} className={progress === i ? "active" : progress > i ? "complete" : ""} aria-current={progress === i ? "step" : undefined}><span>{progress > i ? <Check size={14} /> : `0${i + 1}`}</span>{label}</li>)}</ol>

      {stage === "setup" ? <>
        <LearningAIFeedback coach={aiCoach} setup />
        <section className="lr-section-heading"><div><h2>What’s your next leadership moment?</h2><p>Choose a situation you want to handle with more confidence.</p></div><span>01 / THE BRIEF</span></section>
        <div className="lr-scenarios">{SCENARIOS.map((item) => {
          const ScenarioIcon = scenarioIcons[item.icon];
          return <button key={item.id} className={`lr-scenario ${scenario.id === item.id ? "selected" : ""}`} aria-pressed={scenario.id === item.id} onClick={() => setScenario(item)}><div className="lr-row"><span className="lr-icon-tile"><ScenarioIcon size={22} /></span><span className="lr-select-dot">{scenario.id === item.id && <Check size={13} />}</span></div><span className="lr-eyebrow">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><span className="lr-card-footer">90-second delivery <ArrowRight size={16} /></span></button>;
        })}</div>
        <div className="lr-setup-grid">
          <section className="lr-brief"><div className="lr-eyebrow"><Users size={16} /> YOUR ROOM</div><h2>{scenario.audience}</h2><p>{scenario.brief}</p><div className="lr-outcome"><Target size={19} /><div><strong>A successful conversation means…</strong><p>{scenario.outcome}</p></div></div><div className="lr-row lr-mode-heading"><strong>Choose the intensity</strong><span>You can start gently.</span></div><div className="lr-modes"><button aria-pressed={mode === "guided"} className={mode === "guided" ? "selected" : ""} onClick={() => setMode("guided")}><Headphones size={18} /><div><strong>Guided</strong><span>Delivery cues along the way</span></div></button><button aria-pressed={mode === "pressure"} className={mode === "pressure" ? "selected" : ""} onClick={() => setMode("pressure")}><Zap size={18} /><div><strong>Under pressure</strong><span>You lead. The room challenges.</span></div></button></div><button className="lr-primary" onClick={() => { setMarkers([]); setStage("deliver"); }} >Enter the rehearsal <ArrowRight size={18} /></button><small className="lr-privacy">AI-reviewed takes are saved in My Coaching. Download local-only takes before leaving.</small></section>
          <aside className="lr-coach-card"><span className="lr-icon-tile"><MessageSquare size={24} /></span><div className="lr-eyebrow">THE HUMAN ADVANTAGE</div><h2>Give your coach<br />the moments that matter.</h2><p>Rehearse between sessions. Bring your coach two takes, the tough question, and the moment where you felt stuck.</p><ul><li><CheckCircle2 size={17} /> Mark a moment while you speak</li><li><CheckCircle2 size={17} /> Replay with one delivery focus</li><li><CheckCircle2 size={17} /> Download a ready-to-review brief</li></ul><div className="lr-coach-note">Already working on something with your coach? Add their cue before your second take.</div></aside>
        </div>
      </> : <>
        <div className="lr-section-heading"><div><h2 ref={heading} tabIndex={-1}>{stage === "deliver" ? `Take ${takes.length + 1} · ${takes.length ? "Make one deliberate change" : "Step into the conversation"}` : stage === "reflect" ? "Listen back. Notice one thing." : stage === "focus" ? "Same room. A different delivery." : "Bring the conversation to your coach."}</h2><p>{scenario.title} · {mode === "guided" ? "Guided" : "Under pressure"}</p></div>{!busy && <button className="lr-text-button" onClick={() => takes.length ? setResetConfirm(true) : reset()}><ArrowLeft size={16} /> Change scenario</button>}</div>
        {resetConfirm && <div className="lr-confirm" role="alert"><p>Starting a new scenario clears these takes. Download anything you want to keep first.</p><button className="lr-secondary" onClick={() => setResetConfirm(false)}>Keep this rehearsal</button><button className="lr-primary" onClick={reset}>Clear takes & start again</button></div>}

        {stage === "deliver" && <div className="lr-live-grid"><section className={`lr-stage ${isRecording ? "is-recording" : ""}`}><div className="lr-row"><span className="lr-live-label"><span />{isRecording ? "RECORDING" : recorder.status === "requesting" ? "WAITING FOR MICROPHONE" : recorder.status === "stopping" ? "FINISHING TAKE" : "YOUR REHEARSAL ROOM"}</span><span className="lr-timer">{formatTime(isRecording || recorder.status === "stopping" ? TAKE_SECONDS - recorder.elapsed : TAKE_SECONDS)}</span></div><div className="lr-room"><div className="lr-avatar">{scenario.initials}</div><span>{scenario.role} · Simulated stakeholder</span><div className="lr-stage-prompt" aria-live="polite" aria-atomic="true"><h2>{!isRecording && recorder.status !== "stopping" ? "Take a breath. You have the floor." : challenged ? `“${scenario.objection}”` : "We’re listening. What would you like us to know?"}</h2><p>{!isRecording ? "Start speaking when you’re ready. A stakeholder objection appears at 0:30. Read it, then respond out loud." : closing ? "Bring the conversation to a close." : challenged ? "The room has a question. Read it, pause, and answer out loud." : "Open the conversation and make your main point."}</p></div></div><div className="lr-timeline" aria-hidden="true"><span style={{ width: `${isRecording ? recorder.elapsed / TAKE_SECONDS * 100 : 0}%` }} /></div><div className="lr-timeline-labels"><span>00:00 · Open</span><span>00:30 · Respond</span><span>01:05 · Close</span></div><div className="lr-stage-actions">{isRecording ? <><button className="lr-stop" onClick={recorder.stop}><Square size={16} fill="currentColor" /> Finish take</button><button className="lr-mark" onClick={() => setMarkers((previous) => [...previous, Math.floor(recorder.elapsed)])}><Bookmark size={17} /> Mark for coach{markers.length > 0 && ` (${markers.length})`}</button></> : <button className="lr-primary" disabled={busy} onClick={() => { setMarkers([]); recorder.start(); }}><Mic size={18} />{recorder.status === "requesting" ? "Allow microphone access…" : recorder.status === "stopping" ? "Finishing…" : `Record take ${takes.length + 1}`}</button>}</div>{recorder.error && <p className="lr-error" role="alert">{recorder.error}</p>}</section><aside className="lr-delivery-notes"><div className="lr-eyebrow">{takes.length ? "YOUR ONE CHANGE" : "YOUR MISSION"}</div><h3>{takes.length ? focus.title : "Make the message land."}</h3><p>{takes.length ? coachCue.trim() || focus.tip : scenario.outcome}</p>{mode === "guided" && <div className="lr-cue" aria-live="polite"><strong>{!isRecording || !challenged ? "01 · Open with intention" : closing ? "03 · Close with clarity" : "02 · Respond to the concern"}</strong><p>{!isRecording || !challenged ? scenario.opening : closing ? scenario.close : scenario.response}</p></div>}<div className="lr-coach-note"><Bookmark size={18} /><p>Feel stuck? Mark the moment. Your coach can hear exactly where you need support.</p></div><small>Live cues guide your practice. Your AI coach analyses the recording after you finish.</small></aside></div>}

      {stage !== "setup" && stage !== "deliver" && takes.length > 0 && <LearningAIFeedback coach={aiCoach} take={takes[takes.length - 1]} onEvaluate={() => aiCoach.evaluate(takes[takes.length - 1], scenario, coachCue.trim() || focus.tip, takes[takes.length - 2])} onChange={session => setTakes(previous => previous.map(take => take.ai?._id === session._id ? { ...take, ai: session.deleted ? null : session } : take))} onUseFocus={cue => { setCoachCue(cue); setNotice("AI focus added. Use it for your next take."); }} />}
        {stage === "reflect" && <section className="lr-reflect lr-panel"><div><div className="lr-eyebrow">TAKE {takes.length} / SELF-REFLECTION</div><h3>How did that feel?</h3><audio ref={activeAudio} controls src={takes[takes.length - 1].url} aria-label="Listen to your latest take" />{takes[takes.length - 1].duration < OBJECTION_SECONDS && <p className="lr-short-note">You finished before the stakeholder question. In your next take, keep going past 0:30 to practise your response.</p>}<fieldset className="lr-confidence"><legend>Your confidence in this delivery</legend><div>{[1, 2, 3, 4, 5].map((value) => <button key={value} aria-label={`Confidence ${value} of 5`} aria-pressed={confidence === value} onClick={() => setConfidence(value)} className={confidence === value ? "selected" : ""}>{value}</button>)}</div><div className="lr-row"><small>Finding my feet</small><small>Ready for the room</small></div></fieldset></div><div><h3>What did you notice?</h3><p className="lr-muted">Check what you heard in your own delivery.</p><div className="lr-checks">{scenario.checks.map((item, i) => <label key={item}><input type="checkbox" checked={checks.includes(i)} onChange={() => setChecks((previous) => previous.includes(i) ? previous.filter((value) => value !== i) : [...previous, i])} />{item}</label>)}</div><button className="lr-primary" onClick={() => { activeAudio.current?.pause(); saveReflection(); }}>{takes.length === 1 ? "Choose one thing to change" : "Compare my takes"}<ArrowRight size={17} /></button><small className="lr-privacy">This is your reflection, not an automated score.</small></div></section>}

        {stage === "focus" && <section className="lr-panel"><p className="lr-muted">Choose one behavior to practise. You’ll face the same objection so you and your coach can hear what changed.</p><div className="lr-focus-options">{FOCUSES.map((item) => <button key={item.id} className={focus.id === item.id ? "selected" : ""} aria-pressed={focus.id === item.id} onClick={() => setFocus(item)}><Target size={21} /><h3>{item.title}</h3><p>{item.tip}</p></button>)}</div><label className="lr-field">Your coach’s cue <span>Optional · use this instead of the suggested cue</span><textarea value={coachCue} onChange={(event) => setCoachCue(event.target.value)} maxLength={500} placeholder="e.g. Pause before answering. Acknowledge the concern, then give your answer." rows={2} /></label><button className="lr-primary" onClick={() => { setMarkers([]); setStage("deliver"); }} disabled={busy}><RotateCcw size={17} /> Rehearse with this focus</button></section>}

        {stage === "review" && <><div className="lr-review-banner"><div className="lr-icon-tile"><CheckCircle2 size={27} /></div><div><h3>Two takes. A useful conversation.</h3><p>You practised “{focus.title.toLowerCase()}”. Listen for the difference, then let your coach help you take it further.</p></div></div><div className="lr-takes">{takes.map((take, i) => <TakePlayer key={take.url} take={take} index={i} />)}</div><div className="lr-setup-grid"><section className="lr-panel"><label className="lr-field">What should your coach listen for?<span>A moment, a question, or something that felt different.</span><textarea rows={4} value={reflection} maxLength={2000} onChange={(event) => setReflection(event.target.value)} placeholder="When the objection came, I rushed my answer. Did my pause in take two help?" /></label><div className="lr-objection-recap"><strong>The stakeholder question · 0:30</strong><p>“{scenario.objection}”</p></div></section><aside className="lr-coach-card"><div className="lr-eyebrow">YOUR NEXT COACHING SESSION</div><h2>Less recap.<br />More progress.</h2><p>Your review brief includes the scenario, your focus, self-reflections, and every marked timestamp.</p><button className="lr-primary" onClick={exportBrief}><Download size={18} /> Download coach brief</button><small>Download both takes separately above. Bring the files to your coach; nothing is sent automatically.</small></aside></div>{notice && <p className="lr-notice" role="status">{notice}</p>}<div className="lr-bottom-actions"><p>AI-reviewed recordings are saved in My Coaching. Download any local-only takes before leaving.</p><button className="lr-secondary" onClick={() => setResetConfirm(true)}><RotateCcw size={16} /> Practise another moment</button></div></>}
      </>}
      {notice && stage !== "review" && <p role="status" className="lr-notice">{notice}</p>}
      <footer className="lr-footer"><span>Small rehearsals. More intentional leadership.</span><span><Mic size={14} /> A space to practise, not perform.</span></footer>
    </main>
  );
}
