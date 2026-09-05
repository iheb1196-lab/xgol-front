import React from "react";
import { Rating, Typography , Box, Tooltip} from '@mui/material';
import "./ratingStatCard.scss";

const RatingStatCard = ({ icon,email,userName, averageRating, numberOfRatings,onClick }) => {
  return (
    <div
      onClick={onClick}
      className="stat_card"
      style={{ cursor: onClick && "pointer" }}
    >
      <img
        src={`/assets/icons/dashboard/stars.svg`}
        alt="icon"
        className="icon"
      />
      <div className="stats">
      <p>Best Rated Expert : </p>
      {/* Tooltip for displaying email when hovering over the userName */}
      <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
      {/* Tooltip for displaying email when hovering over the userName */}
      <Tooltip title={email} arrow>
        <Typography variant="h7" component="span" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
          {userName}
        </Typography>
      </Tooltip>
      
      {/* Box for the rating display */}
      <Box display="flex" alignItems="center">
        {/* Rating component to display the average rating */}
        <Rating 
          name="expert-rating" 
          value={averageRating} 
          precision={0.1} 
          readOnly
        />
        
    
        
        {/* Display number of people who gave ratings */}
        <Typography variant="body2" sx={{ ml: 1, color: 'gray' }}>
          ({numberOfRatings} {numberOfRatings === 1 ? 'rating' : 'ratings'})
        </Typography>
      </Box>
    </Box>
      </div>
    </div>
  );
};

export default RatingStatCard;
