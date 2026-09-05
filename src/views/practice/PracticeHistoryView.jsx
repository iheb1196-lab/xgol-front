/* eslint-disable react-hooks/exhaustive-deps */
import "./practiceHistory.scss";
import { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import _ from "lodash";

import RouterLink from "../../routes/components/router-link";
import ButtonLink from "../../components/buttonLink";
import DeleteButton from "../../components/deleteButton/DeleteButton";
import { useToast } from "../../components/toasts/ToastProvider";
import { useRouter } from "../../routes/hooks";
import { deleteSession, getSessions } from "../../features/practice/practiceSlice";
import { formatSeconds } from "../../components/practice/AudioRecorder";

const PracticeHistoryView = () => {
  const { loading, sessions } = useSelector((state) => state.practice);
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getSessions());
  }, []);

  useEffect(() => {
    setRows(
      _.map(sessions ?? [], (session) => ({
        id: session._id,
        title: session.speech?.title ?? "Deleted speech",
        objective: session.objective || "—",
        duration: session.duration ? formatSeconds(session.duration) : "—",
        status: session.status,
        createdAt: moment(session.createdAt).format("DD/MM/yyyy HH:mm"),
      }))
    );
  }, [sessions]);

  const columns = [
    {
      field: "title",
      headerName: "Speech",
      minWidth: 300,
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <img src="/assets/icons/speech/icon.svg" alt="" /> {params.row.title}
        </div>
      ),
    },
    { field: "objective", headerName: "Objective", minWidth: 260, flex: 1 },
    { field: "duration", headerName: "Duration", minWidth: 110 },
    { field: "createdAt", headerName: "Practiced on", minWidth: 170 },
    {
      field: "status",
      headerName: "Feedback",
      minWidth: 130,
      renderCell: (params) => (
        <span
          className={`practice_status practice_status--${params.row.status?.toLowerCase()}`}
        >
          {params.row.status === "COMPLETED"
            ? "Ready"
            : params.row.status === "FAILED"
            ? "Failed"
            : "Processing"}
        </span>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 70,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: DeleteSessionCell,
    },
  ];

  const breadcrumbs = [
    <RouterLink href="/" className="link" key="1">
      <img src="/assets/icons/breadcrumbs/home.svg" alt="" />
    </RouterLink>,
    <RouterLink key="2" href="/my_practices" className="link">
      Public Speaking
    </RouterLink>,
    <Typography key="3" color="text.primary" className="active_breadcrumb">
      My Practices
    </Typography>,
  ];

  return (
    <div className="view-container practice_history">
      <div className="view_header">
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div className="second_header">
          <div>
            <h2>My practices</h2>
            <p>Review your recordings and the AI coach feedback</p>
          </div>
          <ButtonLink
            text={"Practice a speech"}
            primary
            path={"/my_speeches"}
            className="_practiceNewButton"
          />
        </div>
      </div>
      <div className="my_speeches_body">
        {sessions?.length === 0 ? (
          <div className="no_sessions">
            <img src="/assets/icons/noSpeech.svg" alt="" />
            <h3>No practice sessions yet</h3>
            <p>
              Pick one of your speeches, record yourself reading it and <br />
              get instant AI feedback on your delivery.
            </p>
          </div>
        ) : (
          <div style={{ height: "480px", width: "100%" }}>
            <DataGrid
              style={{ borderRadius: 20, textAlign: "center" }}
              rows={rows}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 7 } },
              }}
              pageSizeOptions={[7, 14]}
              onCellClick={(e) => {
                if (e.field !== "delete") {
                  router.push(`/my_practices/${e.id}`);
                }
              }}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

function DeleteSessionCell(params) {
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const onDeleteClick = () => {
    dispatch(deleteSession(params.row.id))
      .unwrap()
      .then(() => {
        dispatch(getSessions());
        showToast("Practice session has been deleted", "success");
      })
      .catch(() => {
        showToast("Error while deleting the practice session", "error");
      });
  };

  return (
    <DeleteButton
      confirmationTitle="Delete Practice Session"
      confirmationMessage="Are you sure you want to delete this practice session and its feedback?"
      onConfirm={onDeleteClick}
      iconOnly={true}
      iconProps={{ width: 20 }}
    />
  );
}

export default PracticeHistoryView;
