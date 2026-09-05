import React from "react";
import { Box, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function UserChart({ stats }) {
  // Check if stats is provided
  if (!stats) return null;

  // Extract the required statistics from the stats object
  const numberOfVideosRecordedThisMonth = stats.numberOfVideosRecordedThisMonth || 0;
  const numberOfSpeechesCreatedThisMonth = stats.numberOfSpeechesCreatedThisMonth || 0;

  // Prepare the data for the chart
  const data = {
    labels: ["Practice Sessions This Month", "Speeches Created This Month"],
    datasets: [
      {
        label: "User Activity",
        data: [numberOfVideosRecordedThisMonth, numberOfSpeechesCreatedThisMonth],
        backgroundColor: ["#9f42e4", "#e6c7fd"],
        borderColor: ["#9f42e4", "#e6c7fd"],
        borderWidth: 1,
      },
    ],
  };

  // Configure the chart options
  const options = {
    indexAxis: "y", // This makes the bars horizontal
    responsive: true,
    layout: {
      padding: {
        top: 10, // Reduce top padding
        bottom: 20, // Adjust bottom padding for centering
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend if not needed
      },
      title: {
        display: true,
        text: "User Activity for the Current Month",
        padding: {
          top: 10, // Less padding above the title
          bottom: 20, // Space between title and chart
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        title: {
          display: false,
        },
      },
    },
    aspectRatio: 1.5, // Adjust the height-to-width ratio to center the bars
  };

  return (
    <Box sx={{ padding: 0, width: "100%", maxWidth: "500px", marginLeft: " 100px"  ,textAlign:"center"}}>
      <Typography variant="h6" textAlign="center">
        User Statistics for {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
      </Typography>
      <Bar data={data} options={options}/>
    </Box>
  );
}
