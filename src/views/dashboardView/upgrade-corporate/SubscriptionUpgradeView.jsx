import "./subscription-upgrade.scss";
import { Breadcrumbs, Typography } from "@mui/material";
import RouterLink from "../../../routes/components/router-link";
import FormTextField from "../../../components/inputs/FormTextField";
import { FormProvider, useForm } from "react-hook-form";
import CustomButton from "../../../components/button/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { upgradeLicence } from "../../../features/dashboard/dashboardSlice";
import { useRouter } from "../../../routes/hooks";
import { useToast } from "../../../components/toasts/ToastProvider";
const SubscriptionUpgradeView = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { response, loading, error } = useSelector((state) => state.dashboard);
  const methods = useForm();
  const { showToast } = useToast();

  const onSubmit = (data) => {
    dispatch(upgradeLicence(data?.secret))
      .unwrap()
      .then(() => router.push("/dashboard/subscription"))
      .catch((err) => showToast(err, "error"));
  };
  return (
    <div className="sbup-container">
      <Breadcrumbs separator=">" aria-label="breadcrumb" className="breadcrumbs">
        <RouterLink className="breadcrumbs" href={"/dashboard"} key="1">
          <img src="/assets/icons/breadcrumbs/home.svg" alt="" />
        </RouterLink>
        <RouterLink className="breadcrumbs" href={"/dashboard/subscription"} key="2">
          Susbcription
        </RouterLink>
        <Typography key="3" color="text.primary" className="active_breadcrumb">
          Upgrading to a Corporate
        </Typography>
      </Breadcrumbs>
      <div className="title">Subscription</div>
      <div className="subtitle">Link your account to your company</div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="form-container">
            <div className="form-wrapper">
              <div className="text-container">
                <div className="text-lg">Upgrade to Corporate</div>
                <div className="text-sm">
                  To upgrade your account, please link it to your company and unlock the full range
                  of features and experiences!
                </div>
                <div className="form-fields-container">
                  {/* <div className="form-fields">
                    <div className="form-label"> Professional email </div>
                    <FormTextField
                      name="email"
                      label="Professional email"
                      rules={{ required: "required field" }}
                    />
                  </div> */}
                  <div className="form-fields">
                    <div className="form-label">Code provided</div>
                    <FormTextField
                      name="secret"
                      label="Code provided"
                      rules={{ required: "required field" }}
                      type={"password"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <CustomButton type="submit" label="Submit" disabled={loading} />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default SubscriptionUpgradeView;
