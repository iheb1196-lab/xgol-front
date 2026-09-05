import _ from "lodash";
import classNames from "classnames";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { tailwindTheme } from "constants/theme.constant";
import BaseButton from "components/shared/base/BaseButton";
import { useSelector } from "react-redux";
import useLocalStorage from "hooks/useLocalStorage";
import { Indicators } from "./shared/OnboardingContent";

export default () => {
  const { user } = useSelector((state) => state.auth.user);

  const [viewed, setViewed] = useLocalStorage([
    "hasSeenWalkthrough",
    user?.hasSeenWalkthrough === true,
  ]);

  const [visible, setVisible] = useState(!viewed);
  const [stepIndex, setStepIndex] = useState(0);

  const isLast = () => stepIndex === steps?.length - 1;
  const isFirst = () => stepIndex === 0;

  const goNext = () => setStepIndex((prev) => ++prev);
  const goBack = () => setStepIndex((prev) => --prev);

  const onNextClick = () => {
    if (isLast()) {
      hide();
    } else {
      goNext();
    }
  };

  const hide = () => {
    setVisible(false);
    setViewed(true);
  };

  return (
    <Dialog
      visible={visible}
      className="md:w-[50vw] md:h-[60vh] max-sm:w-[90vw] max-sm:h-[80vh] rounded-3xl"
      closable={false}
      header={
        <div className="w-full flex flex-row justify-end">
          <div
            className="w-auto h-auto flex flex-row items-center justify-start cursor-pointer"
            onClick={hide}
          >
            <div className="text-[16px] text-primary-main leading-[24px] mr-2">
              Skip
            </div>
            <Icon
              icon="hugeicons:arrow-right-02"
              color={tailwindTheme.colors.primary.main}
              fontSize={24}
            ></Icon>
          </div>
        </div>
      }
      footer={
        <div className="w-full h-auto flex flex-row items-center justify-between">
          <div>
            {!isFirst() && (
              <BaseButton.Outlined label="Previous" onClick={goBack} />
            )}
          </div>
          <BaseButton.Rased
            label={isLast() ? "Start" : "Next"}
            onClick={onNextClick}
          />
        </div>
      }
    >
      <div className="w-full h-auto flex flex-col items-enter justify-start">
        <img
          src={`/assets/icons/onboarding/${steps[stepIndex].image}`}
          className="w-[70px] h-[70px] self-center mb-4"
        />
        <div className="w-full text-black font-md text-[24px] text-center font-poppins mb-4">
          {steps[stepIndex].title}
        </div>
        <p className="text-center text-black font-md px-12 mb-4">
          {steps[stepIndex].text}
        </p>
        <Indicators count={steps?.length} selected={stepIndex} />
      </div>
    </Dialog>
  );
};

const steps = [
  // {
  //   image: "rocket.png",
  //   title: "Welcome to XGOL!",
  //   text: "Your first challenge is to complete the fundamentals of public speaking modules. This module comprises four units designed to help you master the basics of public speaking.",
  // },
  // {
  //   image: "rocket.png",
  //   title: "Fundamentals of Public Speaking",
  //   text: "This module will enhance your ability to deliver messages effectively making every speech step towards becoming a more compelling speaker.",
  // },
  // {
  //   image: "medal.png",
  //   title: "Write Your own Speech",
  //   text: "Once you complete the fundamentals of public speaking, you unlock the feature to write and fine-tune your own speech.",
  // },
  {
    image: "mic.png",
    title: "Write Your own Speech",
    text: "Write your speech and fine-tune it with AI",
  },
  {
    image: "sheet.png",
    title: "Rehearse your speech",
    text: "Record yourself giving your speech and submit it to receive instant feedback on your performance.",
  },

  {
    image: "target.png",
    title: "Get in-depth analysis on request",
    text: "Experts will provide you with personalized assessment and targeted coaching to improve your public speaking skills",
  },
];
