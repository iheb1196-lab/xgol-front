/* eslint-disable react-hooks/exhaustive-deps */
import "./dashboard.scss";
import Header from "../../components/dashboard/Header";
import {
  Chart as ChartJS,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashboardData,
} from "../../features/dashboard/dashboardSlice";
import Loader from "../../components/Loader";
import classNames from "classnames";
import { Icon } from "@iconify/react";
import { tailwindColors, tailwindTheme } from "constants/theme.constant";
import moment from "moment";
import UserChart from "components/userChart/UserChart";
ChartJS.register(
  Title,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

const DashboardView = () => {
  const dispatch = useDispatch();
  const { response, loading} = useSelector(
    (state) => state.dashboard
  );

  
  let currentLicence = response?.userLicense;



  const dataArray = [10, 20, 60, 40, 30, 70, 80];

  const minutesDataset = [
    {
      label: "vs last week",
      data: dataArray, // Adjusted data values
      borderColor: dataArray.map((value) =>
        value > 0 ? "#12B76A" : value < 0 ? "#F00D05" : "#7D89B0"
      ),
      backgroundColor: dataArray.map((value) =>
        value > 0 ? "#ECFDF3" : value < 0 ? "#FFF0F0" : "#7D89B0"
      ),
      fill: true,
    },
  ];
  const speechArray = dataArray.map((value) => value * -1);
  const speechDataset = [
    {
      label: "vs last week",
      data: speechArray, // Adjusted data values
      borderColor: speechArray.map((value) =>
        value > 0 ? "#12B76A" : value < 0 ? "#F00D05" : "#7D89B0"
      ),
      backgroundColor: speechArray.map((value) =>
        value > 0 ? "#ECFDF3" : value < 0 ? "#FFF0F0" : "#7D89B0"
      ),
      fill: true,
    },
  ];
  const videosArray = dataArray.map((value) => value * 0);
  const videosDataset = [
    {
      label: "vs last week",
      data: videosArray, // Adjusted data values
      borderColor: videosArray.map((value) =>
        value > 0 ? "#12B76A" : value < 0 ? "#F00D05" : "#7D89B0"
      ),
      backgroundColor: videosArray.map((value) =>
        value > 0 ? "#ECFDF3" : value < 0 ? "#FFF0F0" : "#7D89B0"
      ),
      fill: true,
    },
  ];

  const cardsData = [
    {
      id: "minute",
      to: "/my_practices",
      dataset: minutesDataset,
      lineValue: 20,
      imgSrc: "/assets/icons/dashboard/time.svg",
      text: "Time spent practicing",
      label: "",
      labelValue: 0,
      className: "_timeSpentPracticingBox",
    },
    {
      id: "speech",
      to: "/my_speeches",
      dataset: speechDataset,
      lineValue: -20,
      imgSrc: "/assets/icons/dashboard/speech.svg",
      text: "Speeches practiced",
      label: "Speech(es)",
      labelValue: 0,
      className: "_speechesCompletedBox",
    },
    {
      id: "video",
      to: "/my_practices",
      dataset: videosDataset,
      lineValue: 0,
      imgSrc: "/assets/icons/dashboard/videos.svg",
      text: "Practice sessions",
      label: "Session(s)",
      labelValue: 0,
      className: "_videosRecordedBox",
    },
    {
      id: "credits",
      to: "/dashboard/subscription",
      lineValue: 0,
      imgSrc: "/assets/icons/dashboard/credits.svg",
      text: "Remaining Credits",
      label: "Credit(s)",
      labelValue: 0,
      bottom: (
        <div className="flex flex-row items-center justify-start pl-[10px]">
          <span className="mr-1">
            <Icon
              icon="mdi:timer-minus"
              fontSize={18}
              color={
                response?.userLicense?.activated
                  ? tailwindTheme.colors?.secondary.main
                  : tailwindColors.red[500]
              }
            ></Icon>
          </span>
          <span
            className={classNames("font-semibold text-xs mr-1", {
              "text-secondary-main": response?.userLicense?.activated,
              "text-red-500": !response?.userLicense?.activated,
            })}
          >
            {response?.userLicense?.activated ? "Expires" : "Expired"}
          </span>
          <span
            className={classNames("text-xs font-semibold", {
              "text-black": response?.userLicense?.activated,
              "text-red-500": !response?.userLicense?.activated,
            })}
          >
            {moment(response?.userLicense?.expiryDate).format("DD/MM/YYYY")}
          </span>
        </div>
      ),
      className: "_videosRecordedBox",
    },
  ];

  const secondsToMinutesAndSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} Min , ${remainingSeconds.toFixed(0)} Sec`;
  };
  if (response) {
    var transformedData = cardsData.map((item) => {
      return {
        ...item,
        labelValue:
          item.id === "minute"
            ? secondsToMinutesAndSeconds(response.totalDuration)
            : item.id === "speech"
            ? response.uniqueSpeechesPracticed
            : item.id === "video"
            ? response.numberOfVideosRecorded
            : item.id === "credits"
            ? response?.userLicense?.activated
              ? response?.userLicense?.credits ?? 0
              : 0
            : 0, // Assuming item has a name property
        // Add more properties as needed
      };
    });
  }

  useEffect(() => {
    dispatch(getDashboardData());

  }, []);

  if (loading) {
    return (
      <div className="p-[20px]">
        <Header text= "Dashboard"/>
        <Loader style={{ marginTop: 20 }} />
      </div>
    );
  }

  return (
    <div className="dashboard_container">
      <Header text= "Dashboard"/>
      <div className="coaching-dashboard-invite"><div><strong>Your next conversation deserves a practice run.</strong><p>Get a personalized coaching snack or continue your latest exercise.</p></div><Link to="/coaching">Open My Coaching →</Link></div>
      <div className="main-stack-container">
        <div className="cards-container">
          {transformedData?.map((item, index) => (
            <Link
              key={item.id}
              to={item.to} // Navigates to the specified route when clicked
              className={classNames(
                "card cursor-pointer relative",
                item?.className
              )}
            >
              <img className="card-img" src={item?.imgSrc} alt="" />
              <div className="stats-text-wrapper">
                <div className="stats-sm-text">{item?.text}</div>
                <div className="stats-lg-text">
                  {item?.labelValue + " " + item.label}
                </div>
                <div className="w-full absolute bottom-[10px] left-0 flex flex-row items-center justify-between">
                  <div>{item.bottom && <>{item.bottom}</>}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="leaderboard-container">
          <div className="chart">
          <UserChart stats={response}/>
          </div>
        </div>

        {(currentLicence?.activated === false ||
          currentLicence?.license?.name === "freemium") && (
          <Link className="upgrade-container" to={"/dashboard/subscription"}>
            <div className="text-container _upgradeToCorporateBox">
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
          </Link>
           
        )}
        
      </div>
    </div>
  );
};

export default DashboardView;
