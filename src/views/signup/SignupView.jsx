import "./signup.scss";
import { useState } from "react";

// import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "../../routes/hooks";
import Iconify from "../../components/iconify/iconify";
import { Link } from "react-router-dom";
import { signupUser } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import FormTextField from "../../components/inputs/FormTextField";

// ----------------------------------------------------------------------

export default function SignupView() {
  const router = useRouter();
  const methods = useForm();

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = (data) => {
    const { confirmPassword, ...payload } = data;

    dispatch(signupUser(payload))
      .unwrap()
      .then(() => router.push("/verify_email", { data: payload }))
      .catch((err) => setError(err.data.message));
  };
  return (
    <div className="signup">
      <div className="signupCard">
        <img
          src="/assets/images/logo.svg"
          alt=""
          style={{ height: "35px", objectFit: "contain" }}
        />
        <div className="signup_header">
          <h2>Get Started Now!</h2>
          <p>Enter your credentials to access your account</p>
        </div>
        <FormProvider {...methods}>
          <form style={{ width: "100%" }} onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="signup_form">
              <Stack
                spacing={{ xs: 1, sm: 2, md: 3 }} // Set different spacing based on screen size
                marginBottom={{ xs: 1, sm: 2, md: 3 }}
              >
                <FormTextField
                  name="firstName"
                  placeholder={"First Name"}
                  label={"First Name"}
                  haveError={!!error}
                  rules={{
                    required: "Please fill firstname field",
                  }}
                  type={"text"}
                />
                <FormTextField
                  name="lastName"
                  placeholder={"Last Name"}
                  label={"Last Name"}
                  haveError={!!error}
                  rules={{
                    required: "Please fill lastname field",
                  }}
                  type={"text"}
                />
                <FormTextField
                  name="email"
                  placeholder={"Email adress"}
                  label={"Email"}
                  haveError={!!error}
                  rules={{
                    required: "Please fill email field",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please provide a valid email address",
                    },
                  }}
                  type={"text"}
                />

                <FormTextField
                  name="password"
                  label="Password"
                  haveError={!!error}
                  rules={{
                    required: "Please fill password field",
                    minLength: {
                      value: 10,
                      message: "Password should be at least 10 characters long",
                    },
                  }}
                  type={showPassword ? "text" : "password"}
                  endIcon={
                    <Iconify
                      icon={!showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                      sx={{ color: "#B8BED5" }}
                    />
                  }
                  onIconClick={() => setShowPassword(!showPassword)}
                />
                <FormTextField
                  name="confirmPassword"
                  label="Confirm Password"
                  rules={{
                    required: "Please confirm password",
                    validate: (value) =>
                      value === methods.watch("password") || "Passwords must match",
                  }}
                  type={showPassword ? "text" : "password"}
                  endIcon={
                    <Iconify
                      icon={!showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                      sx={{ color: "#B8BED5" }}
                    />
                  }
                  onIconClick={() => setShowPassword(!showPassword)}
                />
              </Stack>
              {error ? (
                <div
                  style={{
                    fontFamily: "Poppins",
                    color: "#F00D05",
                    fontSize: "14px",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                >
                  {error}
                </div>
              ) : null}

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={loading}
                className="signup__button"
              >
                Sign Up
              </LoadingButton>
            </div>
          </form>
        </FormProvider>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Already have an account?
          <Link to={`/login`}>
            {" "}
            <b>Login</b>
          </Link>
        </Typography>
      </div>
    </div>
  );
}
