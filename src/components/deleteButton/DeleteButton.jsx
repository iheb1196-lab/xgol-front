import { Box, Button } from "@mui/material";
import Iconify from "../iconify/iconify";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import CustomButton from "../customButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "20%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: "44px 80px",
  borderRadius: "20px",
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
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
          <h3 className="m-0">{confirmationTitle}</h3>
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
