/* eslint-disable react-hooks/exhaustive-deps */
import "./practiceSession.scss";
import { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import RouterLink from "../../routes/components/router-link";
import CustomButton from "../../components/customButton";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import FeedbackRenderer from "../../components/practice/FeedbackRenderer";
import { formatSeconds } from "../../components/practice/AudioRecorder";
import { useRouter } from "../../routes/hooks";

import { getSession } from "../../features/practice/practiceSlice";
import { getSessionAudioUrl } from "../../features/practice/practiceService";

const PracticeSessionView = () => {
  const { sessionId } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, sessionDetails, error } = useSelector(
    (state) => state.practice
  );
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioError, setAudioError] = useState(null);

  useEffect(() => {
    dispatch(getSession(sessionId));
  }, []);

  useEffect(() => {
    let revoked = null;
    getSessionAudioUrl(sessionId)
      .then((url) => {
        revoked = url;
        setAudioUrl(url);
      })
      .catch((err) => setAudioError(err.message));
    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [sessionId]);

  const breadcrumbs = [
    <RouterLink href="/" className="link" key="1">
      <img src="/assets/icons/breadcrumbs/home.svg" alt="" />
    </RouterLink>,
    <RouterLink key="2" href="/my_practices" className="link">
      Public Speaking
    </RouterLink>,
    <RouterLink key="3" href="/my_practices" className="link">
      My Practices
    </RouterLink>,
    <Typography key="4" color="text.primary" className="active_breadcrumb">
      {sessionDetails?.speech?.title ?? "Practice session"}
    </Typography>,
  ];

  return (
    <div className="view-container practice_session">
      <div className="view_header">
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div className="second_header">
          <div>
            <h2>{sessionDetails?.speech?.title}</h2>
            <p>
              Practiced on{" "}
              {moment(sessionDetails?.createdAt).format("DD/MM/yyyy [at] HH:mm")}
              {sessionDetails?.duration
                ? ` — ${formatSeconds(sessionDetails.duration)}`
                : ""}
            </p>
          </div>
          {sessionDetails?.speech && (
            <CustomButton
              text={"Practice again"}
              primary
              icon={<Icon icon="mdi:microphone" width={18} />}
              handleClick={() =>
                router.push(
                  `/my_speeches/${sessionDetails.speech._id}/practice`
                )
              }
            />
          )}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        sessionDetails && (
          <div className="session_body">
            <div className="session_side">
              <div className="session_card">
                <h4>
                  <Icon icon="mdi:play-circle-outline" width={18} />
                  Your recording
                </h4>
                {audioUrl ? (
                  <audio controls src={audioUrl} className="session_audio" />
                ) : audioError ? (
                  <p className="audio_error">{audioError}</p>
                ) : (
                  <p className="audio_loading">Loading recording...</p>
                )}
                {sessionDetails.objective && (
                  <div className="session_objective">
                    <span className="objective_label">Objective</span>
                    <span className="secondary_button_tag">
                      {sessionDetails.objective}
                    </span>
                  </div>
                )}
              </div>
              <div className="session_card">
                <h4>
                  <Icon icon="mdi:script-text-outline" width={18} />
                  The script
                </h4>
                <p className="session_script">{sessionDetails.speech?.text}</p>
              </div>
            </div>

            <div className="session_feedback">
              <h3>AI coach feedback</h3>
              {sessionDetails.status === "COMPLETED" ? (
                <>
                  {sessionDetails.comparedToSession && (
                    <p className="comparison_source">
                      Compared with your practice of {" "}
                      <strong>
                        {sessionDetails.comparedToSession.speech?.title ||
                          "your previous speech"}
                      </strong>{" "}
                      from {" "}
                      {moment(sessionDetails.comparedToSession.createdAt).format(
                        "DD/MM/yyyy"
                      )}
                      .
                    </p>
                  )}
                  <FeedbackRenderer text={sessionDetails.feedback} />
                </>
              ) : (
                <ErrorMessage
                  message={
                    sessionDetails.status === "FAILED"
                      ? "The evaluation of this session failed. Record a new take to get feedback."
                      : "The feedback for this session is not available yet."
                  }
                />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PracticeSessionView;
