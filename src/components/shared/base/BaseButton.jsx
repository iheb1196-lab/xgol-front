import classNames from "classnames";
import { Button } from "primereact/button";

export const Rased = ({ className, onClick, ...props }) => {
  return (
    <Button
      className={classNames("text-white bg-primary-main", className)}
      onClick={onClick}
      {...props}
    />
  );
};

export const Outlined = ({ className, onClick, ...props }) => {
  return (
    <Button
      className={classNames(
        "text-black bg-transparent border-[1px] border-palette-outlineBorder",
        className
      )}
      onClick={onClick}
      {...props}
    />
  );
};

const BaseButton = {
  Rased,
  Outlined,
};

export default BaseButton;
