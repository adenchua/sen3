import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import { JSX } from "react";

import Button from "../Button";

interface IProps {
  children: JSX.Element;
  heading: string;
  isOpen: boolean;
  onClose: VoidFunction;
  onCloseText?: string;
  onConfirm: VoidFunction;
  onConfirmText?: string;
  subheading: string;
}

export default function ActionDialog(props: IProps) {
  const {
    heading,
    subheading,
    children,
    isOpen,
    onClose,
    onConfirm,
    onCloseText = "Cancel",
    onConfirmText = "Confirm",
  } = props;

  return (
    <Dialog
      fullWidth
      open={isOpen}
      onClose={(_, reason) => {
        if (reason === "backdropClick") {
          // prevent closing on backdrop click, since action dialogs often contain
          // long input forms
          return;
        }
        onClose();
      }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            borderRadius: "28px",
            padding: 1,
            boxShadow: "none",
          },
        },
      }}
    >
      <DialogTitle color="primary">{heading}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subheading}</DialogContentText>
        <Divider sx={{ my: 2 }} />
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {onCloseText}
        </Button>
        <Button onClick={onConfirm} color="primary">
          {onConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
