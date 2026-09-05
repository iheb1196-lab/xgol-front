import classNames from "classnames";
import FeedbackReview from "./FeedbackReview";

export default ({ user, videoDetails, className, feedbackReviewProps }) => {
  return (
    <div className={classNames("w-full", className)}>
      <div className="w-full flex flex-row items-center justify-start mb-4">
        <img
          src="/assets/images/avatars/avatar_10.jpg"
          className="w-[40px] h-[40px] rounded-full mr-2"
          alt=""
        />
        <span className="text-md">{user?.userName}</span>
      </div>
      <FeedbackReview videoDetails={videoDetails} {...feedbackReviewProps} />
    </div>
  );
};
