/* eslint-disable react-hooks/exhaustive-deps */
import { Breadcrumbs, Typography, Box } from "@mui/material";
import RouterLink from "../../../routes/components/router-link";
import "./adminView.scss";
import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import StatCard from "../../../components/adminComponents/StatCard";
import RatingStatCard from "components/adminComponents/RatingStatCard";
import { useDispatch, useSelector } from "react-redux";
import AddUserModal from "../../../components/adminComponents/AddUserModal/AddUserModal";
import { getCorporateSpeechStatistics } from "../../../features/admin/adminSlice";
import AdminTable from "../../../components/adminComponents/AdminTable";
import { ProgressBar } from "primereact/progressbar";
import Loader from "../../../components/Loader";
import { useParams } from "react-router-dom";
import AddExpertModal from "components/adminComponents/AddExpertModal/AddExpertModal";
import Leaderboard from "components/leaderBoard/LeaderBoard";
// Importing Chart.js components and registering ArcElement
import { Pie } from "react-chartjs-2";
import UserChart from "components/userChart/UserChart";
import {
  Chart as ChartJS,
  ArcElement, // Import ArcElement
  Tooltip,
  Legend,
} from "chart.js";

// Register the required elements
ChartJS.register(ArcElement, Tooltip, Legend);
const AdminView = () => {
  const dispatch = useDispatch();
  const secondsToMinutesAndSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} Min , ${remainingSeconds.toFixed(0)} Sec`;
  };
  const { licenseId } = useParams();
  const { response, loading } = useSelector((state) => state.admin);
  console.log(loading);
  console.log(response);
  useEffect(() => {
    dispatch(getCorporateSpeechStatistics(licenseId));
  }, []);

  const [open, setOpen] = useState(false);
  const [openExpert, setOpenExpert] = useState(false);

  const topExperts = response?.topExperts || [];
  console.log(topExperts)

  const breadcrumbs = [
    <RouterLink href="/" className="link" key="1">
      <img src="/assets/icons/breadcrumbs/home.svg" alt="" />
    </RouterLink>,
    <Typography key="2" color="text.primary" className="active_breadcrumb">
      Admin Dashboard
    </Typography>,
  ];
  // Create data for the Pie chart
  const pieChartData = {
    labels: [
      "Total Expert Evaluations Requested",
      "Expert Evaluations Reviewed",
    ],
    datasets: [
      {
        label: "Activity",
        data: [
          response?.totalExpertRequested || 0,
          response?.totalEvaluatedVideos || 0,
        ],
        backgroundColor: ["#e6c7fd", "#9f42e4"],
        hoverBackgroundColor: ["#e6c7fd", "#9f42e4"],
      },
    ],
  };

  return (
    <div className="admin_dashboard">
      <div className="view_header">
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div className="second_header">
          <div>
            <h2>Admin Dashboard</h2>
          </div>
          {response && (
            <div className="btn-container">
              <Button
                label="+ Add User"
                severity="help"
                onClick={() => setOpen(true)}
                style={{ color: "white" }}
              />
              <Button
                label="+ Add Expert"
                severity="help"
                onClick={() => setOpenExpert(true)}
                style={{ color: "white" }}
              />

              <AddUserModal open={open} setOpen={setOpen} />
              <AddExpertModal open={openExpert} setOpen={setOpenExpert} />
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <Loader  style={{ marginTop: 20 }}  />
      ) : (
        response && (
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={3}
            overflow={"auto"}
          >
            <div className="licenses">
              {response && (
                <>
                  <p>
                    Number of users per license{" "}
                    <span className="licenses_number">
                      {response?.numberOfAllowedUsersWithinLicense}
                    </span>
                  </p>
                  <ProgressBar
                    color="#9f42e4"
                    value={
                      (response?.numberOfUserWithLicenses /
                        response?.numberOfAllowedUsersWithinLicense) *
                        100 || 0
                    }
                    showValue={false}
                  ></ProgressBar>
                  <Typography
                    variant="h6"
                    textAlign={"end"}
                    sx={{ fontSize: 16, color: "gray" }}
                  >
                    {`still ${
                      response?.numberOfAllowedUsersWithinLicense -
                      response?.numberOfUserWithLicenses
                    } users left`}
                  </Typography>
                </>
              )}
            </div>

            <Box
              display={"flex"}
              flexWrap={"wrap"}
              gap={3}
              justifyContent={"space-between"}
            >
              {response && (
                <StatCard
                  icon={"time"}
                  text={"Total time spent"}
                  stat={secondsToMinutesAndSeconds(response?.totalDuration)}
                />
              )}

              {response && (
                <StatCard
                  icon={"review"}
                  text={"Number of reviews completed"}
                  stat={`${response?.totalEvaluatedVideos} review`}
                />
              )}
              {response && (
                <RatingStatCard
                  icon={"review"}
                  email={response?.expertWithHighestRating?.user.emails[0]}
                  userName={
                    response?.expertWithHighestRating?.user.userName ||
                    "No expert available yet"
                  }
                  averageRating={
                    response?.expertWithHighestRating?.user.averageRatings
                  }
                  numberOfRatings={
                    response?.expertWithHighestRating?.user.numberOfRatings
                  }
                />
              )}
            </Box>
            {(response?.userDetails?.length > 0 ||
              response?.totalExpertRequested > 0) && (
              <div className="users_table_chart_wrapper">
                {/* Conditionally display team members table */}
                {response?.userDetails?.length > 0 && (
                  <div className="users_table">
                    <h3>
                      <b>Team members</b>
                    </h3>
                    <AdminTable users={response.userDetails} />
                  </div>
                )}

                {/* Conditionally display Pie chart */}
                {response?.totalExpertRequested > 0 && (
                  <div className="users_chart">
                    <Pie data={pieChartData} width={250} height={100} />
                  </div>
                )}
              </div>
            )}

            {/* Split layout for users table and chart */}
            {(topExperts?.length > 0 ||
              response?.numberOfUserWithLicenses > 0) && (
              <div className="leaderboard-container">
                {topExperts?.length > 0 && (
                  <div className="leaderboard">
                    <Leaderboard experts={topExperts} />
                  </div>
                )}

                {response?.numberOfUserWithLicenses > 0 && (
                  <div className="chart">
                    <UserChart stats={response} />
                  </div>
                )}
              </div>
            )}
          </Box>
        )
      )}
    </div>
  );
};

export default AdminView;
