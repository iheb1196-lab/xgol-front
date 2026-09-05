import classNames from "classnames";
import BaseButton from "components/shared/base/BaseButton";
import { submitUserReviewService } from "features/video/videoService";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useRef, useState } from "react";
import ReactStars from "react-stars";

export default ({
  className,
  videoDetails,
  onChange: onInputChange,
  showSubmitButton = true,
  showFeedbackText = true,
  feedbackTextAreaClassName,
  feedbackTextClassName,
}) => {
  const [loading, setLoading] = useState(false);

  const [edition, setEdition] = useState(true);
  const [data, setData] = useState({
    rating: 0,
    feedback: "",
  });

  useEffect(() => {
    const coachEvaluationVideo = videoDetails?.coachEvaluationVideos[0];
    if (
      coachEvaluationVideo?.ratingByUser &&
      coachEvaluationVideo?.feedbackByUser
    ) {
      setEdition(false);
      setData({
        rating: coachEvaluationVideo?.ratingByUser,
        feedback: coachEvaluationVideo?.feedbackByUser,
      });
    } else {
      setEdition(true);
    }
  }, [videoDetails]);

  useEffect(() => {
    onInputChange?.(data);
  }, [data]);

  const onChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const responseData = await submitUserReviewService(videoDetails._id, {
        coachEvalVideoId: videoDetails?.coachEvaluationVideos[0]?._id,
        ratingByUser: data?.rating,
        feedback: data?.feedback,
      });
      const coachVideo = responseData?.video.coachEvaluationVideos[0];
      setData({
        rating: coachVideo?.ratingByUser,
        feedback: coachVideo?.feedbackByUser,
      });
      setEdition(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={classNames(
        "w-auto flex flex-col items-start justify-start",
        className
      )}
    >
      {edition ? (
        <>
          <EditableStars
            count={5}
            onChange={(value) => onChange("rating", value)}
            size={20}
            color2="yellow"
            className="-mt-2 mb-2"
            value={data.rating}
          />
          {showFeedbackText && (
            <InputTextarea
              value={data?.feedback}
              onChange={(e) => onChange("feedback", e.target.value)}
              rows={5}
              autoResize={false}
              placeholder="submit your feedback"
              className={classNames(
                "grow text-black text-sm rounded-lg border-[1px] border-primary-main shadow-none px-2 py-2 mb-2",
                feedbackTextAreaClassName
              )}
            />
          )}
          <div className="w-full flex flex-row justify-center">
            {showSubmitButton && (
              <BaseButton.Rased
                label="Submit feedback"
                disabled={!data?.rating || !data?.feedback?.length}
                onClick={onSubmit}
                loading={loading}
                className="w-auto bg-primary-main rounded-full text-sm cursor-pointer px-6 py-1"
              />
            )}
          </div>
        </>
      ) : (
        <>
          <ViewStars
            count={5}
            size={20}
            color2="yellow"
            className="-mt-2 mb-1"
            value={data.rating}
          />
          <div
            className={classNames(
              "w-full h-[200px] text-sm text-black px-2 pb-2 text-wrap overflow-auto",
              feedbackTextClassName
            )}
          >
            {data?.feedback}
          </div>
        </>
      )}
    </div>
  );
};

const init = {
  rating: 4,
  feedback: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.`,
};

const EditableStars = (props) => (
  <ReactStars {...props} edit={true} half={false} />
);
const ViewStars = (props) => (
  <ReactStars {...props} edit={false} half={false} />
);
