import { Box, CircularProgress } from "@mui/material";
import React from "react";

const Loader = ({ style }) => {
  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      justifyContent="center"
      alignItems="center"
      {...style}
    >
      <CircularProgress style={{ color: "#9f42e4" }} size={80} />
    </Box>
  );
};

export default Loader;
