import { Helmet } from "react-helmet-async";
import { PracticeView } from "../../views/practice";

// ----------------------------------------------------------------------

export default function PracticePage() {
  return (
    <>
      <Helmet>
        <title>Practice your speech</title>
      </Helmet>

      <PracticeView />
    </>
  );
}
