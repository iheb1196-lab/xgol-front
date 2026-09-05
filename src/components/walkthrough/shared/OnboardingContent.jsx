import { Icon } from "@iconify/react";
import classNames from "classnames";
import BaseButton from "components/shared/base/BaseButton";
import { tailwindTheme } from "constants/theme.constant";
import _ from "lodash";

const OnboardingContent = ({
  onHideClick,
  isFirst,
  isLast,
  onNextClick,
  onGoBackClick,
  step,
  stepsCount,
  index,
}) => {
  return (
    <div className="w-full h-auto">
      <div className="w-full flex flex-row justify-end mb-4">
        <div
          className="w-auto h-auto flex flex-row items-center justify-start cursor-pointer"
          onClick={onHideClick}
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
      <div className="w-full h-auto flex flex-col items-enter justify-start mb-8">
        <img
          src={`/assets/icons/onboarding/${step.image}`}
          className="w-[70px] h-[70px] self-center mb-4"
          alt=""
        />
        <div className="w-full text-black font-md text-[24px] text-center font-poppins mb-4">
          {step.title}
        </div>
        <p className="text-center text-black font-md px-12 mb-4">{step.text}</p>
        <Indicators count={stepsCount} selected={index} />
      </div>

      <div className="w-full h-auto flex flex-row items-center justify-between">
        <div>
          {!isFirst && (
            <BaseButton.Outlined label="Previous" onClick={onGoBackClick} />
          )}
        </div>
        <BaseButton.Rased
          label={isLast ? "Start" : "Next"}
          onClick={onNextClick}
        />
      </div>
    </div>
  );
};

export default OnboardingContent;

export const Indicators = ({ count, selected }) => {
  return (
    <div className="w-full h-auto flex flex-row items-center justify-center">
      {_.range(count).map((__, index) => (
        <div
          className={classNames("w-2 h-2 rounded-full mr-[7px]", {
            "bg-primary-main": selected === index,
            "bg-gray-200": selected !== index,
          })}
        ></div>
      ))}
    </div>
  );
};
