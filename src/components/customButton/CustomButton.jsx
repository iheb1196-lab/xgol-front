import { CircularProgress } from "@mui/material";
import "./customButton.scss";
import classNames from "classnames";

const CustomButton = ({
  text,
  primary,
  handleClick,
  width,
  icon,
  disabled,
  number,
  bg,
  loading,
  className,
}) => {
  const styles = primary
    ? {
        backgroundColor: bg ? "#F00D05" : "#af49fa",
        color: "white",
        borderColor: bg ? "#F00D05" : "#af49fa",
        width: `${width}px`,
      }
    : null;
  const onClick = () => {
    if (disabled) {
      return;
    }
    handleClick();
  };
  return (
    <div
      className={classNames("custom_button", className, {
        disabled: disabled,
      })}
      style={styles}
      onClick={onClick}
    >
      {text}
      {icon}
      {loading && <CircularProgress size={20} color="inherit" />}
      {number !== undefined && (
        <span className={`${disabled ? "disabled_number" : "number"}`}>
          {number}
        </span>
      )}
    </div>
  );
};

export default CustomButton;
