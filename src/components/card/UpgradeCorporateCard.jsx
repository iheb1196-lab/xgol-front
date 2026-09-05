import React from "react";
import "./upgradeCorporateCard.scss";

const UpgradeCorporateCard = () => {
  return (
    <div className="card">
      <div className="vertical-container">
        <div className="button">
          <div className="text-input">
            <div className="text">Upgrade to Corporate</div>
          </div>
          <div className="text-2">To upgrade your account, please link it to your company and unlock the full range of features and experiences!</div>
        </div>
        <div className="card-icon">
        <img src="/assets/icons/upgradePlan/icon.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default UpgradeCorporateCard;
