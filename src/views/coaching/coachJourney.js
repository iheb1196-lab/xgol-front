import { QUICK_STARTS, eventDays } from "./coachingData";

export const CHECK_INS = [
  { id: "nervous", label: "A little nervous", response: "Let's make the first step small. You can try your words here before you need them out there." },
  { id: "stuck", label: "Not sure where to start", response: "You don't need a finished idea. Give me the situation and we'll find your first sentence." },
  { id: "ready", label: "Ready to stretch", response: "Let's make it count. Start with your message, then try an unexpected audience question." },
];

export function startingMission(profile, latest) {
  const days = eventDays(profile.eventDate);
  const upcoming = days !== null && days >= 0;
  const scenario = QUICK_STARTS.find(item => `${profile.goal} ${profile.challenge}`.toLowerCase().includes(item.id)) || QUICK_STARTS[0];
  return {
    id: latest?._id || scenario.id,
    title: latest ? "Put your last piece of feedback to work" : upcoming ? `Find your opening for ${profile.eventName || "your next conversation"}` : "Make your first sentence count",
    reason: latest ? `Your latest ${latest.review?.focus ? "human coach review" : "AI feedback"} gives us a place to start. Try one change before adding anything new.` : upcoming ? `Your speaking moment ${days === 0 ? "is today" : days === 1 ? "is tomorrow" : `is in ${days} days`}. Let's begin with a clear opening.` : "A clear first sentence gives your audience a reason to listen. A short rehearsal is enough to find it.",
    warmup: "Think of one person you will speak to. Finish this sentence: ‘The one thing I want them to understand is…’",
    prompt: latest?.context || (upcoming ? `Rehearse the opening of ${profile.eventName || profile.goal}. Audience: ${profile.audience || "the people you want to reach"}. Give one reason to care, then state your main message in 30–60 seconds.` : scenario.prompt),
    opening: scenario.opening,
    focus: latest?.review?.focus || latest?.nextFocus || "Lead with one clear message for your audience.",
    curveball: "Your listener asks: ‘Why does this matter to me right now?’ Answer with one concrete example.",
    takeaway: "In your next conversation, say your main point in the first sentence. Notice what your listener asks next.",
    checkIn: { minutes: profile.minutes || 5 },
    previousSession: latest,
  };
}

export function missionPractice(mission, challenge = false) {
  if (mission.previousSession && !challenge) return mission.previousSession;
  return {
    id: mission.createdAt ? `mission-${mission.id}${challenge ? "-challenge" : ""}` : `${mission.id}${challenge ? "-challenge" : ""}`,
    title: challenge ? `Audience challenge: ${mission.title}`.slice(0, 150) : mission.title.slice(0, 150),
    prompt: challenge ? `${mission.prompt}\n\nNow respond to this audience question: ${mission.curveball}` : mission.prompt,
    focus: mission.focus,
    opening: challenge ? undefined : mission.opening,
  };
}
