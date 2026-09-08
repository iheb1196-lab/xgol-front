/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import "./writeSpeech.scss";
import RouterLink from "../../../routes/components/router-link";
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CustomButton from "../../../components/customButton";
import ImproveScriptModal from "../../../components/modal/ImproveScriptModal";
import { addSpeech } from "../../../features/speech/speechSlice";
import { improveScriptStream } from "../../../features/practice/practiceService";
import { useDispatch } from "react-redux";
import { useRouter } from "../../../routes/hooks";
import { Dropdown } from "primereact/dropdown";
import { useToast } from "../../../components/toasts/ToastProvider";
import _ from "lodash";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { getUserCredits } from "features/dashboard/dashboardSlice";

const EXAMPLE_SPEECH = {
  title: "Small Actions, Meaningful Change",
  text: `Good morning everyone.

We often wait for the perfect moment to make a change. We tell ourselves we need more time, more confidence, or a better plan. But meaningful progress rarely begins with a dramatic decision. It begins with one small action.

Think about a goal you care about. What could you do today, in just ten minutes, to move closer to it? You could make one call, write one paragraph, take one walk, or ask one honest question.

Small actions may feel insignificant, but repeated actions become habits, and habits shape our future. We do not need to transform everything overnight. We only need to begin.

So today, choose one useful step and take it. Tomorrow, take another. Your next chapter does not start someday. It starts now.`,
};

