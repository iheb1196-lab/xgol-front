import TextField from "@mui/material/TextField";
import { useFormContext, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { IconButton, InputAdornment } from "@mui/material";

const FormTextField = ({
  name,
  label,
  rules,
  placeholder,
  type,
  focusBorderColor,
  hoverBorderColor,
  endIcon,
  onIconClick,
  disabled,
  borderColor,
  haveError,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = haveError || !!errors[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          variant="outlined"
          disabled={disabled}
          error={hasError && !disabled} // Display error only if there is an error and input is not disabled
          placeholder={placeholder}
          type={type}
          helperText={!disabled && (errors[name]?.message || "")} // Display helper text only if there is an error message and input is not disabled
          InputProps={{
            endAdornment: endIcon && (
              <InputAdornment position="end">
                <IconButton
                  disabled={disabled} // Disable the IconButton when input is disabled
                  onClick={onIconClick}
                >
                  {endIcon}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiInputLabel-root.Mui-focused": {
              color: focusBorderColor,
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: hasError ? "#F00D05" : disabled ? "transparent" : borderColor, // Set border color to red when there is an error
              borderStyle: disabled ? "none" : "solid", // Set border style to none if disabled
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: disabled ? "transparent" : hoverBorderColor,
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: disabled ? "transparent" : focusBorderColor,
            },
            "& .MuiFormHelperText-root": {
              marginLeft: "0px",
              color: hasError ? "#F00D05" : undefined, // Color for helper text error
              fontSize: "14px",
              fontFamily: "Poppins",
            },
            borderRadius: "12px",
            backgroundColor: disabled ? "#EEF0F6" : "transparent",

            flex: 1,
          }}
          {...rest}
        />
      )}
    />
  );
};

FormTextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rules: PropTypes.object,
  rest: PropTypes.object,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  focusBorderColor: PropTypes.string,
  hoverBorderColor: PropTypes.string,
  endIcon: PropTypes.node,
  onIconClick: PropTypes.func,
  disabled: PropTypes.bool,
  borderColor: PropTypes.string,
};

FormTextField.defaultProps = {
  focusBorderColor: "#9F42E4",
  hoverBorderColor: "#E6C7FD",
  endIcon: null,
  onIconClick: null,
  disabled: false,
  borderColor: "#B8BED5",
};

export default FormTextField;
