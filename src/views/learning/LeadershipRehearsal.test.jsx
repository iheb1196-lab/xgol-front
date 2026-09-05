import React from "react";
import { act, fireEvent, render as renderUI, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { coachingApi, evaluateSnack } from "../../features/coaching/coachingService";
import "@testing-library/jest-dom";
import LeadershipRehearsal from "./LeadershipRehearsal";
import { buildCoachBrief, SCENARIOS, FOCUSES } from "./rehearsalData";

let media;
let stopTrack;
let getUserMedia;
jest.mock("../../features/coaching/coachingService", () => ({ coachingApi: jest.fn(), evaluateSnack: jest.fn() }));
jest.mock("@iconify/react", () => ({ Icon: () => null }));
const render = node => renderUI(<MemoryRouter>{node}</MemoryRouter>);

beforeEach(() => {
  coachingApi.mockResolvedValue({ canEvaluate: false, cost: 2, credits: 0, profile: { goal: "Speak clearly" } });
  evaluateSnack.mockReset();
  jest.useFakeTimers();
  stopTrack = jest.fn();
  getUserMedia = jest.fn().mockResolvedValue({ getTracks: () => [{ stop: stopTrack }] });
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });
  window.MediaRecorder = class {
    constructor() { this.state = "inactive"; this.mimeType = "audio/webm"; media = this; }
    start() { this.state = "recording"; }
    stop() {
      this.state = "inactive";
      this.ondataavailable?.({ data: new Blob(["recorded audio"], { type: this.mimeType }) });
      this.onstop?.();
    }
  };
  URL.createObjectURL = jest.fn().mockImplementation(() => `blob:take-${Math.random()}`);
  URL.revokeObjectURL = jest.fn();
  jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

test("learning recordings automatically receive personalized AI feedback and link the retry", async () => {
  coachingApi.mockResolvedValue({ canEvaluate: true, cost: 2, credits: 10, profile: { goal: "Win board support" } });
  evaluateSnack.mockImplementation(async (fields, callbacks) => {
    callbacks.onDelta("## One change\nLead with the decision.");
    return { credits: 8, session: { _id: "111111111111111111111111", title: fields.title, status: "COMPLETED", feedback: "## One change\nLead with the decision.", nextFocus: "Lead with the decision.", exercise: "Say the headline, pause, repeat.", createdAt: new Date().toISOString() } };
  });
  await act(async () => render(<LeadershipRehearsal />));
  enterRoom(); await startTake();
  act(() => jest.advanceTimersByTime(31000));
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Finish take" })));
  expect(evaluateSnack).toHaveBeenCalledTimes(1);
  expect(evaluateSnack.mock.calls[0][0]).toMatchObject({ source: "learning", scenario: "leadership-change" });
  fireEvent.click(screen.getByRole("button", { name: "Use this AI focus for my next take" }));
  fireEvent.click(screen.getByRole("button", { name: /Choose one thing to change/ }));
  expect(screen.getByLabelText(/Your coach’s cue/)).toHaveValue("Lead with the decision.");
  fireEvent.click(screen.getByRole("button", { name: /Rehearse with this focus/ }));
  await startTake(2);
  act(() => jest.advanceTimersByTime(31000));
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Finish take" })));
  expect(evaluateSnack.mock.calls[1][0]).toMatchObject({ previous: "111111111111111111111111", focus: "Lead with the decision." });
});

afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

async function startTake(number = 1) {
  await act(async () => fireEvent.click(screen.getByRole("button", { name: `Record take ${number}` })));
}

function enterRoom() {
  fireEvent.click(screen.getByRole("button", { name: /Enter the rehearsal/ }));
}

test("completes two takes with a timed objection, marker, focus, and separate coach downloads", async () => {
  render(<LeadershipRehearsal />);
  enterRoom();
  await startTake();
  expect(screen.getByText("RECORDING")).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(31000));
  expect(screen.getByRole("heading", { name: /We’re already stretched/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Mark for coach" }));
  fireEvent.click(screen.getByRole("button", { name: "Finish take" }));
  expect(stopTrack).toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confidence 4 of 5" }));
  fireEvent.click(screen.getByLabelText("I acknowledged the impact on the team"));
  fireEvent.click(screen.getByRole("button", { name: /Choose one thing to change/ }));
  fireEvent.change(screen.getByLabelText(/Your coach’s cue/), { target: { value: "Breathe before you answer." } });
  fireEvent.click(screen.getByRole("button", { name: /Rehearse with this focus/ }));
  expect(screen.getByText("Breathe before you answer.")).toBeInTheDocument();
  await startTake(2);
  act(() => jest.advanceTimersByTime(90000));
  expect(screen.getByText("How did that feel?")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Compare my takes/ }));
  expect(screen.getByLabelText("Take 1 recording")).toBeInTheDocument();
  expect(screen.getByLabelText("Take 2 recording")).toBeInTheDocument();
  expect(screen.getByText("Self-reported confidence: 4/5")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "0:31" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Download take 1" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Download take 2" })).toBeInTheDocument();
  const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  fireEvent.click(screen.getByRole("button", { name: "Download coach brief" }));
  expect(click).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("status")).toHaveTextContent("Brief downloaded");
});

