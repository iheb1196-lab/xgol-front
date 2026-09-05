import "./checkEmail.scss";
import { Button } from "@mui/material";
import { useRouter } from "../../routes/hooks";
import { ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { forgotPasswordAction } from "../../features/auth/authSlice";

const CheckEmailView = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { data } = location.state ? location.state : "";

  const handleClick = () => {
    if (!data) {
      return;
    }
    dispatch(forgotPasswordAction(data));
  };
  const router = useRouter();

  return (
    <div className="check-em-container">
      <div className="box">
        <div className="header">
          <img src="/assets/icons/landing/forgotPassword2.svg" alt="" />
          <h2>Check your email</h2>
          <p>
            A password reset link is sent to <br /> <b>{data.email}</b>
          </p>
        </div>
        <div className="body">
          <p>
            Didn’t receive the email?
            <span className="link" onClick={handleClick}>
              Click to resend
            </span>{" "}
          </p>
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

export default CheckEmailView;
