import React from "react";
import "./statCard.scss";

const StatCard = ({ icon, text, stat, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="stat_card"
      style={{ cursor: onClick && "pointer" }}
    >
      <img
        src={`/assets/icons/stats/${icon}.svg`}
        alt="icon"
        className="icon"
      />
      <div className="stats">
        <p>{text}</p>
        <h2>{stat}</h2>
      </div>
    </div>
  );
};

export default StatCard;
