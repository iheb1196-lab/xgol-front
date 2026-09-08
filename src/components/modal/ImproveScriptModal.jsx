import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./modal.scss";
import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import CustomButton from "../customButton/CustomButton";
import ObjectivePicker from "../practice/ObjectivePicker";
import { OBJECTIVES, buildObjective } from "../../constants/practice.constant";

/**
 * Collects the improvement objective, then hands the parameters back to the
 * parent which runs the streaming improvement.
 */
const ImproveScriptModal = ({ open, handleClose, onImprove }) => {
  const [objectiveCode, setObjectiveCode] = useState(null);
  const [audience, setAudience] = useState("");
  const [duration, setDuration] = useState("");

  const objectiveLabel = OBJECTIVES.find(
    (o) => o.code === objectiveCode
  )?.label;

  const isSubmitDisabled = !objectiveCode && !audience.trim();

  const handleSubmit = () => {
    handleClose();
    onImprove({
      objective: buildObjective(objectiveLabel, audience),
      duration: duration.trim(),
    });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="improve-speech-title"
        className="custom-modal"
      >
        <Box className="modal">
          <button
            type="button"
            className="modal_close"
            aria-label="Close"
            onClick={handleClose}
          >
            &#10005;
          </button>
          <div className="modal_header mb-4">
            <img src="/assets/icons/speech/improve-modal.svg" alt="" />
            <h3 id="improve-speech-title">Improve Speech</h3>
          </div>
          <p className="text-sm text-gray-500 mt-0 mb-6">
            What should your speech become? The AI rewrites it live, right next
            to your original.
          </p>
          <Stack spacing={3}>
            <ObjectivePicker
              selected={objectiveCode}
              onSelect={setObjectiveCode}
              audience={audience}
              onAudienceChange={setAudience}
            />
            <TextField
              fullWidth
              type="number"
              name="duration"
              label="Target duration (optional)"
              color="secondary"
              placeholder="Duration in minutes, e.g. 2"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              inputProps={{ min: 0.25, max: 30, step: 0.25 }}
              className="_improveSpeechDurationField"
            />
            <CustomButton
              text={"Improve your speech"}
              primary
              disabled={isSubmitDisabled}
              handleClick={handleSubmit}
              className="_improveSpeechConfirmSubmitButton"
            />
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default ImproveScriptModal;
