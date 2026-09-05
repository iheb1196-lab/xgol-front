import { useDispatch } from "react-redux";
import ButtonLink from "../../components/buttonLink";
import "./verifyEmail.scss";
import { useLocation } from "react-router-dom";
import { signupUser } from "../../features/auth/authSlice";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { data } = location.state ? location.state : "";
  const handleClick = () => {
    if (!data) {
      return;
    }
    dispatch(signupUser(data));
  };
  return (
    <div className="verify-email-container">
      <div className="verify-email">
        <h2>Please verify Your Email</h2>
        <p>
          You’re almost there! We sent an email to <br />
          <b>{data?.email}</b>
        </p>
        <p>
          Just click on the link in that email to complete you signup. I you
          don’t see it, you may need to check your spam folder.
        </p>
        <p>Still can’t find the email? No problem.</p>

        <ButtonLink
          text="Resend Verification Email"
          primary
          handleClick={handleClick}
        />
      </div>
    </div>
  );
};

export default VerifyEmail;
