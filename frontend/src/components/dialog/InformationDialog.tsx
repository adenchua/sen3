import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import { JSX } from "react";

interface IProps {
  heading: string;
  subheading: string;
  children: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
}

function InformationDialog(props: IProps) {
  const { heading, subheading, children, isOpen, onClose } = props;

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
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default InformationDialog;
