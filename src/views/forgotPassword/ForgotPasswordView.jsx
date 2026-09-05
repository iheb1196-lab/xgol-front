import { Button, Stack } from "@mui/material";
import "./forgotPassword.scss";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "../../routes/hooks";
import { ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import FormTextField from "../../components/inputs/FormTextField";
import { FormProvider, useForm } from "react-hook-form";

const ForgotPasswordView = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const methods = useForm();

  const { loading } = useSelector((state) => state.auth);
  

  const onSubmit = (data) => {
    console.log(data)
    dispatch(forgotPasswordAction(data))
      .unwrap()
      .then(() => {
        router.push("/check_email", { data: data });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="forget-view-container">
      <div className="box">
        <div className="header">
          <img src="/assets/icons/landing/forgotPassword1.svg" alt="" />
          <h2>Forgot password?</h2>
          <p>No worries, we’ll send you reset instructions.</p>
        </div>
        <FormProvider {...methods}>
          <form style={{ width: "100%" }} onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="body-forget">
              <Stack spacing={3}>
                <FormTextField
                  name="email"
                  placeholder={"Email adress"}
                  label={"Email"}
                  rules={{
                    required: "Please fill email field",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please provide a valid email address",
                    },
                  }}
                  type={"text"}
                />
              </Stack>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={loading}
                className="button"
              >
                Reset Password
              </LoadingButton>
              <Button
                className="button_back"
                startIcon={<ArrowLeft />}
                onClick={() => {
                  router.push("/login");
                }}
              >
                Back to login
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ForgotPasswordView;
