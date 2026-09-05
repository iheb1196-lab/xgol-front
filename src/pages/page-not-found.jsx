import { Helmet } from "react-helmet-async";

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found </title>
      </Helmet>

      <h1>404 Page Not Found</h1>
    </>
  );
}
