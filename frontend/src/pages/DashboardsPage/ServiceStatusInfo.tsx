import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { green, red } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface IProps {
  icon: ReactNode;
  title: string;
  isAvailable: boolean;
}

export default function ServiceStatusInfo(props: IProps) {
  const { icon, title, isAvailable } = props;

  const SUCCESS_COLOR = green[700];
  const ERROR_COLOR = red[800];

  return (
    <Box display="flex" gap={2} alignItems="center">
      <Avatar variant="rounded" sx={{ bgcolor: isAvailable ? SUCCESS_COLOR : ERROR_COLOR }}>
        {icon}
      </Avatar>
      <Typography sx={{ color: isAvailable ? SUCCESS_COLOR : ERROR_COLOR }}>{title}</Typography>
      <Box flexGrow={1} />
      {isAvailable && <Typography color={SUCCESS_COLOR}>Service running normally</Typography>}
      {!isAvailable && <Typography color={ERROR_COLOR}>Service not available</Typography>}
    </Box>
  );
}
