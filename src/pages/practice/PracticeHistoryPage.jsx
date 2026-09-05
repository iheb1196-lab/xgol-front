import { Helmet } from "react-helmet-async";
import { PracticeHistoryView } from "../../views/practice";

// ----------------------------------------------------------------------

export default function PracticeHistoryPage() {
  return (
    <>
      <Helmet>
        <title>My Practices</title>
      </Helmet>

      <PracticeHistoryView />
    </>
  );
}
