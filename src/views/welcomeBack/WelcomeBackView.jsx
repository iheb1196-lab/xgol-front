/* eslint-disable react-hooks/exhaustive-deps */
import { FormProvider, useForm } from "react-hook-form";
import FormTextField from "../../components/inputs/FormTextField";
import "./welcome.scss";
import CustomButton from "../../components/button/CustomButton";
import Iconify from "../../components/iconify/iconify";
import { useEffect, useState } from "react";
import { useRouter } from "../../routes/hooks";
import { getEmailFromToken, resetAdminAccess } from "../../features/auth/authSlice";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from "../../components/toasts/ToastProvider";
const WelcomeBackView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { token_id } = useParams();
  const methods = useForm();
  const router = useRouter(true);
  const { showToast } = useToast();

  useEffect(() => {
    dispatch(getEmailFromToken({ token: token_id }))
      .unwrap()
      .then((res) => {
        methods.reset({ email: res.email, password: "", confirm: "" });
      })
      .catch(() => {
        showToast("Failed to retrieve email", "error");
      });
  }, []);

  const onSubmit = (data) => {
    dispatch(resetAdminAccess({ token: token_id, password: data.password }))
      .unwrap()
      .then(() => router.push("/password_reset"))
      .catch((err) => showToast(err, "error"));
  };

  return (
    <div className="page-container">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="welcome-container">
            <img src="/assets/images/logo.svg" className="logo-img" alt="" />
            <div className="welcome-wrapper">
              <div className="welcome-title">Welcome back!</div>
              <div className="welcome-subtitle">
                To get started, please create a password to activate your account. This will ensure
                the security of your information.
              </div>
              <FormTextField
                name="email"
                placeholder={"Email"}
                type={"text"}
                disabled={true}
                endIcon={<Iconify icon={"fe:disabled"} sx={{ color: "#B8BED5" }} />}
              />
              <FormTextField
                name="password"
                label="Password"
                rules={{ required: "required field" }}
                type={showPassword ? "text" : "password"}
                endIcon={
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    sx={{ color: "#B8BED5" }}
                  />
                }
                onIconClick={() => setShowPassword(!showPassword)}
              />
              <FormTextField
                name="confirm"
                label="Confirm Password"
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === methods.watch("password") || "Passwords must match",
                }}
                type={showPassword ? "text" : "password"}
                endIcon={
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    sx={{ color: "#B8BED5" }}
                  />
                }
                onIconClick={() => setShowPassword(!showPassword)}
              />
              <CustomButton type="submit" label="Submit" height={"45px"} disabled={false} />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default WelcomeBackView;