test("pressure mode hides guidance while retaining the stakeholder objection", async () => {
  render(<LeadershipRehearsal />);
  fireEvent.click(screen.getByRole("button", { name: /Win support in the boardroom/ }));
  fireEvent.click(screen.getByRole("button", { name: /Under pressure/ }));
  enterRoom();
  expect(screen.queryByText("01 · Open with intention")).not.toBeInTheDocument();
  await startTake();
  act(() => jest.advanceTimersByTime(30000));
  expect(screen.getByRole("heading", { name: /Why should we fund this now/ })).toBeInTheDocument();
});

test("denied microphone leaves a retryable state without creating a take", async () => {
  getUserMedia.mockRejectedValueOnce(Object.assign(new Error("Denied"), { name: "NotAllowedError" }));
  render(<LeadershipRehearsal />);
  enterRoom();
  await startTake();
  expect(screen.getByRole("alert")).toHaveTextContent("Microphone access was denied");
  expect(screen.queryByText("How did that feel?")).not.toBeInTheDocument();
  await startTake();
  expect(screen.getByText("RECORDING")).toBeInTheDocument();
});

test("unmount releases the microphone and does not generate an orphan recording", async () => {
  const { unmount } = render(<LeadershipRehearsal />);
  enterRoom();
  await startTake();
  unmount();
  expect(stopTrack).toHaveBeenCalled();
  expect(media.state).toBe("inactive");
  expect(URL.createObjectURL).not.toHaveBeenCalled();
});

test("a microphone request resolved after leaving is immediately released", async () => {
  let resolve;
  getUserMedia.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
  const { unmount } = render(<LeadershipRehearsal />);
  enterRoom();
  await startTake();
  unmount();
  await act(async () => resolve({ getTracks: () => [{ stop: stopTrack }] }));
  expect(stopTrack).toHaveBeenCalled();
  expect(URL.createObjectURL).not.toHaveBeenCalled();
});

test("an early finish is identified and clearing a rehearsal revokes its audio URL", async () => {
  render(<LeadershipRehearsal />);
  enterRoom();
  await startTake();
  act(() => jest.advanceTimersByTime(5000));
  fireEvent.click(screen.getByRole("button", { name: "Finish take" }));
  expect(screen.getByText(/You finished before the stakeholder question/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Change scenario" }));
  fireEvent.click(screen.getByRole("button", { name: "Keep this rehearsal" }));
  expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Change scenario" }));
  fireEvent.click(screen.getByRole("button", { name: "Clear takes & start again" }));
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: /Enter the rehearsal/ })).toBeInTheDocument();
});

test("coach brief preserves human context and does not invent assessment results", () => {
  const brief = buildCoachBrief({ scenario: SCENARIOS[0], mode: "guided", focus: FOCUSES[0], coachCue: "Pause first", reflection: "Did I sound defensive?", takes: [{ duration: 42, markers: [31], confidence: 2, checks: [0] }, { duration: 20, markers: [], confidence: 4, checks: [] }] });
  expect(brief).toContain("Practice cue: Pause first");
  expect(brief).toContain("Moments to review: 0:31");
  expect(brief).toContain("Objection reached: No");
  expect(brief).toContain("Learner reflection: Did I sound defensive?");
  expect(brief).toContain("not an automated assessment");
});
