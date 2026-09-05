/* eslint-disable react-hooks/exhaustive-deps */
import "./practiceView.scss";
import { useEffect, useRef, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import RouterLink from "../../routes/components/router-link";
import CustomButton from "../../components/customButton";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import AudioRecorder from "../../components/practice/AudioRecorder";
import ObjectivePicker from "../../components/practice/ObjectivePicker";
import FeedbackRenderer from "../../components/practice/FeedbackRenderer";
import { useToast } from "../../components/toasts/ToastProvider";
import { useRouter } from "../../routes/hooks";

import { getSpeech } from "../../features/speech/speechSlice";
import { submitPracticeStream } from "../../features/practice/practiceService";
import { blobToWav } from "../../utils/audioWav";
import { OBJECTIVES, buildObjective } from "../../constants/practice.constant";

const PracticeView = () => {
  const { speechId } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { showToast } = useToast();

  const { loading, speechDetails, error } = useSelector(
    (state) => state.speech
  );

  const [objectiveCode, setObjectiveCode] = useState(null);
  const [audience, setAudience] = useState("");
  const [recording, setRecording] = useState(null); // { blob, duration }
  const [phase, setPhase] = useState("setup"); // setup | submitting | streaming | done
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [processingStage, setProcessingStage] = useState("uploading");
  const [credits, setCredits] = useState(null);
  const [recorderKey, setRecorderKey] = useState(0);

  const feedbackPanelRef = useRef(null);

  useEffect(() => {
    dispatch(getSpeech(speechId));
  }, []);

  useEffect(() => {
    if ((phase === "submitting" || phase === "streaming") && feedbackPanelRef.current) {
      feedbackPanelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [phase]);

  const objectiveLabel = OBJECTIVES.find(
    (o) => o.code === objectiveCode
  )?.label;

  const onRecordingChange = (blob, duration) => {
    setRecording(blob ? { blob, duration } : null);
  };

  const resetForNextTake = () => {
    setRecording(null);
    setFeedback("");
    setFeedbackError("");
    setCredits(null);
    setPhase("setup");
    setRecorderKey((key) => key + 1);
  };

  const submitRecording = async () => {
    if (!recording) return;
    setPhase("submitting");
    setFeedback("");
    setFeedbackError("");
    setProcessingStage("uploading");
    try {
      const wavBlob = await blobToWav(recording.blob);
      const result = await submitPracticeStream(
        {
          audioBlob: wavBlob,
          speechId,
          objective: buildObjective(objectiveLabel, audience),
          duration: Math.round(recording.duration),
        },
        {
          onDelta: (delta) => {
            setPhase("streaming");
            setFeedback((prev) => prev + delta);
          },
          onStatus: (stage) => setProcessingStage(stage),
        }
      );
      setFeedback(result.feedback);
      setCredits(result.credits);
      setPhase("done");
    } catch (err) {
      console.error(err);
      const message = err.audioSaved
        ? `Your recording was saved, but feedback failed: ${err.message}`
        : err.message || "The upload failed, please try again";
      showToast(message, "error");
      if (err.audioSaved) {
        setFeedbackError(message);
        setPhase("failed");
      } else {
        setPhase("setup");
      }
    }
  };

  const breadcrumbs = [
    <RouterLink href="/" className="link" key="1">
      <img src="/assets/icons/breadcrumbs/home.svg" alt="" />
    </RouterLink>,
    <RouterLink key="2" href="/my_speeches" className="link">
      Public Speaking
    </RouterLink>,
    <RouterLink key="3" href="/my_speeches" className="link">
      My Speeches
    </RouterLink>,
    <Typography key="4" color="text.primary" className="active_breadcrumb">
      Practice
    </Typography>,
  ];

  const steps = [
    { id: "objective", label: "Objective", done: !!objectiveCode || phase !== "setup" },
    { id: "record", label: "Record", done: !!recording || phase === "streaming" || phase === "done" },
    { id: "feedback", label: "Feedback", done: phase === "done" },
  ];

  const busy = phase === "submitting" || phase === "streaming";

  return (
    <div className="view-container practice_view">
      <div className="view_header">
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div className="second_header">
          <div>
            <h2>{speechDetails?.title}</h2>
            <p>Read your script aloud and get instant AI coaching.</p>
          </div>
          <div className="practice_steps">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={classNames("practice_step", { done: step.done })}
              >
                <span className="step_index">
                  {step.done ? <Icon icon="mdi:check" width={14} /> : index + 1}
                </span>
                {step.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="practice_body">
          <div className="practice_script">
            <p className="speech-title">{speechDetails?.title}</p>
            <hr className="divider" />
            <p className="speech-text">{speechDetails?.text}</p>
          </div>

          <div className="practice_main">
            <div className="practice_card">
              <h3>
                <span className="card_step">1</span> Set your objective
              </h3>
              <p className="card_hint">
                What should this delivery achieve? The AI coach tailors its
                feedback to your goal.
                {" "}<RouterLink href="/coaching">Personalize your coach’s language, style, and goals.</RouterLink>
              </p>
              <ObjectivePicker
                selected={objectiveCode}
                onSelect={setObjectiveCode}
                audience={audience}
                onAudienceChange={setAudience}
                disabled={busy}
              />
            </div>

            <div className="practice_card">
              <h3>
                <span className="card_step">2</span> Record your delivery
              </h3>
              <AudioRecorder
                key={recorderKey}
                onRecordingChange={onRecordingChange}
                disabled={busy || phase === "done"}
              />
              {recording && phase === "setup" && (
                <div className="submit_row">
                  <CustomButton
                    text={"Get AI feedback"}
                    primary
                    icon={<Icon icon="mdi:creation" width={18} />}
                    handleClick={submitRecording}
                    className="_practiceSubmitButton"
                  />
                </div>
              )}
            </div>

            {phase !== "setup" && (
              <div className="practice_card feedback_panel" ref={feedbackPanelRef}>
                <h3>
                  <span className="card_step">3</span> Your AI coach feedback
                </h3>
                {phase === "submitting" ? (
                  <div className="feedback_waiting">
                    <span className="waiting_dot" />
                    <span className="waiting_dot" />
                    <span className="waiting_dot" />
                    <span className="waiting_text">
                      {processingStage === "evaluating"
                        ? "Preparing your feedback..."
                        : "Uploading your recording..."}
                    </span>
                  </div>
                ) : phase === "failed" ? (
                  <div className="recorder_error">{feedbackError}</div>
                ) : (
                  <FeedbackRenderer
                    text={feedback}
                    streaming={phase === "streaming"}
                  />
                )}

                {phase === "done" && (
                  <div className="feedback_actions">
                    <CustomButton
                      text={"Try again"}
                      primary
                      icon={<Icon icon="mdi:microphone" width={18} />}
                      handleClick={resetForNextTake}
                      className="_practiceTryAgainButton"
                    />
                    <CustomButton
                      text={"View practice history"}
                      handleClick={() => router.push("/my_practices")}
                    />
                    {credits !== null && (
                      <span className="credits_left">
                        {credits} credit(s) left
                      </span>
                    )}
                  </div>
                )}
                {phase === "failed" && (
                  <div className="feedback_actions">
                    <CustomButton
                      text={"Try another take"}
                      primary
                      icon={<Icon icon="mdi:microphone" width={18} />}
                      handleClick={resetForNextTake}
                    />
                    <CustomButton
                      text={"View saved recording"}
                      handleClick={() => router.push("/my_practices")}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeView;
