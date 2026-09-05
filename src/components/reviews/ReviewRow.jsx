import { Icon } from "@iconify/react";
import classNames from "classnames";
import { tailwindColors, tailwindTheme } from "constants/theme.constant";
import { Dialog } from "primereact/dialog";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";
import ReactStars from "react-stars";

export default ({ rating: initRating, className }) => {
  const [rating, setRating] = useState(initRating);

  const [commentsDialogVisible, setCommentsDialogVisible] = useState(false);

  const ref = useRef();

  const setOverlayVisiblity = (value) => (e) => {
    if (value) {
      ref?.current?.show(e);
    } else {
      ref?.current.hide(e);
    }
  };

  const onRate = (value) => {
    setRating(value);
    ref?.current.hide();
  };

  const onCommentsClick = () => {};

  return (
    <div className={classNames(className)}>
      <div className="w-full mb-4">
        <ReactStars
          count={5}
          onChange={onRate}
          size={30}
          color2={tailwindTheme.colors.primary.main}
          className="-mt-2"
          value={rating}
        />
      </div>
      <div className="w-full h-auto flex flex-row items-center justify-start">
        <div
          className="flex flex-row items-center justify-center cursor-pointer mr-8"
          onClick={setOverlayVisiblity(true)}
        >
          <div className="text-gray-500 text-sm mr-2">
            {rating && <> {rating}</>}
          </div>
          {rating > 0 ? (
            <Icon
              icon="tabler:star-filled"
              fontSize={24}
              color={tailwindTheme.colors.primary.main}
            ></Icon>
          ) : (
            <Icon
              icon="hugeicons:star"
              fontSize={24}
              color={tailwindColors.gray[500]}
            ></Icon>
          )}
        </div>
        <div
          className="flex flex-row items-center justify-center cursor-pointer"
          onClick={() => setCommentsDialogVisible(true)}
        >
          <div className="text-gray-500 text-sm mr-2">
            {comments?.length > 0 && <> {comments?.length}</>}
          </div>
          <Icon
            icon="hugeicons:comment-01"
            fontSize={24}
            color={tailwindColors.gray[500]}
          ></Icon>
        </div>
      </div>
      <OverlayPanel ref={ref}>
        <ReactStars
          count={5}
          onChange={onRate}
          size={24}
          color2={tailwindTheme.colors.primary.main}
          className="-mt-2"
          value={rating}
        />
      </OverlayPanel>
      <Dialog
        header="Discussion"
        visible={commentsDialogVisible}
        position="right"
        style={{ width: "400px", height: "90vh" }}
        onHide={() => setCommentsDialogVisible(false)}
        footer={<></>}
        draggable={false}
        resizable={false}
      >
        {comments.map((it, index) => (
          <Comment content={it.content} key={index} />
        ))}
      </Dialog>
    </div>
  );
};

const Comment = ({ content, user }) => {
  return (
    <div className="w-full flex flex-row items-start justfify-start mb-2">
      <img
        src="/assets/images/avatars/avatar_10.jpg"
        className="w-[40px] h-[40px] rounded-full mr-2"
        alt=""
      />
      <div className="text-sm text-black bg-gray-100 rounded-lg px-2 py-2">
        {content}
      </div>
    </div>
  );
};

const comments = [
  {
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.`,
  },
  {
    content: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.`,
  },
  {
    content: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.`,
  },
  {
    content: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.`,
  },
];
