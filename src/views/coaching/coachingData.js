export const QUICK_STARTS = [
  { id: "pitch", title: "Pitch an idea", tag: "PERSUADE", prompt: "You have one minute to win support for an idea. Explain the problem, your recommendation, one reason to believe it, and the decision you need.", opening: "My recommendation is…", icon: "↗" },
  { id: "interview", title: "Prepare for an interview", tag: "MAKE AN IMPRESSION", prompt: "Answer: Tell me about a challenge you handled well. Describe the situation briefly, your specific action, the result, and what you learned.", opening: "A challenge that taught me a lot was…", icon: "◎" },
  { id: "feedback", title: "Have a difficult conversation", tag: "BUILD TRUST", prompt: "A colleague missed two deadlines. Explain the specific behavior and impact, invite their perspective, and propose a shared next step.", opening: "I’d like to talk about what happened with…", icon: "↔" },
  { id: "presentation", title: "Open a presentation", tag: "ENGAGE", prompt: "Deliver the opening minute of your presentation. Give the audience a reason to care, state your main message, and explain what they will take away.", opening: "By the end of this conversation, you’ll…", icon: "◈" },
];
export const PROFILE_DEFAULTS = { goal: "Speak with confidence", role: "", audience: "", challenge: "", level: "developing", language: "English", style: "supportive", minutes: 5, eventName: "", eventDate: "" };
export function profileFields(profile = {}) { return Object.fromEntries(Object.entries(PROFILE_DEFAULTS).map(([key, value]) => [key, profile[key] ?? value])); }
export function feedbackSection(text = "", name) { return text.split(/^## /m).find(part => part.startsWith(`${name}\n`) || part.startsWith(`${name}\r\n`))?.split("\n").slice(1).join("\n").trim() || ""; }
export function replayMoments(text = "", duration = 0) {
  return [...feedbackSection(text, "Moments to replay").matchAll(/\[(\d{1,2}):(\d{2})\]\s*([^\n]+)/g)].map(m => ({ seconds: Number(m[1]) * 60 + Number(m[2]), note: m[3] })).filter(m => m.seconds <= duration).slice(0, 3);
}
export function eventDays(date) {
  if (!date) return null;
  const today = new Date();
  return Math.round((new Date(`${date}T00:00:00`) - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
}
export function exportBrief(session) {
  const content = [`XGOL · Coaching brief`, session.title, `Goal: ${session.profile?.goal || ""}`, `Audience: ${session.profile?.audience || ""}`, `Context: ${session.context}`, `Focus: ${session.focus}`, "", "AI FEEDBACK", session.feedback, "", "HUMAN COACH FEEDBACK", session.review?.feedback || "Not requested or not yet available", session.review?.focus || "", session.review?.exercise || "", "LEARNER QUESTION", session.review?.question || "", "COACH ANSWER", session.review?.answer || ""].join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = "xgol-coaching-brief.txt"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
