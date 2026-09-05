import React from "react";
import { Helmet } from "react-helmet-async";
import SubscriptionUpgradeView from "../../views/dashboardView/upgrade-corporate/SubscriptionUpgradeView";

const SubscriptionUpgradePage = () => {
  return (
    <>
      <Helmet> 
        <title > Subscription Upgrade </title>
      </Helmet>

      <SubscriptionUpgradeView />
    </>
  );
};
export default SubscriptionUpgradePage;
