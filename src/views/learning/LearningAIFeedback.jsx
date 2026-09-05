import { useState } from "react";
import { Link } from "react-router-dom";
import FeedbackRenderer from "../../components/practice/FeedbackRenderer";
import CoachingSession from "../coaching/CoachingSession";
import CoachProfile from "../coaching/CoachProfile";
import "../coaching/coaching.scss";

export default function LearningAIFeedback({ coach, take, setup, onEvaluate, onChange, onUseFocus }) {
  const [editing, setEditing] = useState(false);
  return <section className="learning-ai" aria-label="Personalized AI learning coach">
    {setup ? <div className="coach-card"><div className="learning-ai-heading"><div><span className="coach-eyebrow">YOUR PERSONAL LEARNING COACH</span><h2>Practise. Get feedback. Try one change.</h2><p>{coach.data?.profile?.goal || "Tell your coach what you want to achieve."}</p></div><button disabled={coach.busy} onClick={() => setEditing(!editing)}>Tailor my AI coach</button></div>
      <label className="coach-checkbox"><input type="checkbox" checked={coach.enabled} onChange={e => coach.setEnabled(e.target.checked)} /> Get AI feedback automatically after each take</label>
      <p className="learning-ai-note">{coach.data?.cost != null ? `${coach.data.cost} credits per take · ${coach.data.credits} available. ` : "Checking your AI coaching access… "}When enabled, each completed recording is saved to your account and sent for AI analysis. Your feedback appears here as it arrives.</p>
      {coach.data && !coach.data.canEvaluate && <p>You can rehearse locally. AI feedback needs an active license with enough credits. <Link to="/dashboard/subscription">View your plan</Link></p>}
      {coach.error && <p role="alert" className="coach-error">AI access could not be loaded. {coach.error} <button onClick={coach.refresh}>Retry</button></p>}
      {editing && <CoachProfile profile={coach.data?.profile} onSave={() => { setEditing(false); coach.refresh(); }} onCancel={() => setEditing(false)} />}
    </div> : take && <>
      {take.aiPending && <div className="coach-card" role="status"><span className="coach-eyebrow">AI FEEDBACK · TAILORED TO YOUR GOAL</span><h2>{take.aiText ? "Here’s what your coach noticed." : "Your AI coach is listening…"}</h2><p>Audio analysis can take about a minute. You can reflect on your take below while it runs.</p><FeedbackRenderer text={take.aiText} streaming /></div>}
      {take.aiError && <p role="alert" className="coach-error">{take.aiError} <Link to="/coaching">Check your saved attempts</Link></p>}
      {take.ai ? <><div className="coach-actions"><button onClick={() => onUseFocus(take.ai.nextFocus || take.ai.focus)}>Use this AI focus for my next take</button><Link to="/coaching">All saved coaching attempts</Link></div><CoachingSession key={take.ai._id} session={take.ai} onChange={onChange} /></> : !take.aiPending && <div className="coach-card"><h3>Get a personalized next step.</h3><p>{coach.data?.cost ?? "—"} credits for this take. Feedback considers your goal, audience, and experience.</p><button className="coach-primary" disabled={coach.busy || !coach.data?.canEvaluate || Boolean(take.aiSavedId)} onClick={onEvaluate}>Get AI feedback on this take</button>{take.aiSavedId && <p>This attempt was already saved. Open Coaching to check its status before recording a new attempt.</p>}<p><Link to="/coaching">Prefer text practice? Open My Coaching</Link></p></div>}
    </>}
  </section>;
}
