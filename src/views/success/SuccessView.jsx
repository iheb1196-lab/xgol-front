/* eslint-disable react-hooks/exhaustive-deps */
import "./successView.scss";
import { useEffect } from "react";
import ButtonLink from "../../components/buttonLink";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { activateAccountAction } from "../../features/auth/authSlice";
import { CircularProgress } from "@mui/material";

const SuccessView = ({ type }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);
  useEffect(() => {
    try {
      if (type === "account") {
        dispatch(activateAccountAction(params.token_id));
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="success-view-container">
      <div className="box_success">
        <div className="header">
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <>
              <img src="/assets/icons/landing/cross.svg" alt="" />
              <h2>{error}</h2>
              <ButtonLink path={"/signup"} text={"return to sign up"} primary />
            </>
          ) : (
            <>
              <img src="/assets/icons/landing/forgotPassword3.svg" alt="" />
              <h2>
                {type} {type === "account" ? "verified" : "reset"}
              </h2>
              <p>
                Your {type} has been successfully {type === "account" ? "verified" : "reset"}.{" "}
                <br />
                Click below to log in magically.
              </p>
              <ButtonLink path={"/login"} text={"Login"} primary />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessView;
