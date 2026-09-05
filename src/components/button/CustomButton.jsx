import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";

const CustomButton = ({
  type,
  color,
  hoverColor,
  clickColor,
  bgColor,
  label,
  onClick,
  height,
  disabled,
  ...rest
}) => {
  return (
    <Button
      type={type}
      variant="contained"
      disabled={disabled}
      style={{
        color: color,
        height: height,
        backgroundColor: bgColor,
        "&:hover": {
          backgroundColor: hoverColor,
        },
        "&:active": {
          backgroundColor: clickColor,
        },
        "& .MuiButton-label": {
          color: color,
        },
        opacity: disabled ? 0.5 : 1, // Reduce opacity when disabled
        cursor: disabled ? "not-allowed" : "pointer", // Change cursor when disabled
        pointerEvents: "visible",
      }}
      onClick={onClick}
      {...rest}
    >
      {label}
    </Button>
  );
};

CustomButton.propTypes = {
  type: PropTypes.oneOf(["submit", "button"]), // Button type: 'submit' or 'button'
  color: PropTypes.string, // Text color
  hoverColor: PropTypes.string, // Background color on hover
  clickColor: PropTypes.string, // Background color on click
  bgColor: PropTypes.string, // Background color of the button
  label: PropTypes.string.isRequired, // Button label
  onClick: PropTypes.func, // onClick event handler
  disabled: PropTypes.bool, // Whether the button is disabled
  height: PropTypes.string,
};

CustomButton.defaultProps = {
  type: "button", // Default button type is 'button'
  color: "#FFFFFF", // Default text color
  hoverColor: "#E6C7FD", // Default hover background color
  clickColor: "#999", // Default click background color
  bgColor: "#9F42E4", // Default background color of the button
  disabled: false, // Default disabled state is false
  height: "fit-content",
};

export default CustomButton;
