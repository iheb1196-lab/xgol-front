import { Helmet } from "react-helmet-async";
import LeadershipRehearsal from "../views/learning/LeadershipRehearsal";

// ----------------------------------------------------------------------

export default function Learning() {
  
  return (
    <>
      <Helmet>
        <title> Learning </title>
      </Helmet>

      <LeadershipRehearsal />
    </>
  );
}
