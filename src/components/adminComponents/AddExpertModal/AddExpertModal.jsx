import { Box, Modal } from "@mui/material";

import React, { useRef, useState } from "react";
import "./addExpertModal.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { assignExpert } from "../../../features/admin/adminSlice";
import { useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import { useParams } from "react-router-dom";
import { getCorporateSpeechStatistics } from "../../../features/admin/adminSlice";
import CustomButton from "../../../components/customButton";

const AddExpertModal = ({ open, setOpen }) => {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const { licenseId } = useParams();
 const [loading , setLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [maxEvaluation,setMaxEvaluation]= useState(0)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const handleSubmit = () => {
    setLoading(true)
    dispatch(assignExpert({ email, licenseId, firstName, lastName ,maxEvaluation}))
      .unwrap()
      .then(() => {
        handleClose();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "User successfully added to your list of experts.",
          life: 3000,
        });
         // Wait for the toast to show, then dispatch the action
         setTimeout(() => {
          setLoading(false)
          dispatch(getCorporateSpeechStatistics(licenseId));
        }, 1500); // Delay of 3000 ms (3 seconds) to match the toast's life duration
      })
    
      .catch((err) => {
        setLoading(false)
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
            <h3 id="modal-modal-title">Add Expert</h3>
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

            <Box sx={{ width: "100%", mt: 1 }} display={"flex"} gap={1}>
              <InputText
                id="invite"
                type="text"
                aria-describedby="username-help"
                placeholder="Firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
                 <InputText
                id="invite"
                type="text"
                aria-describedby="username-help"
                placeholder="Lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <div className="add">
                <img src="assets/icons/add.svg" alt="" />
              </div>
            </Box>
            <Box sx={{ width: "100%", mt: 1 }} display={"flex"} gap={1}>
         
               <InputText
                id="maxEvaluation"
                type="number"
                aria-describedby="username-help"
                placeholder="Enter maximum number of evaluations allowed"
                value={maxEvaluation}
                onChange={(e) => setMaxEvaluation(e.target.value)}
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

export default AddExpertModal;