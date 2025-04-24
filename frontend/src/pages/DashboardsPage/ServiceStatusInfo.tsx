import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface IProps {
  icon: ReactNode;
  title: string;
  isAvailable: boolean;
}

export default function ServiceStatusInfo(props: IProps) {
  const { icon, title, isAvailable } = props;

  return (
    <Box display="flex" gap={2} alignItems="center">
      <Avatar sx={{ bgcolor: isAvailable ? "success.main" : "error.main" }}>{icon}</Avatar>
      <Typography sx={{ color: isAvailable ? "success.main" : "error.main" }}>{title}</Typography>
      <Box flexGrow={1} />
      {isAvailable && <Typography color="success">Service is running normally</Typography>}
      {!isAvailable && <Typography color="error">Service not available</Typography>}
    </Box>
  );
}
