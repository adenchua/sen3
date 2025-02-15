import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { JSX } from "react";
import { useNavigate } from "react-router";

import DRAWER_WIDTH from "../constants/drawerWidth";
import APP_ROUTES from "../constants/routes";
import { APP_BACKGROUND_COLOR } from "../constants/styling";
import AccountIcon from "../icons/AccountIcon";
import BrandingIcon from "../icons/BrandingIcon";
import DrawerHideIcon from "../icons/DrawerHideIcon";
import Drawer from "./Drawer";
import IconButton from "./IconButton";

interface IProps {
  children: JSX.Element | JSX.Element[];
}

function PageLayout(props: IProps) {
  const { children } = props;
  const navigate = useNavigate();

  return (
    <>
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: `2px solid ${APP_BACKGROUND_COLOR}`,
        }}
      >
        <Toolbar
          sx={{
            bgcolor: "Background",
            display: "flex",
            gap: 2,
          }}
        >
          <IconButton disabled icon={<DrawerHideIcon />} title="Hide sidebar" />
          <Box
            component="button"
            onClick={() => navigate(APP_ROUTES.homepage.path)}
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
          <IconButton
            color="primary"
            disabled
            icon={<AccountIcon fontSize="large" />}
            title="Manage Account"
          />
        </Toolbar>
      </AppBar>

      <Drawer />
      <Box
        sx={{
          marginLeft: DRAWER_WIDTH,
        }}
      >
        <Toolbar />
        <Box p={4}>{children}</Box>
      </Box>
    </>
  );
}

export default PageLayout;
