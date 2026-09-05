import React from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Tooltip from '@mui/material/Tooltip'; 
import InfoIcon from '@mui/icons-material/Info'; 
import Rating from '@mui/material/Rating'; 




const Leaderboard = ({experts}) => {
  if (!experts) return null;
  
  // Function to display the rank based on the row index
  const rankBodyTemplate = (rowData, options) => {
    return options.rowIndex + 1; // Adding 1 to make the rank start from 1 instead of 0
  };
  const millisecondsToDaysHoursMinutesAndSeconds = (milliseconds) => {
    const seconds = milliseconds / 1000; // Convert milliseconds to seconds
    const days = Math.floor(seconds / (60 * 60 * 24)); // Calculate full days
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60)); // Remaining hours
    const minutes = Math.floor((seconds % (60 * 60)) / 60); // Remaining minutes
    const remainingSeconds = Math.floor(seconds % 60); // Remaining seconds
  
    let result = '';
    
    if (days > 0) {
      result += `${days} Day${days > 1 ? 's' : ''}, `;
    }
    
    if (hours > 0 || days > 0) {
      result += `${hours} Hour${hours > 1 ? 's' : ''}, `;
    }
  
    result += `${minutes} Min, ${remainingSeconds} Sec`;
    
    return result;
  };
  const ratingBodyTemplate = (rowData) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Rating
          name={`rating-${rowData._id}`}
          value={rowData.user.averageRatings || 0} // Show the average rating value
          precision={0.5} // Allows half-star ratings
          readOnly
        />
        <span style={{ marginLeft: '5px' }}>({rowData.user.numberOfRatings || 0} ratings)</span> {/* Optional: Show the number of ratings */}
      </div>
    );
  };
  const responseTimeBodyTemplate = (rowData) => {
    return millisecondsToDaysHoursMinutesAndSeconds(rowData.user.averageResponseTime);
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
    <div>
      <h3 style={{ textAlign: "center" }}>
        <b> Expert Leaderboard</b>
         {/* Tooltip next to the Leaderboard title */}
         <Tooltip title="The ranking is determined based on user ratings and reflects their evaluation of the experts.">
            <InfoIcon style={{ marginLeft: "10px", cursor: "pointer" }} />
          </Tooltip>
    
        </h3>
    
       
      <DataTable
        value={experts}
        paginator
        rows={5}
        stripedRows
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "30rem" }}
        rowHover
      >
        {/* Rank Column */}
        <Column 
          header="Rank" 
          body={rankBodyTemplate} 
          style={{ width: "10%" }} 
        />

        {/* Name Column */}
        <Column
          field="user.userName"
          header="Name"
     
          style={{ width: "25%" }}
        />
         {/* Name Column */}
        {/* Average Rating Column with star ratings */}
        <Column
            header="Average Rating"
            body={ratingBodyTemplate} // Use the star rating template
            style={{ width: "25%" }}
          />
          <Column
            header="Average Response Time"
            body={responseTimeBodyTemplate} // Use the formatted response time
           
          />
      </DataTable>
    
    </div>
   
  </div>
);
};

  
export default Leaderboard;
