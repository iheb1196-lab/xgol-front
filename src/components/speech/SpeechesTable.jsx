import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "../../routes/hooks";
import { useDispatch } from "react-redux";
import DeleteButton from "components/deleteButton/DeleteButton";
import { useToast } from "components/toasts/ToastProvider";
import { deleteSpeech } from "features/speech/speechSlice";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    field: "title",
    headerName: "Speech Title",
    minWidth: 400,
    flex: 1,
    textAlign: "center",
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        <img src="/assets/icons/speech/icon.svg" alt="" /> {params.row.title}
      </div>
    ),
  },
  { field: "createdAt", headerName: "Creation Date", minWidth: 200 },
  {
    field: "numberOfSessions",
    headerName: "Practice sessions",
    minWidth: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "delete",
    headerName: "Delete",
    minWidth: 50,
    align: "center",
    headerAlign: "center",
    renderCell: DeleteSpeechCell,
  },
  // {
  //   field: "score",
  //   headerName: "Overall AI Score",
  //   width: 200,
  //   align: "center",
  //   headerAlign: "center",
  // },
  // {
  //   field: "feedback",
  //   headerName: "feedback",
  //   width: 200,
  //   textAlign: "center",
  // },
];

export default function SpeechesTable({ speeches, loading }) {
  const router = useRouter();
  return (
    <div style={{ height: "410px", width: "100%" }}>
      <DataGrid
        style={{ borderRadius: 20, textAlign: "center" }}
        rows={speeches ?? []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        onCellClick={(e) => {
          if (e.field !== "delete") {
            router.push(`${e.id}`, {
              numberOfSessions: e.row.numberOfSessions,
            });
          }
        }}
        loading={loading}
      />
    </div>
  );
}

function DeleteSpeechCell(params) {
  const { showToast } = useToast();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onDeleteClick = () => {
    dispatch(deleteSpeech(params.row.id))
      .unwrap()
      .then(() => {
        navigate(0);
        showToast("Speech has been deleted", "success");
      })
      .catch((error) => {
        showToast("Error while deleting speech", "error");
      });
  };

  //table delete button
  return (
    <DeleteButton
      confirmationTitle="Delete Speech"
      confirmationMessage="Are you sure you want to delete this speech? All practice sessions related to this speech will be deleted"
      onConfirm={onDeleteClick}
      iconOnly={true}
      iconProps={{
        width: 20,
      }}
    />
  );
}
