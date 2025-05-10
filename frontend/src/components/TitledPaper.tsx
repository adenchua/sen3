import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface IProps {
  title: string;
  children: ReactNode;
}

export default function TitledPaper(props: IProps) {
  const { children, title } = props;
  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6" mb={3} color="primary">
        {title}
      </Typography>
      {children}
    </Paper>
  );
}
