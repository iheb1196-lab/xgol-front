import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import CoachingHome from "./CoachingHome";
import { coachingApi, evaluateSnack } from "../../features/coaching/coachingService";
jest.mock("../../features/coaching/coachingService", () => ({ coachingApi: jest.fn(), evaluateSnack: jest.fn() }));
jest.mock("@iconify/react", () => ({ Icon: () => null }));
jest.mock("../../components/practice/AudioRecorder", () => () => <div>Audio recorder</div>);
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
