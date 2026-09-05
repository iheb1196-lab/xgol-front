import React, { useEffect } from "react";
import "./speechDetails.scss";
import RouterLink from "../../../routes/components/router-link";
import {
  Breadcrumbs,
  Stack,
  Typography,
} from "@mui/material";
import CustomButton from "../../../components/customButton";
import DeleteButton from "../../../components/deleteButton/DeleteButton";
import { deleteSpeech, getSpeech } from "../../../features/speech/speechSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRouter } from "../../../routes/hooks";
import { useToast } from "components/toasts/ToastProvider";

const SpeechDetailsView = () => {
  const router = useRouter();
  const { state } = useLocation();
  const { speechId } = useParams();

  const { showToast } = useToast();

  const navigate = useNavigate();

  const { speechDetails } = useSelector((state) => state.speech);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSpeech(speechId));
  }, [dispatch, speechId]);
  const breadcrumbs = [
    <RouterLink key="1" href="/" className="link">
      <img src="/assets/icons/breadcrumbs/home.svg" alt="" />
    </RouterLink>,
    <RouterLink key="2" href="/my_speeches" className="link">
      Public Speaking
    </RouterLink>,
    <RouterLink key="3" href="/my_speeches" className="link">
      My Speeches
    </RouterLink>,
    <Typography key="4" color="text.primary" className="active_breadcrumb">
      {speechDetails?.title}
    </Typography>,
  ];

  const onDeleteClick = () => {
    dispatch(deleteSpeech(speechId))
      .unwrap()
      .then(() => {
        showToast("Speech has been deleted", "success");
        navigate("/my_speeches");
      })
      .catch((error) => {
        showToast("Error while deleting speech", "error");
      });
  };

  return (
    <div className="view-container write_speech">
      <div className="view_header">
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div className="second_header">
          <div>
            <h2>{speechDetails?.title}</h2>
          </div>
          <div className="btn-container">
            <DeleteButton
              onConfirm={onDeleteClick}
              confirmationTitle="Delete Speech"
              confirmationMessage="Are you sure you want to delete this speech? All practice sessions related to this speech will be deleted"
            />
            <CustomButton
              text={"Practice history"}
              number={state?.numberOfSessions}
              handleClick={() => router.push("/my_practices")}
              disabled={state?.numberOfSessions === 0}
            />

            <CustomButton
              text={"Practice the Speech"}
              primary
              handleClick={() =>
                router.push(`/my_speeches/${speechId}/practice`)
              }
            />
          </div>
        </div>
      </div>
      <div className="my_speeches_body">
        <Stack spacing={3}>
          <div className="input_container">
            <label htmlFor="title">Speech title</label>

            <input
              type="text"
              name="speech"
              id="title"
              className="input"
              placeholder="type your speech title"
              value={speechDetails?.title}
              disabled
            />
          </div>
          <div className="input_container">
            <label htmlFor="text">Your speech</label>

            <textarea
              type="text"
              name="speech"
              id="text"
              className="input"
              placeholder="write your speech"
              value={speechDetails?.text}
              disabled
              rows={10}
            />
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default SpeechDetailsView;
