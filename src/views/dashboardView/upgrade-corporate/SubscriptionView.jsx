/* eslint-disable react-hooks/exhaustive-deps */
import {
  Breadcrumbs,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import "./subscription.scss";
import RouterLink from "../../../routes/components/router-link";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getActiveLicense } from "../../../features/dashboard/dashboardSlice";
import { useEffect } from "react";
import dayjs from "dayjs";
import Loader from "../../../components/Loader";
const SubscriptionView = () => {
  const dispatch = useDispatch();
  const { licenceResponse, licenseLoading } = useSelector(
    (state) => state.dashboard
  );

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getActiveLicense());
  }, []);

  const currentLicence = licenceResponse?.userLicense;
  // Use licenceResponse to dynamically set cardsData
  const totalCredits = currentLicence?.license?.credits ?? 0;
  const usedCredits = Math.min(
    totalCredits,
    Math.max(0, totalCredits - (currentLicence?.credits ?? 0))
  );
  const cardsData = [
    {
      id: 0,
      maxValue: totalCredits,
      progress: usedCredits,
      imgSrc: "/assets/icons/dashboard/speech.svg",
      title: "Credits",
      text: (
        <div className="card-info-text">
          The number of <strong>credits</strong> consumed in your license:
        </div>
      ),
    },
    /*  {
      id: 1,
      maxValue: 10,
      progress: 4,
      imgSrc: "/assets/icons/dashboard/videos.svg",
      title: "Videos",
      text: (
        <div className="card-info-text">
          The number of speeches you are allowed to <strong>Record</strong>
        </div>
      ),
    },
    {
      id: 2,
      maxValue: 10,
      progress: 2,
      imgSrc: "/assets/icons/dashboard/analysis.svg",
      title: "Requests",
      text: (
        <div className="card-info-text">
          The number of <strong>Expert Review</strong> requests you can submit
        </div>
      ),
    },
    {
      id: 3,
      maxValue: 10,
      progress: 0,
      imgSrc: "/assets/icons/dashboard/speech.svg",
      title: "Improvements",
      text: (
        <div className="card-info-text">
          The number of <strong>Improvements</strong> you can ask for
        </div>
      ),
    },*/
  ];

  return (
    <div className="upgrade_container">
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        className="breadcrumbs"
      >
        <RouterLink className="breadcrumbs" href={"/dashboard"} key="1">
          <img src="/assets/icons/breadcrumbs/home.svg" alt="" />
        </RouterLink>
        <Typography key="2" color="text.primary" className="active_breadcrumb">
          Subscription
        </Typography>
      </Breadcrumbs>
      <div className="title">Subscription</div>
      <div className="subtitle">Link your account to your company</div>
      {!licenseLoading ? (
        <>
          {currentLicence?.license?.name === "freemium" ||
          !Boolean(currentLicence?.activated) ? (
            <Link
              className="upgradeview-wrapper"
              to={"/dashboard/subscription/upgrade"}
            >
              <div className="upgradeview-container">
                <div className="text-container">
                  <div className="text-lg">Upgrade to Corporate</div>
                  <div className="text-sm">
                    To upgrade your account, please link it to your company and
                    unlock the full range of features and experiences!
                  </div>
                </div>
                <img
                  className="upgrade-image"
                  src="/assets/icons/dashboard/export.svg"
                  alt=""
                />
              </div>

              <div className="licence-type">
                <div className="licence-name-wrapper">
                  <div className="licence-text">Licence type</div>
                  <div className="chips">{currentLicence?.license?.name}</div>
                </div>

                <div className="expiration-date">
                  Expires on{" "}
                  {dayjs(currentLicence?.expiryDate).format("DD MMM YYYY")}
                </div>
              </div>
            </Link>
          ) : (
            <div className="licence-type-activated">
              <div className="licence-wrapper">
                <div className="licence-text">Licence type</div>
                <div className="chips">{currentLicence?.license?.name}</div>
              </div>
              <div className="expiration-date">
                Expires on{" "}
                {dayjs(currentLicence?.expiryDate).format("DD MMM YYYY")}
              </div>
            </div>
          )}
          <Divider
            sx={{
              width: "100%",
              height: "1px",
              background: "#DCDFEA",
              margin: "0px 0px 10px 0px",
            }}
          />
          <div className="upgradeview-license-details">
            <div className="details-section-title">License details</div>
            <div className="cards-container">
              {cardsData?.map((item) => (
                <div className="card-wrapper" key={item.id}>
                  <div className="card-details">
                    <img className="card-img" src={item?.imgSrc} alt="" />
                    {item.text}
                  </div>
                  <div className="card-values-text flex flex-row items-center justify-between">
                    <div>
                      {item.progress} of {item.maxValue} {item.title}
                    </div>
                    <img
                      onClick={() =>
                        navigate("/dashboard/subscription/transactions")
                      }
                      className="w-[40px] h-[40px] cursor-pointer"
                      src="/assets/icons/dashboard/export.svg"
                      alt=""
                    />
                  </div>

                  <LinearProgress
                    variant="determinate"
                    value={
                      ((item.maxValue - item.progress) * 100) / item.maxValue
                    }
                    sx={{
                      backgroundColor: "#F7EDFF", // Background color
                      borderRadius: "8px", // Border radius
                      height: "8px", // Height

                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#9F42E4", // Progress color
                        borderRadius: "8px", // Border radius (same as background)
                      },
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default SubscriptionView;
