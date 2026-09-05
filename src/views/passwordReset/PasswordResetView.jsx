import "./passwordReset.scss";
import { useRouter } from "../../routes/hooks";
import { LoadingButton } from "@mui/lab";

const PasswordResetView = () => {
  const router = useRouter(true);
  const handleClick = () => {
    router.push("/login");
  };

  return (
    <div className="pass-rest-container">
      <div className="box">
        <div className="header">
          <img src="/assets/icons/landing/forgotPassword3.svg" alt="icon" />
          <h2>Password reset</h2>
          <p>Your password has been successfully reset. Click below to log in magically.</p>
        </div>
        <div className="body_reset">
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            // loading={true}
            onClick={handleClick}
            className="button"
          >
            Login
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetView;
