import { Helmet } from "react-helmet-async";
import WelcomeBackView from "../views/welcomeBack/WelcomeBackView";

const WelcomeBackPage = () => {
  return (
    <>
      <Helmet>
        <title>Welcome Back</title>
      </Helmet>
      <WelcomeBackView />
    </>
  );
};

export default WelcomeBackPage;
