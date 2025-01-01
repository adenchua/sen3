import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { JSX } from "react";
import { useNavigate } from "react-router";

import DRAWER_WIDTH from "../constants/drawerWidth";
import APP_ROUTES from "../constants/routes";
import AccountIcon from "../icons/AccountIcon";
import BrandingIcon from "../icons/BrandingIcon";
import DrawerHideIcon from "../icons/DrawerHideIcon";
import Drawer from "./Drawer";

interface IProps {
  children: JSX.Element;
  title: string;
}

function PageLayout(props: IProps) {
  const { children, title } = props;
  const navigate = useNavigate();

  return (
    <>
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          borderBottom: "1px solid",
          borderColor: "#E6E6E6",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            bgcolor: "Background",
            display: "flex",
            gap: 2,
          }}
        >
          <IconButton disabled>
            <DrawerHideIcon />
          </IconButton>
          <Box
            component="button"
            onClick={() => navigate(APP_ROUTES.homepage)}
            sx={{
              all: "unset",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: (theme) => theme.palette.primary.main,
              cursor: "pointer",
            }}
          >
            <BrandingIcon color="inherit" />
            <Typography variant="h6" fontWeight="bold" color="inherit">
              Sen3 Admin Portal
            </Typography>
          </Box>
          <Box flexGrow={1} />
          <IconButton color="primary" disabled>
            <AccountIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer />
      <Box
        sx={{
          marginLeft: DRAWER_WIDTH,
        }}
      >
        <Toolbar />
        <Box p={4}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            {title}
          </Typography>
          {children}
        </Box>
      </Box>
    </>
  );
}

export default PageLayout;
