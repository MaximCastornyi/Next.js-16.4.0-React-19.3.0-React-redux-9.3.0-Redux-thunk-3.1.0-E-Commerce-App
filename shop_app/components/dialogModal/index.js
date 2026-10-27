import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useSelector, useDispatch } from "react-redux";
import { hideDialog } from "../../store/DialogSlice";
import Link from "next/link";
import styles from "./styles.module.scss";
import DialogErrorBoundary from "./DialogErrorBoundary";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function DialogModalContainer() {
  return (
    <DialogErrorBoundary>
      <DialogModal />
    </DialogErrorBoundary>
  );
}

function DialogModal() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);

  const showDialog = Boolean(dialog?.show);
  const messages = Array.isArray(dialog?.msgs) ? dialog.msgs : [];
  const hasError = messages.some((msg) => msg?.type === "error");

  const handleClose = () => {
    dispatch(hideDialog());
  };

  return (
    <Dialog
      open={showDialog}
      slots={{
        transition: Transition,
      }}
      keepMounted={false}
      onClose={handleClose}
      disableScrollLock
      disablePortal
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      sx={{
        zIndex: 999999,
      }}
    >
      <DialogTitle
        className={`${styles.header} ${
          !hasError ? styles.dialog_success : ""
        }`}
      >
        {dialog?.header || "Notification"}
      </DialogTitle>

      <DialogContent className={styles.body}>
        {messages.map((msg, index) => (
          <DialogContentText
            className={styles.msg}
            id={`alert-dialog-slide-description-${index}`}
            key={index}
          >
            <img
              src={
                msg?.type === "error"
                  ? "/images/warning.png"
                  : "/images/verified.png"
              }
              alt=""
              style={{ width: "20px", height: "20px", objectFit: "contain" }}
            />
            <span>{msg?.msg}</span>
          </DialogContentText>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>

        {dialog?.link?.link && (
          <Button component={Link} href={dialog.link.link} color="primary">
            {dialog.link.text || "Open"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}