const WriteSpeech = () => {
  const [creditsLoading, setCreditsLoading] = useState({
    submit: false,
    improve: false,
  });
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();

  const dispatch = useDispatch();

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
      Write your speech
    </Typography>,
  ];
  const [open, setOpen] = useState(false);
  const [improved, setImproved] = useState(false);
  const [selectedSpeech, setSelectedSpeech] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    improvedText: "",
  });

  const [originalSpeech, SetOriginalSpeech] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const submitSpeech = async (payload) => {
    try {
      setLoading(true);
      await dispatch(addSpeech(payload))
        .unwrap()
        .then(async () => {
          router.push(`/my_speeches`);
        })
        .catch((err) => {
          showToast(err, "error");
          setSelectedSpeech(null);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmSubmitSpeech = (payload, credits) => {
    confirmDialog({
      message: `The create speech costs 2 credits, your credit balance is ${credits}. If
      you confirm, your remaining balance will be ${credits - 2}. Would you like
      to proceed?`,
      header: "Create Speech",
      defaultFocus: "accept",
      accept: () => submitSpeech(payload),
      reject,
    });
  };

  const confirmImproveSpeech = (credits) => {
    confirmDialog({
      message: `The improve speech costs 2 credits, your credit balance is ${credits}. If
      you confirm, your remaining balance will be ${credits - 2}. Would you like
      to proceed?`,
      header: "Improve Speech",
      defaultFocus: "accept",
      accept: handleOpen,
      reject,
    });
  };

  const reject = () => {};

  const applyExampleSpeech = () => {
    setFormData({
      title: EXAMPLE_SPEECH.title,
      text: EXAMPLE_SPEECH.text,
      improvedText: "",
    });
    SetOriginalSpeech(undefined);
    setImproved(false);
    setSelectedSpeech(null);
  };

  const useExampleSpeech = () => {
    if (formData.title.trim() || formData.text.trim()) {
      confirmDialog({
        message:
          "Using the example will replace the title and speech currently in the form. Continue?",
        header: "Use Example Speech",
        defaultFocus: "reject",
        accept: applyExampleSpeech,
        reject,
      });
      return;
    }
    applyExampleSpeech();
  };

  const onSubmitSpeech = async (payload) => {
    try {
      setCreditsLoading((current) => ({ ...current, submit: true }));
      const data = await dispatch(getUserCredits()).unwrap();
      if (data?.credits - 2 >= 0) {
        confirmSubmitSpeech(payload, data?.credits);
      } else {
        showToast(`Not enough credits`, "error");
      }
    } catch (error) {
      showToast(`Couldn't get your current credits`, "error");
    } finally {
      setCreditsLoading((current) => ({ ...current, submit: false }));
    }
  };

  const handleSubmitAfterImprove = async (e) => {
    setSelectedSpeech(e.target.value);
    if (e.target.value.code === "original") {
      onSubmitSpeech({ title: formData.title, text: formData.text });
    } else if (e.target.value.code === "improved") {
      onSubmitSpeech({ title: formData.title, text: formData.improvedText });
    }
  };

  const onImproveClick = async () => {
    try {
      setCreditsLoading((current) => ({ ...current, improve: true }));
      const data = await dispatch(getUserCredits()).unwrap();
      if (data?.credits - 2 >= 0) {
        confirmImproveSpeech(data?.credits);
      } else {
        showToast(`Not enough credits`, "error");
      }
    } catch (error) {
      showToast(`Couldn't get your current credits`, "error");
    } finally {
      setCreditsLoading((current) => ({ ...current, improve: false }));
    }
  };

  /** Streams the improved script into the right-hand panel as it is written. */
  const runImprovement = async ({ objective, duration }) => {
    SetOriginalSpeech(formData.text);
    setImproved(true);
    setImproving(true);
    setFormData((prev) => ({ ...prev, improvedText: "" }));
    try {
      await improveScriptStream(
        { text: formData.text, objective, duration },
        {
          onDelta: (delta) =>
            setFormData((prev) => ({
              ...prev,
              improvedText: prev.improvedText + delta,
            })),
        }
      );
      showToast("Speech has been improved", "success");
    } catch (error) {
      showToast(error.message || "Speech improvement failed", "error");
      setImproved(false);
    } finally {
      setImproving(false);
    }
  };

  const disabled = _.isEmpty(formData.title) || _.isEmpty(formData.text);
  const canImprove =
    _.trim(originalSpeech) !== _.trim(formData.text) && !improving;

  return (
    <div className="view-container write_speech relative">
      {loading && (
        <div className="w-full h-full flex flex-col items-center justify-center absolute top-0 left-0 z-20">
          <CircularProgress size={40} color="primary" />
        </div>
      )}
      <div className="view_header">
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div className="second_header">
          <div>
            <h2>Write your speech</h2>
            <p>Craft, Refine, and Perfect Your Speech.</p>
          </div>
          <div className="btn-container">
            <CustomButton
              text={"Use example speech"}
              disabled={loading || improving}
              handleClick={useExampleSpeech}
            />
            <CustomButton
              text={"Improve Speech"}
              style={{ position: "relative" }}
              icon={<img src="/assets/icons/speech/improve.svg" alt="" />}
              disabled={disabled || !canImprove}
              handleClick={onImproveClick}
              className="_speechImproveButton"
              loading={creditsLoading?.improve || improving}
            />
            <ImproveScriptModal
              open={open}
              handleClose={handleClose}
              onImprove={runImprovement}
            />

            {!improved ? (
              <div>
                <CustomButton
                  text={"Submit Speech"}
                  primary
                  disabled={disabled || loading}
                  handleClick={() =>
                    onSubmitSpeech({
                      title: formData.title,
                      text: formData.text,
                    })
                  }
                  className="_speechSubmitButton"
                  loading={creditsLoading.submit}
                />
              </div>
            ) : (
              <Dropdown
                name="select"
                value={selectedSpeech}
                onChange={handleSubmitAfterImprove}
                options={[
                  { name: "submit original speech", code: "original" },
                  { name: "submit improved speech", code: "improved" },
                ]}
                optionLabel="name"
                placeholder="Which Speech to Submit"
                className="w-auto"
                disabled={loading || improving}
              />
            )}
          </div>
        </div>
      </div>
      <div className="my_speeches_body">
        <Stack spacing={3}>
          <TextField
            name="title"
            label="Speech title"
            color="secondary"
            placeholder="Type your speech title"
            value={formData.title}
            onChange={handleChange}
            className="_speechTitleField"
            inputProps={{
              maxLength: 40,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <div className="w-8 h-8 flex flex-col items-center justify-center">
                    <span className="text-sm text-gray-500">
                      {Math.max(0, 40 - formData?.title?.length)}
                    </span>
                  </div>
                </InputAdornment>
              ),
            }}
          />
          <Box display={"flex"} gap={2}>
            <TextField
              name="text"
              label="Original Speech"
              color="secondary"
              multiline
              rows={10}
              sx={{ width: improved ? "50%" : "100%" }}
              placeholder="Type your speech"
              value={formData.text}
              onChange={handleChange}
              className="_speechDescriptionField"
              inputProps={{
                maxLength: 2500,
              }}
              InputProps={{
                endAdornment: (
                  <div className="w-[40px] h-full relative">
                    <div className="w-8 h-8 absolute bottom-0 right-0 flex flex-col items-center justify-center">
                      <span className="text-sm text-gray-500">
                        {Math.max(0, 2500 - formData?.text?.length)}
                      </span>
                    </div>
                  </div>
                ),
              }}
            />
            {improved && (
              <TextField
                name="improvedText"
                label={
                  improving ? "Improved Speech — AI is writing..." : "Improved Speech"
                }
                color="secondary"
                multiline
                sx={{ width: "50%" }}
                rows={10}
                placeholder="The improved speech will appear here"
                value={formData.improvedText}
                onChange={handleChange}
                disabled={improving}
              />
            )}
          </Box>
        </Stack>
      </div>
      <ConfirmDialog style={{ width: "min(480px, calc(100vw - 32px))" }} />
    </div>
  );
};

export default WriteSpeech;
