import React, { useRef, useState } from "react";
import { Box, Modal } from "@mui/material";
import { useToast } from "components/toasts/ToastProvider";
import { getUserCredits,assignSnackCoachingExpert  } from "features/dashboard/dashboardSlice";

import "./expertListModal.scss";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Rating } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import { useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import { useParams } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  clearState,
  deleteVideo,
  getVideo,
  requestExpert,
} from "../../../features/video/videoSlice";

const ExpertListModal = ({ open, setOpen, expert }) => {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const { videoId } = useParams();
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  const { showToast } = useToast();

  const accept = () => {
    dispatch(assignSnackCoachingExpert( selectedExpert.user._id ))
      .unwrap()
      .then(() => {
         return dispatch(requestExpert({ video: videoId}));
    })
      .then(() => {

        dispatch(getVideo(videoId));
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Request sent",
          life: 3000,
        });
      })
      .catch(() =>
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong!",
          life: 3000,
        })
      );
  };

  const openConfirmDialog = (credits) => {
    confirmDialog({
      message: `The expert review costs 50 credits, your credit balance is ${credits}. If
      you confirm, your remaining balance will be ${credits - 50}. Would you like to proceed?`,
      header: "Request Expert Review",
      defaultFocus: "accept",
      accept,
      reject,
    });
  };

  const reject = () => {};
  const handleClose = () => {
    setOpen(false);
    setSelectedExpert(null);
  };

  const experts = expert || [];

  const onConfirmClick = async () => {
    try {
      setCreditsLoading(true);
      const data = await dispatch(getUserCredits()).unwrap();

      if (data?.active) {
        if (data?.credits - 50> 0) {
          setOpen(false);
          openConfirmDialog(data?.credits);
        } else {
          setOpen(false);
          showToast(`Not enough credits`, "error");
        }
      } else {
        setOpen(false);
        showToast(`You don't have an active license`, "error");
      }
    } catch (error) {
      setOpen(false);
      showToast(`Couldn't get your current credits`, "error");
    } finally {
      setCreditsLoading(false);
    }
  };


  const rowClassName = (rowData) => {
 
    return rowData.user._id === selectedExpert?.user._id ? 'selected-row' : '';
  };


  // Custom body template for Rating column
  const ratingBodyTemplate = (rowData) => {
    
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Rating
          name={`rating-${rowData.user._id}`}
          value={rowData.user.averageRatings || 0}
          precision={0.5}
          readOnly
        />
        <span style={{ marginLeft: '5px' }}>({rowData.user.numberOfRatings || 0} ratings)</span>
      </div>
    );
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="admin_box_modal">
          <h3 id="modal-modal-title" style={{ margin: 0 }}>
            Select Expert
           
          </h3>
          Select an expert from the list below to evaluate your videos. Once assigned, all your evaluation requests will be directed to this expert, and the choice cannot be changed.

          <Box sx={{ mb: 3 }} />

          <Box sx={{ width: "100%" }} display={"flex"} flexDirection={"column"} gap={2}>
          <DataTable
              value={experts}
              paginator
              rows={5}
              stripedRows
              
              selectionMode="single"
              onSelectionChange={(e) => setSelectedExpert(e.value)}
              dataKey="_id"
              tableStyle={{ minWidth: "30rem" }}
              rowHover
              rowClassName={rowClassName} // Apply class to selected row
            >
                      {/* Name Column */}
                      <Column field="user.userName" header="Name" style={{ width: "25%" }} />
              {/* Rank Column */}
              <Column header="email" field="user.emails.0" style={{ width: "10%" }} />

        

            
            </DataTable>

            <Button label="Confirm" severity="help" size="large" onClick={onConfirmClick} style={{ color: 'white' }} disabled={!selectedExpert} />
          </Box>
        </Box>
      </Modal>
      <Toast ref={toast} />
    </>
  );
};

export default ExpertListModal;
