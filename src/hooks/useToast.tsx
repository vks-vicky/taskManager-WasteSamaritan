import { useState } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

export function useToast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const showToast = (msg: string, type: AlertColor = "success") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const Toast = (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );

  return { showToast, Toast };
}
