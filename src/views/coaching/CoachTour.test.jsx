import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CoachTour, { scrollToTourTarget } from "./CoachTour";

test("scrolls the content panel without scrolling the document", () => {
  const panel = document.createElement("div");
  const target = document.createElement("section");
  panel.style.overflowY = "auto";
  panel.appendChild(target); document.body.appendChild(panel);
  panel.scrollTop = 100;
  panel.getBoundingClientRect = () => ({ top: 24 });
  target.getBoundingClientRect = () => ({ top: 300 });
  const originalScroll = window.scrollY;
  scrollToTourTarget(target);
  expect(panel.scrollTop).toBe(352);
  expect(window.scrollY).toBe(originalScroll);
  panel.remove();
});

test("real tour dialog supports next, back and completion without the positioning library", async () => {
  const onClose = jest.fn();
  render(<CoachTour run onClose={onClose} />);
  expect(await screen.findByRole("dialog")).toHaveAccessibleName(/Start where you are/);
  fireEvent.click(screen.getByRole("button", { name: "Show me more" }));
  expect(screen.getByRole("dialog")).toHaveAccessibleName(/One small mission/);
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(screen.getByRole("dialog")).toHaveAccessibleName(/Start where you are/);
  for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole("button", { name: "Show me more" }));
  expect(screen.getByRole("dialog")).toHaveAccessibleName(/Make this your kind/);
  fireEvent.click(screen.getByRole("button", { name: "Let's get started" }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("Escape and the close button exit immediately and focus stays inside the dialog", async () => {
  const onClose = jest.fn();
  render(<CoachTour run onClose={onClose} />);
  const dialog = await screen.findByRole("dialog");
  await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
  expect(onClose).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Close coaching tour" }));
  expect(onClose).toHaveBeenCalledTimes(2);
});
