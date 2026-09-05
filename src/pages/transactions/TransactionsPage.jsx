import "./transactions.scss";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import JournalsTable from "./TransactionsTable";
import { RouterLink } from "routes/components";
import Loader from "components/Loader";
import { getClientTranscations } from "features/dashboard/dashboardSlice";
import { useToast } from "components/toasts/ToastProvider";

const TransactionsPage = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const { showToast } = useToast();
  const showToastRef = useRef(showToast);

  const dispatch = useDispatch();

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  const getTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dispatch(getClientTranscations()).unwrap();
      setTransactions(data?.data ?? []);
    } catch (error) {
      showToastRef.current(error?.toString(), "error");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  const breadcrumbs = [
    <RouterLink href="/" className="link" key="1">
      <img src="/assets/icons/breadcrumbs/home.svg" alt="" />
    </RouterLink>,
    <Typography key="2" color="text.primary" className="active_breadcrumb">
      My Transactions
    </Typography>,
  ];

  return (
    <div className="view-container transactions">
      <div className="view_header">
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div className="second_header">
          <div>
            <h2>My Transactions</h2>
            <p>Review your credit transactions.</p>
          </div>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="my_speeches_body">
          {transactions?.length === 0 ? (
            <Box
              display={"flex"}
              padding={5}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={3}
              sx={{
                border: "1px solid #DCDFEA",
                borderRadius: "20px",
              }}
            >
              <div>
                <h3>No transactions has been made yet!</h3>
                <p>
                  Start a practice session.
                  <br />
                  First create a speech, then record your delivery to receive
                  feedback from your AI coach.
                </p>
              </div>
            </Box>
          ) : (
            <JournalsTable transactions={transactions} />
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
