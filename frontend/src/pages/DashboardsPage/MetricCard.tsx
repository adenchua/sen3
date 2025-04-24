import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface IProps {
  icon: ReactNode;
  title: string;
  value: number;
}

export default function MetricCard(props: IProps) {
  const { icon, title, value } = props;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <Avatar
        sx={{ bgcolor: "transparent", border: "1px solid", borderColor: "primary.main" }}
        variant="rounded"
      >
        {icon}
      </Avatar>
      <Typography variant="h6" fontWeight="bold">
        {value.toLocaleString()}
      </Typography>
      <Typography variant="body2">{title}</Typography>
    </Box>
  );
}
