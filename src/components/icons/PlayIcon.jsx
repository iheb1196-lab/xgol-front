import { Icon } from "@iconify/react";
import classNames from "classnames";

export default ({ className, onClick, ...props }) => {
  return (
    <div
      className={classNames(
        "w-auto h-auto p-4 rounded-full bg-gray-500 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <Icon icon="hugeicons:play" color="white" fontSize={26} {...props}></Icon>
    </div>
  );
};
