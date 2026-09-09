import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import CoachingHome from "./CoachingHome";
import { coachingApi, evaluateSnack } from "../../features/coaching/coachingService";
jest.mock("../../features/coaching/coachingService", () => ({ coachingApi: jest.fn(), evaluateSnack: jest.fn() }));
jest.mock("@iconify/react", () => ({ Icon: () => null }));
jest.mock("../../components/practice/AudioRecorder", () => () => <div>Audio recorder</div>);
jest.mock("./CoachTour", () => ({ __esModule: true, scrollToTourTarget: jest.fn(), default: ({ onClose }) => <button onClick={onClose}>Finish guided tour</button> }));
const plan = { id: "personal-plan", createdAt: "2026-09-08T10:00:00Z", checkIn: { energy: "nervous", minutes: 2, situation: "Ask my manager for a pilot" }, greeting: "Let's find your first sentence.", title: "Ask for a small pilot", reason: "A clear request helps your manager decide.", warmup: "Name the decision you need.", prompt: "Ask your manager to try your idea for two weeks.", opening: "I'd like to try a small pilot.", focus: "Make one concrete request.", curveball: "What would you stop doing to make time?", takeaway: "Make your request at your next meeting." };
let dashboard;
beforeEach(() => {
  Element.prototype.scrollIntoView = jest.fn();
  dashboard = { profile: { goal: "Win support", language: "English", style: "direct", minutes: 5 }, sessions: [], stats: { completed: 0, retries: 0, applied: 0 }, cost: 2, credits: 10, canEvaluate: true };
  coachingApi.mockReset(); evaluateSnack.mockReset();
  coachingApi.mockImplementation(async route => route === "/coaches" ? { coaches: [] } : dashboard);
});
test("starts a text snack, saves feedback and prepares a linked focused retry", async () => {
  evaluateSnack.mockImplementation(async fields => {
    const session = { _id: "111111111111111111111111", ...fields, status: "COMPLETED", feedback: "## One change\nLead with the recommendation.", nextFocus: "Lead with the recommendation.", exercise: "Say your first sentence twice.", createdAt: new Date().toISOString() };
    dashboard = { ...dashboard, sessions: [session], stats: { completed: 1, retries: 0, applied: 0 } };
    return { session, credits: 8 };
  });
  render(<MemoryRouter><CoachingHome /></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button", { name: /Pitch an idea/ }));
  fireEvent.click(screen.getByRole("button", { name: "Write · text feedback" }));
  fireEvent.change(screen.getByLabelText(/Your answer/), { target: { value: "I recommend a small pilot to test demand." } });
  fireEvent.click(screen.getByRole("button", { name: /Get my personalized feedback/ }));
  await screen.findByRole("button", { name: "Practise this change" });
  expect(evaluateSnack.mock.calls[0][0]).toMatchObject({ scenario: "pitch", text: "I recommend a small pilot to test demand." });
  expect(evaluateSnack.mock.calls[0][0].blob).toBeUndefined();
  fireEvent.click(screen.getByRole("button", { name: "Practise this change" }));
  expect(screen.getByLabelText(/One thing to work on/)).toHaveValue("Lead with the recommendation.");
});
test("does not offer paid evaluation without access and recovers from a loading failure", async () => {
  coachingApi.mockRejectedValueOnce(new Error("Connection unavailable"));
  dashboard.canEvaluate = false;
  render(<MemoryRouter><CoachingHome /></MemoryRouter>);
  expect(await screen.findByRole("alert")).toHaveTextContent("Connection unavailable");
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  fireEvent.click(await screen.findByRole("button", { name: /Pitch an idea/ }));
  expect(screen.getByRole("button", { name: /Get my personalized feedback/ })).toBeDisabled();
  await waitFor(() => expect(evaluateSnack).not.toHaveBeenCalled());
});

test("builds a plan from a check-in without assessing or spending credits, then rehearses it", async () => {
  coachingApi.mockImplementation(async (route, method, body) => {
    if (route === "/plan") {
      dashboard = { ...dashboard, profile: { ...dashboard.profile, currentPlan: plan } };
      return { plan };
    }
    return dashboard;
  });
  render(<MemoryRouter><CoachingHome /></MemoryRouter>);
  await screen.findByRole("button", { name: "Build my practice plan" });
  expect(coachingApi).not.toHaveBeenCalledWith("/plan", expect.anything(), expect.anything(), expect.anything());
  fireEvent.change(screen.getByLabelText(/A conversation you'd like help with/), { target: { value: "Ask my manager for a pilot" } });
  fireEvent.click(screen.getByRole("button", { name: "A little nervous" }));
  fireEvent.click(screen.getByRole("button", { name: "2 min" }));
  fireEvent.click(screen.getByRole("button", { name: "Build my practice plan" }));
  await screen.findByRole("heading", { name: plan.title });
  expect(coachingApi).toHaveBeenCalledWith("/plan", "POST", plan.checkIn, expect.any(AbortSignal));
  expect(evaluateSnack).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Let's rehearse this" }));
  expect(screen.getByLabelText("Your situation")).toHaveValue(plan.prompt);
  expect(screen.getByLabelText(/One thing to work on/)).toHaveValue(plan.focus);
  expect(screen.getByText("2 credits per AI assessment")).toBeInTheDocument();
});

test("a saved mission survives a failed new plan and its optional curveball starts a separate practice", async () => {
  dashboard.profile.currentPlan = plan;
  coachingApi.mockImplementation(async route => { if (route === "/plan") throw new Error("Your coach is temporarily unavailable."); return dashboard; });
  render(<MemoryRouter><CoachingHome /></MemoryRouter>);
  await screen.findByRole("heading", { name: plan.title });
  fireEvent.click(screen.getByRole("button", { name: "Build my practice plan" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("temporarily unavailable");
  expect(screen.getByRole("heading", { name: plan.title })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Give me a curveball" }));
  expect(screen.getByText(plan.curveball)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Rehearse my response" }));
  expect(screen.getByLabelText("Your situation").value).toContain(plan.curveball);
  expect(screen.getByRole("heading", { name: `Audience challenge: ${plan.title}` })).toBeInTheDocument();
  expect(evaluateSnack).not.toHaveBeenCalled();
});

test("offers a skippable tour, persists completion and lets returning users replay it", async () => {
  coachingApi.mockImplementation(async route => route === "/guide" ? { guideDismissedAt: "2026-09-08T10:00:00Z" } : dashboard);
  render(<MemoryRouter><CoachingHome /></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button", { name: /Take the 1-minute tour/ }));
  fireEvent.click(screen.getByRole("button", { name: "Finish guided tour" }));
  await waitFor(() => expect(coachingApi).toHaveBeenCalledWith("/guide", "PATCH", {}));
  expect(screen.queryByRole("region", { name: "Welcome to your coaching space" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Show me around" }));
  expect(screen.getByRole("button", { name: "Finish guided tour" })).toBeInTheDocument();
});

test("a pending plan prevents duplicate requests and is cancelled when leaving the page", async () => {
  let planSignal;
  coachingApi.mockImplementation((route, method, body, signal) => {
    if (route === "/plan") { planSignal = signal; return new Promise(() => {}); }
    return Promise.resolve(dashboard);
  });
  const { unmount } = render(<MemoryRouter><CoachingHome /></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button", { name: "Build my practice plan" }));
  expect(screen.getByRole("button", { name: /Your coach is building your plan/ })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Let's rehearse this" })).toBeDisabled();
  expect(coachingApi.mock.calls.filter(([route]) => route === "/plan")).toHaveLength(1);
  unmount();
  expect(planSignal.aborted).toBe(true);
});
