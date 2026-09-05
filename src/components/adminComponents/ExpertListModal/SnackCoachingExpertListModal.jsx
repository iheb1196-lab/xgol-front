import React, { useRef, useState } from "react";
import { Box, Modal } from "@mui/material";
import { assignSnackCoachingExpert } from "features/dashboard/dashboardSlice";
import "./expertListModal.scss";
import { useRouter } from "../../../routes/hooks/use-router";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "components/toasts/ToastProvider";


const SnackCoachingExpertListModal = ({ open, setOpen, expert  }) => {
  const toast = useRef(null);
  const { showToast } = useToast();
  const router = useRouter()
 
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [selectedExpert, setSelectedExpert] = useState(null);
  const accept = () => {
    dispatch(assignSnackCoachingExpert(  selectedExpert.user._id ))
      .unwrap()
      .then(() => {
     
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Expert Assigned successfully!",
          life: 3000,
        })
     // Delay navigation to allow toast message to display
     setTimeout(() => {
      router.push('/snack_coaching/practice');
    }, 1000); // Wait for 3 seconds before redirecting
  
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

  const openConfirmDialog = (selectedExpert) => {
    


    confirmDialog({
      message: `Are you sure you want to assign ${selectedExpert.user.userName} as the Snack Coaching video's expert?`,
      header: "Assign An Expert",
      defaultFocus: "accept",
     
      accept,
      reject,
    });
  };
  const onConfirmClick = async () => {
    try {
      setLoading(true);
   
      
          setOpen(false)
          openConfirmDialog(selectedExpert);
      
    } catch (error) {
      setOpen(false)
      showToast(`Couldn't get your current credits`, "error");
    } finally {
      setOpen(false)
      setLoading(false);
    }
  };

  const reject = () => {
    setSelectedExpert(null);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedExpert(null);
  };

  const experts = expert || [];




  const rowClassName = (rowData) => {
 
    return rowData.user._id === selectedExpert?.user._id ? 'selected-row' : '';
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
          Please choose from the following list an expert who will evaluate your Snack Coaching videos. Please note that once you assign, you won't be able to change it, and all your Snack Coaching videos will be assessed by this expert.

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

export default SnackCoachingExpertListModal
