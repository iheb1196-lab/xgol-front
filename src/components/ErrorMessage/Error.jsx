import React, { useRef } from "react";
import { useMountEffect } from "primereact/hooks";
import { Messages } from "primereact/messages";
import { Box } from "@mui/material";

export default function Error({message}) {
  const msgs = useRef(null);

  useMountEffect(() => {
    if (msgs.current) {
      msgs.current.clear();
      msgs.current.show({
        id: "1",
        sticky: true,
        severity: "error",
        summary: "Error",
        detail: message,
        closable: false,
      });
    }
  });

  return (
    <Box display={"flex"} justifyContent="center"  alignItems="center" height={'100%'} width={'100%'}>
      <Messages ref={msgs} />
    </Box>
  );
}
