import { Helmet } from "react-helmet-async";
import SubscriptionView from "../../views/dashboardView/upgrade-corporate/SubscriptionView";

const SubscriptionPage = () => {
  return (
    <>
      <Helmet>
        <title> Subscription </title>
      </Helmet>

      <SubscriptionView />
    </>
  );
};

export default SubscriptionPage;
