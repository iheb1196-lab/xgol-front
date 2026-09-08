import Joyride, { ACTIONS, STATUS } from "react-joyride";
import { ArrowRight, Sparkles, X } from "lucide-react";

const steps = [
  { target: "#coach-checkin", title: "Start where you are. I'll help with the next step.", content: "Tell me about a conversation, how you're feeling, and the time you have. I'll turn that into a personal practice plan using your goal and recent practice. Creating a plan uses no credits." },
  { target: "#coach-mission", title: "One small mission. Something you can actually use.", content: "Warm up, rehearse with your voice or in writing, and take one change into real life. You'll see the assessment price before submitting. Feeling ready? Reveal a curveball and practice an unexpected audience question." },
  { target: "#coach-toolbox", title: "Bring the moment. Choose the kind of help.", content: "Start with a real situation, build a longer speech in Speech Studio, or practice a scenario in Learning Lab. After an assessment, ask your AI coach a follow-up or request an available human coach's review." },
  { target: "#coach-progress", title: "Keep the useful part of every practice.", content: "Your saved attempts live here. Revisit feedback, try a focused retry, and mark advice you've used in a real conversation. Your activity is a record of what you've done, so you can decide what helps." },
  { target: "#coach-memory", title: "Make this your kind of coaching.", content: "Set your goal, audience, language and feedback style. Add an upcoming event to prepare for it. You can change these anytime. Ready? Start with the check-in at the top. I'll help you make a plan." },
].map(step => ({ ...step, disableBeacon: true, placement: "auto" }));

function CoachTooltip({ backProps, closeProps, primaryProps, skipProps, tooltipProps, index, isLastStep, step }) {
  return <div {...tooltipProps} className="coach-tour-tooltip" aria-labelledby="coach-tour-title" aria-describedby="coach-tour-description">
    <div className="coach-tour-top"><span><Sparkles size={18} aria-hidden="true" />YOUR AI COACH · A QUICK TOUR</span><button {...closeProps} aria-label="Close coaching tour"><X size={18} /></button></div>
    <h2 id="coach-tour-title">{step.title}</h2><p id="coach-tour-description">{step.content}</p>
    <div className="coach-tour-progress" aria-label={`Step ${index + 1} of ${steps.length}`}>{steps.map((_, i) => <span key={i} className={i === index ? "is-active" : ""} />)}<small>{index + 1} / {steps.length}</small></div>
    <div className="coach-tour-actions"><button {...(index ? backProps : skipProps)} aria-label={index ? "Back" : "Skip tour"}>{index ? "Back" : "Skip tour"}</button><button {...primaryProps} aria-label={isLastStep ? "Let's get started" : "Show me more"} className="coach-tour-next">{isLastStep ? "Let's get started" : "Show me more"}<ArrowRight size={16} aria-hidden="true" /></button></div>
  </div>;
}

export default function CoachTour({ run, onClose }) {
  return <Joyride run={run} steps={steps} continuous showSkipButton disableOverlayClose scrollToFirstStep
    tooltipComponent={CoachTooltip} scrollOffset={32}
    scrollDuration={typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 250}
    callback={({ action, status }) => { if (action === ACTIONS.CLOSE || [STATUS.FINISHED, STATUS.SKIPPED].includes(status)) onClose(); }}
    styles={{ options: { zIndex: 10000, arrowColor: "#fffdf9", overlayColor: "rgba(27, 25, 44, .58)", primaryColor: "#6550c8" }, spotlight: { borderRadius: 20 } }} />;
}
