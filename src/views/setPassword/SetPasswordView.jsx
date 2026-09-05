import { Button, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import "./forgotPassword.scss";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "../../routes/hooks";
import { ArrowLeft } from "lucide-react";
import Iconify from "../../components/iconify/iconify";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordAction } from "../../features/auth/authSlice";

const SetPasswordView = () => {
  const { token_id } = useParams();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await dispatch(resetPasswordAction({ token: token_id, password: formData.password }))
        .unwrap()
        .then(() => {
          router.push("/password_reset_success");
        })
        .catch((err) => console.log(err));
    } catch (error) {}
  };

  return (
    <div className="pass-view-container">
      <div className="box">
        <div className="header">
          <img src="/assets/icons/landing/forgotPassword1.svg" alt="" />
          <h2>Set new password</h2>
          <p>Your new password must be different from any previously used passwords.</p>
        </div>
        <div className="body">
          <Stack spacing={3}>
            <TextField
              color="secondary"
              name="password"
              label="Password"
              value={formData.email}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              color="secondary"
              name="confirmPassword"
              label="confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
            onClick={handleSubmit}
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
      </div>
    </div>
  );
};

export default SetPasswordView;
