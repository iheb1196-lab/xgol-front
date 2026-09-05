import { Box, Modal } from "@mui/material";

import React, { useRef, useState } from "react";
import "./addUserModal.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { assignLicenseAdmin } from "../../../features/admin/adminSlice";
import { useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import { useParams } from "react-router-dom";
import { getCorporateSpeechStatistics } from "../../../features/admin/adminSlice";
import CustomButton from "../../../components/customButton";

const AddUserModal = ({ open, setOpen }) => {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const { licenseId } = useParams();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const handleSubmit = () => {
    setLoading(true)
    dispatch(assignLicenseAdmin({ email, licenseId }))
      .unwrap()
      .then(() => {
        handleClose();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "License assigned",
          life: 3000,
        });
            // Wait for the toast to show, then dispatch the action
            setTimeout(() => {
              setLoading(false)
              dispatch(getCorporateSpeechStatistics(licenseId));
            }, 1500); // Delay of 3000 ms (3 seconds) to match the toast's life duration
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err,
          life: 3000,
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
    // dispatch(getCorporateSpeechStatistics(licenseId))
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
          <Box display={"flex"} justifyContent={"space-between"} alignItems={"flex-start"}>
            <h3 id="modal-modal-title">Add users</h3>
          </Box>
          <Box sx={{ width: "100%" }} display={"flex"} flexDirection={"column"} gap={2}>
            <label htmlFor="invite">invite by email</label>

            <Box sx={{ width: "100%", mt: 1 }} display={"flex"} gap={1}>
              <InputText
                id="invite"
                type="email"
                aria-describedby="username-help"
                placeholder="Enter professional email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="add">
                <img src="assets/icons/add.svg" alt="" />
              </div>
            </Box>
            <CustomButton
                  text={"Confirm"}
                  primary
                  disabled= {false}
                  handleClick={() =>
                    handleSubmit()
                  }
                  className="_speechSubmitButton"
                  loading={loading}
                />
          
          </Box>
        </Box>
      </Modal>
      <Toast ref={toast} />
    </>
  );
};

export default AddUserModal;
