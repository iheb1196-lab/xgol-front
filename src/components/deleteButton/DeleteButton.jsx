import { Box, Button } from "@mui/material";
import Iconify from "../iconify/iconify";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import CustomButton from "../customButton";
import "../modal/modal.scss";

const style = {
  width: "min(440px, 100%)",
  maxHeight: "100%",
  overflowY: "auto",
  boxSizing: "border-box",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: "28px 24px", sm: "40px 56px" },
  borderRadius: "20px",
  textAlign: "center",
  outline: "none",
};
const DeleteButton = ({
  label = "Delete",
  confirmationTitle,
  confirmationMessage,
  onConfirm,
  iconOnly,
  iconProps,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onDeleteClick = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <Button
        variant="text"
        color="error"
        endIcon={<Iconify icon="mingcute:delete-2-line" {...iconProps} />}
        onClick={handleOpen}
        sx={{
          fontSize: "18px",
          fontWeight: 600,
          fontFamily: "poppins",
          textTransform: "none",
        }}
      >
        {!iconOnly && label}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-confirmation-title"
        className="custom-modal"
      >
        <Box
          sx={style}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={3}
        >
          <img src="/assets/icons/error.svg" alt="" />
          <h3 className="m-0" id="delete-confirmation-title">
            {confirmationTitle}
          </h3>
          <p className="m-0">{confirmationMessage}</p>
          <Box display={"flex"} gap={4}>
            <CustomButton text={"Cancel"} handleClick={handleClose} />
            <CustomButton
              text={"Delete"}
              bg={"red"}
              primary
              handleClick={onDeleteClick}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteButton;
