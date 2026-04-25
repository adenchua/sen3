import Box from "@mui/material/Box";
import { JSX } from "react";

import DRAWER_WIDTH from "../constants/drawerWidth";
import Drawer from "./Drawer";
import Typography from "@mui/material/Typography";

interface IProps {
  title: string;
  children: JSX.Element | JSX.Element[];
}

function PageLayout(props: IProps) {
  const { children, title } = props;

  return (
    <>
      <Drawer />
      <Box
        sx={{
          marginLeft: DRAWER_WIDTH,
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 4 }} color="primary">
            {title}
          </Typography>
          {children}
        </Box>
      </Box>
    </>
  );
}

export default PageLayout;
