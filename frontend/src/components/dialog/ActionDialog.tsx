import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import { JSX } from "react";

import Button from "../Button";

interface IProps {
  heading: string;
  subheading: string;
  children: JSX.Element;
  isOpen: boolean;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
}

export default function ActionDialog(props: IProps) {
  const { heading, subheading, children, isOpen, onClose, onConfirm } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: "28px",
          padding: 1,
          boxShadow: "none",
        },
      }}
    >
      <DialogTitle>{heading}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subheading}</DialogContentText>
        <Divider sx={{ my: 2 }} />
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
