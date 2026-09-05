import { Helmet } from "react-helmet-async";
import MySpeechesView from "../../views/speeches/mySpeeches";

// ----------------------------------------------------------------------

export default function SpeechesPage() {
  return (
    <>
      <Helmet>
        <title>My Speeches </title>
      </Helmet>

      <MySpeechesView/>
    </>
  );
}
