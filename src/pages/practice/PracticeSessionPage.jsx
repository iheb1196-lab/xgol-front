import { Helmet } from "react-helmet-async";
import { PracticeSessionView } from "../../views/practice";

// ----------------------------------------------------------------------

export default function PracticeSessionPage() {
  return (
    <>
      <Helmet>
        <title>Practice Session</title>
      </Helmet>

      <PracticeSessionView />
    </>
  );
}
