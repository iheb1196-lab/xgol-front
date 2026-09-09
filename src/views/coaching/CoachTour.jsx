import { useLayoutEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { ArrowRight, Sparkles, X } from "lucide-react";

const steps = [
  { target: "#coach-checkin .coach-checkin", title: "Start where you are. I'll help with the next step.", content: "Tell me about a conversation, how you're feeling, and the time you have. I'll turn that into a personal practice plan using your goal and recent practice. Creating a plan uses no credits." },
  { target: "#coach-mission .coach-mission-main", title: "One small mission. Something you can actually use.", content: "Warm up, rehearse with your voice or in writing, and take one change into real life. You'll see the assessment price before submitting. Feeling ready? Reveal a curveball and practice an unexpected audience question." },
  { target: "#coach-toolbox", title: "Bring the moment. Choose the kind of help.", content: "Start with a real situation, build a longer speech in Speech Studio, or practice a scenario in Learning Lab. After an assessment, ask your AI coach a follow-up or request an available human coach's review." },
  { target: "#coach-progress .coach-stats", title: "Keep the useful part of every practice.", content: "Your saved attempts live here. Revisit feedback, try a focused retry, and mark advice you've used in a real conversation. Your activity is a record of what you've done, so you can decide what helps." },
  { target: "#coach-memory", title: "Make this your kind of coaching.", content: "Set your goal, audience, language and feedback style. Add an upcoming event to prepare for it. You can change these anytime. Ready? Start with the check-in at the top. I'll help you make a plan." },
];

export function scrollToTourTarget(target) {
  if (!target) return;
  // Only the app's content panel scrolls. The dialog stays in the viewport.
  let parent = target.parentElement;
  while (parent && parent !== document.body) {
    if (/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) {
      parent.scrollTop += target.getBoundingClientRect().top - parent.getBoundingClientRect().top - 24;
      return;
    }
    parent = parent.parentElement;
  }
}

function visibleBounds(target, width, height) {
  const bounds = target.getBoundingClientRect();
  let left = Math.max(8, bounds.left - 6);
  let top = Math.max(8, bounds.top - 6);
  let right = Math.min(width - 8, bounds.right + 6);
  let bottom = Math.min(height - 8, bounds.bottom + 6);
  for (let parent = target.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
    const style = getComputedStyle(parent);
    const rect = parent.getBoundingClientRect();
    if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) { top = Math.max(top, rect.top); bottom = Math.min(bottom, rect.bottom); }
    if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) { left = Math.max(left, rect.left); right = Math.min(right, rect.right); }
  }
  return { left, top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
}

function positionDialog(rect, width, height, dialogHeight) {
  const margin = 16;
  const cardWidth = Math.min(420, width - margin * 2);
  const bottom = Math.max(margin, height - dialogHeight - margin);
  if (width <= 700) return { left: (width - cardWidth) / 2, top: rect?.top >= dialogHeight + margin * 2 ? margin : bottom, width: cardWidth };
  if (rect && rect.width && rect.height) {
    const right = rect.left + rect.width + margin;
    const left = rect.left - cardWidth - margin;
    if (right + cardWidth <= width - margin) return { left: right, top: Math.min(Math.max(margin, rect.top), bottom), width: cardWidth };
    if (left >= margin) return { left, top: Math.min(Math.max(margin, rect.top), bottom), width: cardWidth };
    if (rect.top + rect.height + margin + dialogHeight <= height - margin) return { left: Math.min(Math.max(margin, rect.left), width - cardWidth - margin), top: rect.top + rect.height + margin, width: cardWidth };
  }
  return { left: width - cardWidth - margin, top: bottom, width: cardWidth };
}

export default function CoachTour({ run, onClose }) {
  const [index, setIndex] = useState(0);
  const [layout, setLayout] = useState(null);
  const [paper, setPaper] = useState(null);
  const step = steps[index];

  useLayoutEffect(() => {
    if (!run) return undefined;
    const target = document.querySelector(step.target);
    scrollToTourTarget(target);
    let frame;
    const measure = () => {
      const width = document.documentElement.clientWidth || window.innerWidth;
      const height = window.visualViewport?.height || window.innerHeight;
      const rect = target ? visibleBounds(target, width, height) : null;
      const cardHeight = paper?.getBoundingClientRect().height || Math.min(410, height * 0.65);
      const position = positionDialog(rect, width, height, cardHeight);
      // Keep the mobile spotlight in the visible space beside the fixed sheet.
      if (rect && width <= 700) {
        if (rect.top < position.top) rect.height = Math.max(0, Math.min(rect.height, position.top - rect.top - 12));
        else {
          const end = rect.top + rect.height;
          rect.top = Math.max(rect.top, position.top + cardHeight + 12);
          rect.height = Math.max(0, end - rect.top);
        }
      }
      const next = { rect, position, width, height };
      setLayout(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const resize = () => { scrollToTourTarget(target); schedule(); };
    measure();
    // Capture nested scrolls: window's ordinary scroll listener misses these.
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    if (target) observer?.observe(target);
    if (paper) observer?.observe(paper);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
    };
  }, [run, step, paper]);

  const rect = layout?.rect;
  const hasSpotlight = rect && rect.width > 0 && rect.height > 0;
  return <Dialog open={run} onClose={(_, reason) => { if (reason !== "backdropClick") onClose(); }}
    className="coach-tour-modal" maxWidth={false} transitionDuration={0}
    aria-labelledby="coach-tour-title" aria-describedby="coach-tour-description"
    PaperProps={{ ref: setPaper, className: "coach-tour-tooltip", style: layout?.position }}
    BackdropProps={{ className: "coach-tour-backdrop", children: <svg className="coach-tour-mask" aria-hidden="true" width="100%" height="100%">
      <defs><mask id="coach-tour-cutout" maskUnits="userSpaceOnUse" x="0" y="0" width={layout?.width || "100%"} height={layout?.height || "100%"}><rect width="100%" height="100%" fill="white" />{hasSpotlight && <rect x={rect.left} y={rect.top} width={rect.width} height={rect.height} rx="14" fill="black" />}</mask></defs>
      <rect width="100%" height="100%" fill="rgba(27, 25, 44, .58)" mask="url(#coach-tour-cutout)" />
      {hasSpotlight && <rect data-tour-target={step.target} x={rect.left} y={rect.top} width={rect.width} height={rect.height} rx="14" fill="none" stroke="#c5b6f1" strokeWidth="2" />}
    </svg> }}>
    <div className="coach-tour-top"><span><Sparkles size={18} aria-hidden="true" />YOUR AI COACH · A QUICK TOUR</span><button aria-label="Close coaching tour" onClick={onClose}><X size={18} /></button></div>
    <div className="coach-tour-copy" tabIndex={0} aria-label="Tour explanation"><h2 id="coach-tour-title">{step.title}</h2><p id="coach-tour-description">{step.content}</p></div>
    <div className="coach-tour-progress" aria-label={"Step " + (index + 1) + " of " + steps.length}>{steps.map((_, i) => <span key={i} className={i === index ? "is-active" : ""} />)}<small>{index + 1} / {steps.length}</small></div>
    <div className="coach-tour-actions"><button onClick={() => index ? setIndex(index - 1) : onClose()}>{index ? "Back" : "Skip tour"}</button><button autoFocus className="coach-tour-next" onClick={() => index === steps.length - 1 ? onClose() : setIndex(index + 1)}>{index === steps.length - 1 ? "Let's get started" : "Show me more"}<ArrowRight size={16} aria-hidden="true" /></button></div>
  </Dialog>;
}
