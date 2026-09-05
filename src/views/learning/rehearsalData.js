export const SCENARIOS = [
  {
    id: "change", icon: "shuffle", category: "CHANGE LEADERSHIP",
    title: "Bring your team through change",
    description: "Turn uncertainty into a clear next step.",
    audience: "Your team · Monday all-hands", role: "Team member", initials: "TM",
    brief: "Your team is moving to a new way of working next month. People are worried about workload and unclear expectations. Open the meeting, acknowledge the concern, and explain what happens next.",
    outcome: "Your team knows why the change matters and what to do this week.",
    opening: "Name the change and why it matters. Acknowledge what your team may be feeling.",
    objection: "We’re already stretched. What will you take off our plates to make this work?",
    response: "Acknowledge the trade-off. Name one concrete support you can offer without overpromising.",
    close: "Finish with one action, an owner, and a date.",
    checks: ["I acknowledged the impact on the team", "I addressed the workload concern directly", "I closed with a specific next step"],
  },
  {
    id: "board", icon: "briefcase", category: "EXECUTIVE PRESENCE",
    title: "Win support in the boardroom",
    description: "Make your recommendation land under pressure.",
    audience: "Executive committee · Investment decision", role: "Finance director", initials: "FD",
    brief: "You’re asking the executive committee to fund a three-month pilot. Budgets are tight. Make your recommendation, explain the business value, and ask for a decision. Use a real project or invent a simple example.",
    outcome: "The committee understands your recommendation, the risk, and the decision you need.",
    opening: "Lead with your recommendation, then give one reason it matters to the business.",
    objection: "Why should we fund this now? What happens if the pilot doesn’t deliver?",
    response: "Address timing and downside. Give a clear success measure and a stopping point.",
    close: "State the decision you need and when you need it.",
    checks: ["I led with a clear recommendation", "I explained the risk and how to limit it", "I made an explicit decision request"],
  },
  {
    id: "feedback", icon: "message", category: "DIFFICULT CONVERSATIONS",
    title: "Make tough feedback constructive",
    description: "Be direct without losing the relationship.",
    audience: "Direct report · Private one-to-one", role: "Direct report", initials: "DR",
    brief: "A capable colleague has missed two agreed deadlines, leaving others to cover. Start a private conversation. Describe the behavior and its impact, invite their perspective, and agree on a practical next step.",
    outcome: "Your colleague understands the issue and feels able to help solve it.",
    opening: "Describe the specific behavior and its impact without labeling the person.",
    objection: "That’s unfair. The priorities keep changing and nobody told me what mattered most.",
    response: "Pause before defending your view. Acknowledge their perspective and ask a genuine question.",
    close: "Propose a shared next step and a time to check in.",
    checks: ["I described behavior without judging the person", "I acknowledged their perspective", "I proposed a shared next step"],
  },
];

export const FOCUSES = [
  { id: "pause", title: "Own the pause", tip: "Take a two-second breath before answering the objection. Let your last sentence land." },
  { id: "headline", title: "Lead with the headline", tip: "Make your main point in your first sentence. Give the detail after the audience knows where you’re going." },
  { id: "close", title: "Make the next step clear", tip: "End with one concrete action, who owns it, and when it happens." },
];

export const TAKE_SECONDS = 90;
export const OBJECTION_SECONDS = 30;
export const CLOSE_SECONDS = 65;
export const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export function buildCoachBrief({ scenario, mode, focus, coachCue, reflection, takes }) {
  return [
    "XGOL · Leadership Rehearsal · Coach review brief",
    `Created: ${new Date().toISOString()}`, "",
    `Scenario: ${scenario.title}`, `Audience: ${scenario.audience}`, `Brief: ${scenario.brief}`,
    `Desired outcome: ${scenario.outcome}`, `Mode: ${mode === "pressure" ? "Under pressure" : "Guided"}`,
    `Stakeholder objection at ${formatTime(OBJECTION_SECONDS)}: ${scenario.objection}`, "",
    `Second-take focus: ${focus.title}`, `Practice cue: ${coachCue.trim() || focus.tip}`, "",
    ...takes.flatMap((take, i) => [
      `TAKE ${i + 1} · ${formatTime(take.duration)}`,
      `Objection reached: ${take.duration >= OBJECTION_SECONDS ? "Yes" : "No"}`,
      `Learner confidence (self-reported): ${take.confidence}/5`,
      `Learner self-checks: ${scenario.checks.filter((_, index) => take.checks.includes(index)).join("; ") || "None selected"}`,
      `Moments to review: ${take.markers.map(formatTime).join(", ") || "None marked"}`, "",
      ...(take.ai ? ["AI FEEDBACK", take.ai.feedback, `Saved coaching session: ${take.ai._id}`, ""] : []),
    ]),
    `Learner reflection: ${reflection.trim() || "Not provided"}`, "",
    "COACH REVIEW PROMPTS",
    "1. What changed in the delivery between the two takes?",
    "2. At the objection, did the speaker acknowledge the concern and answer it clearly?",
    "3. Which single delivery behavior should they practise next?", "",
    "Listen to the accompanying recordings. Self-checks are learner reflections, not an automated assessment.",
  ].join("\n");
}
