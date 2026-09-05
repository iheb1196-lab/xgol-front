import "./login.scss";
import { useState } from "react";

// import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "../../routes/hooks";
import Iconify from "../../components/iconify/iconify";
import { Link } from "react-router-dom";
import RouterLink from "../../routes/components/router-link";
import { loginUser } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import FormTextField from "../../components/inputs/FormTextField";

// ----------------------------------------------------------------------

export default function LoginView() {
  const router = useRouter();
  const methods = useForm();

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const loginErrorMessage =
    error?.data?.message ||
    (error?.status === 401
      ? "Incorrect password"
      : error?.status === 404
      ? "Please check your credentials and try again"
      : "Unable to contact the server. Please try again.");

  const onSubmit = (data) => {
    dispatch(loginUser(data))
      .unwrap()
      .then(() => {
        router.push("/dashboard");
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <div className="login">
      <div className="loginCard">
        <img src="/assets/images/logo.svg" alt="" />
        <div className="login_header">
          <h2>Welcome back!</h2>
          <p>Enter your email and password to access your account</p>
        </div>
        <FormProvider {...methods}>
          <form style={{ width: "100%" }} onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="login_form">
              <Stack spacing={3}>
                <FormTextField
                  name="email"
                  placeholder={"Email"}
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
                  rules={{ required: "Please fill password field" }}
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
                  }}
                >
                  {loginErrorMessage}
                </div>
              ) : null}

              <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ my: 1 }}>
                <RouterLink href="/forgot_password">Forgot password?</RouterLink>
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={loading}
                // onClick={handleSubmit}
                className="login__button"
              >
                Login
              </LoadingButton>
            </div>
          </form>
        </FormProvider>

        <Typography variant="body2" sx={{ my: 2 }}>
          don't have an account yet?
          <Link to={"/signup"}>
            {" "}
            <b>Sign up</b>
          </Link>
        </Typography>
      </div>
    </div>
  );
}
