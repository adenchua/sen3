import Box from "@mui/material/Box";
import { JSX } from "react";

import DRAWER_WIDTH from "../constants/drawerWidth";
import Drawer from "./Drawer";

interface IProps {
  children: JSX.Element | JSX.Element[];
}

function PageLayout(props: IProps) {
  const { children } = props;

  return (
    <>
      <Drawer />
      <Box
        sx={{
          marginLeft: DRAWER_WIDTH,
        }}
      >
        <Box p={4}>{children}</Box>
      </Box>
    </>
  );
}

export default PageLayout;
