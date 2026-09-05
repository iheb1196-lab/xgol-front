import { tailwindTheme } from "constants/theme.constant";
import useLocalStorage from "hooks/useLocalStorage";
import { useEffect, useState } from "react";
import Joyride from "react-joyride";
import { useSelector } from "react-redux";
import { subscribe, unsubscribe } from "utils/event.utils";
import OnboardingContent from "./shared/OnboardingContent";

export default () => {
  const user = useSelector((state) => state.auth.user);

  const [initRun, setInitRun] = useLocalStorage([
    "showWalkthrough",
    user?.isFirstLogin ?? false,
  ]);

  const [isNextDisplayed, setIsNextDisplayed] = useState(true);

  const [run, setRun] = useState(initRun);
  const [steps, setSteps] = useState([]);
  const [controllers, setControllers] = useState();

  useEffect(() => {
    subscribe("configWalkthrough", (config) => {
      if (config?.hideNextButton) {
        setIsNextDisplayed(false);
      } else if (config?.close) {
        controllers?.close();
      } else if (config?.go) {
        controllers?.open();
        controllers?.go(config?.go);
      }
    });
    return () => {
      unsubscribe("configWalkthrough");
    };
  }, []);

  useEffect(() => {
    if (controllers && steps?.length === 0) {
      setSteps(
        stepsBuilder(stepsConfig, {
          onHideClick: () => {
            setRun(false);
            controllers?.reset();
          },
          onNextClick: controllers?.next,
          onBackClick: controllers?.prev,
          onSkipClick: controllers?.skip,
        })
      );
    }
  }, [controllers]);

  return (
    <Joyride
      steps={steps}
      getHelpers={setControllers}
      continuous
      run={run}
      spotlightClicks
      disableCloseOnEsc
      hideCloseButton
      styles={{
        tooltipContent: {
          padding: 0,
        },
        buttonNext: {
          ...nextButtonStyles,
          display: !isNextDisplayed ? "none" : "",
        },
      }}
    />
  );
};

const nextButtonStyles = {
  backgroundColor: tailwindTheme.colors.primary.main,
  color: "black",
  borderRadius: "20px",
  padding: "10px 30px",
  borderWidth: 0,
  outline: "none",
};

const stepsConfig = [
  {
    target: "._sidebarDashboardButton",
    placement: "right",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "rocket.png",
          title: "Welcome to XGOL!",
          text: "Here you can discover your statistics like time you spent practicing, speeches you have completed and practice sessions you have recorded, you can also upgrade to corporate",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._timeSpentPracticingBox",
    placement: "right",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "target.png",
          title: "Time Spent",
          text: "Here you find the time you spent practicing",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._speechesCompletedBox",
    placement: "right",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "mic.png",
          title: "Speech Completed",
          text: "Here you find the number of speeches completed",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._videosRecordedBox",
    placement: "left",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "mic.png",
          title: "Practice Sessions",
          text: "Here you find the number of practice sessions you recorded",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._upgradeToCorporateBox",
    placement: "bottom",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "target.png",
          title: "Upgrade To Corporate!",
          text: "Here you can upgrate your account to corporate",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._sidebarSpeechButton",
    placement: "right",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "mic.png",
          title: "Welcome to XGOL!",
          text: "Here you can created and track your speeches easily.",
        }}
        {...props}
      />
    ),
  },

  {
    target: "._sidebarVideoButton",
    placement: "right",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "mic.png",
          title: "Welcome to XGOL!",
          text: "Here you can review your practice recordings and the AI coach feedback",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._speechCreateButton",
    placement: "left",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "mic.png",
          title: "Welcome to XGOL!",
          text: "Click on create speech to create a speech",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._speechTitleField",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "mic.png",
          title: "Welcome to XGOL!",
          text: "Write a title for your speech",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._speechDescriptionField",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "sheet.png",
          title: "Welcome to XGOL!",
          text: "Now write what your speech will be about",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._speechImproveButton",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "rocket.png",
          title: "Welcome to XGOL!",
          text: "This is were the magic happens, click on 'improve speech' to optimize your speech with our cutting-edge AI",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._improveSpeechDurationField",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "rocket.png",
          title: "Welcome to XGOL!",
          text: "Set how much time your speech would take",
        }}
        {...props}
      />
    ),
  },
  {
    target: "._improveSpeechConfirmSubmitButton",
    content: ({ onHideClick, ...props }) => (
      <OnboardingContent
        onHideClick={onHideClick}
        step={{
          image: "rocket.png",
          title: "Welcome to XGOL!",
          text: "Pick an objective for your speech and let the AI rewrite it live",
        }}
        {...props}
      />
    ),
  },
];

const stepsBuilder = (config, handlers) => {
  return config?.map((stepConfig, index) => ({
    ...stepConfig,
    disableBeacon: true,
    hideFooter: true,
    content: (
      <stepConfig.content
        onHideClick={handlers?.onHideClick}
        onNextClick={handlers?.onNextClick}
        onGoBackClick={handlers?.onBackClick}
        index={index}
        stepsCount={config?.length}
        isFirst={index === 0}
        isLast={index === config?.length - 1}
      />
    ),
  }));
};
