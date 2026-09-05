import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";
import Layout from "../layout/Layout";
import OutsideLayout from "../OutsideLayout/OutsideLayout";
import LoginPage from "../pages/loginPage";
import SignupPage from "../pages/SignupPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import WelcomeBackPage from "../pages/WelcomeBackPage";
import UserOnboarding from "components/walkthrough/UserOnboarding";

// Lazy loaded components
const IndexPage = lazy(() => import("../pages/LandingPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const SubscriptionPage = lazy(() =>
  import("../pages/dashboard/SubscriptionPage")
);
const SubscriptionUpgradePage = lazy(() =>
  import("../pages/dashboard/SubscriptionUpgradePage")
);
const LearningPage = lazy(() => import("../pages/LearningPage"));
const CoachingHome = lazy(() => import("../views/coaching/CoachingHome"));
const CoachInbox = lazy(() => import("../views/coaching/CoachInbox"));
const SpeechesPage = lazy(() => import("../pages/speech/SpeechesPage"));

const SpeechDetailsPage = lazy(() =>
  import("../pages/speech/SpeechDetailsPage")
);
const WriteSpeechPage = lazy(() => import("../pages/speech/WriteSpeechPage"));
const PracticePage = lazy(() => import("../pages/practice/PracticePage"));
const PracticeHistoryPage = lazy(() =>
  import("../pages/practice/PracticeHistoryPage")
);
const PracticeSessionPage = lazy(() =>
  import("../pages/practice/PracticeSessionPage")
);
const AdminPage = lazy(() => import("../pages/admin/AdminPage"));
const AdminLicensesPage = lazy(() =>
  import("../pages/admin/AdminLicensesPage")
);

const Page404 = lazy(() => import("../pages/page-not-found"));
const AccountPage = lazy(() => import("../pages/AccountPage"));
const VerifyEmailPage = lazy(() => import("../pages/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const CheckEmailPage = lazy(() => import("../pages/CheckEmailPage"));
const SetPasswordPage = lazy(() => import("../pages/SetPasswordPage"));
const SettedSuccessPage = lazy(() => import("../pages/SettedSuccessPage"));
const PasswordResetPage = lazy(() => import("../pages/PasswordResetPage"));

const TransactionsPage = lazy(() =>
  import("pages/transactions/TransactionsPage")
);

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <Suspense>
          <OutsideLayout>
            <PublicRoute>
              <Outlet />
            </PublicRoute>
          </OutsideLayout>
        </Suspense>
      ),
      children: [
        { path: "/", element: <IndexPage />, index: true },
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignupPage /> },
        { path: "verify_email", element: <VerifyEmailPage /> },
        { path: "forgot_password", element: <ForgotPasswordPage /> },
        { path: "check_email", element: <CheckEmailPage /> },
        { path: "set_password/:token_id", element: <SetPasswordPage /> },
        { path: "password_reset", element: <PasswordResetPage /> },
        {
          path: "password_reset_success",
          element: <SettedSuccessPage type="password" />,
        },
        {
          path: "account_verification/:token_id",
          element: <SettedSuccessPage type="account" />,
        },
      ],
    },
    {
      element: (
        <Suspense>
          <PublicRoute>
            <Outlet />
          </PublicRoute>
        </Suspense>
      ),
      children: [
        {
          path: "account_verification/passwordReset/:token_id",
          element: <WelcomeBackPage />,
        },
      ],
    },
    {
      element: (
        <Suspense>
          <PrivateRoute allowedRoles={["ADMIN", "CLIENT"]}>
            <Layout>
              <UserOnboarding />
              <Outlet />
            </Layout>
          </PrivateRoute>
        </Suspense>
      ),
      children: [
        { path: "dashboard", element: <DashboardPage /> },
        { path: "dashboard/subscription", element: <SubscriptionPage /> },
        {
          path: "dashboard/subscription/upgrade",
          element: <SubscriptionUpgradePage />,
        },

        { path: "learning", element: <LearningPage /> },
        { path: "coaching", element: <CoachingHome /> },
        { path: "snack_coaching/practice", element: <Navigate to="/coaching" replace /> },
        { path: "snack_coaching", element: <Navigate to="/coaching" replace /> },
        { path: "my_speeches", element: <SpeechesPage /> },
        { path: "my_speeches/write_speech", element: <WriteSpeechPage /> },
        { path: "my_speeches/:speechId", element: <SpeechDetailsPage /> },
        {
          path: "my_speeches/:speechId/practice",
          element: <PracticePage />,
        },
        { path: "my_practices", element: <PracticeHistoryPage /> },
        { path: "my_practices/:sessionId", element: <PracticeSessionPage /> },
        { path: "account", element: <AccountPage /> },
        {
          path: "dashboard/subscription/transactions",
          element: <TransactionsPage />,
        },
      ],
    },
    {
      element: (
        <Suspense>
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <Layout>
              <Outlet />
            </Layout>
          </PrivateRoute>
        </Suspense>
      ),
      children: [
        { path: "admin/licenses", element: <AdminLicensesPage /> },
        { path: "admin/licenses/:licenseId", element: <AdminPage /> },
      ],
    },
    { path: "coach/inbox", element: <Suspense><PrivateRoute allowedRoles={["EXPERT"]}><Layout><CoachInbox /></Layout></PrivateRoute></Suspense> },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);

  return routes;
}
