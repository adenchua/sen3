import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

import DrawerNavigationButton from "../components/DrawerNavigationButton";
import DRAWER_WIDTH from "../constants/drawerWidth";
import APP_ROUTES from "../constants/routes";
import BrandingIcon from "../icons/BrandingIcon";
import ChatsPageIcon from "../icons/ChatsPageIcon";
import LandingPageIcon from "../icons/LandingPageIcon";
import RegistrantsPageIcon from "../icons/RegistrantPageIcon";
import SubscribersPageIcon from "../icons/SubscribersPageIcon";

function Drawer() {
  const navigate = useNavigate();

  return (
    <MuiDrawer
      variant="permanent"
      slotProps={{
        paper: {
          sx: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
            p: 1,
          },
        },
      }}
    >
      <Box
        component="button"
        onClick={() => navigate(APP_ROUTES.homepage.path)}
        sx={{
          all: "unset",
          p: 2,
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
      <MenuList>
        <DrawerNavigationButton
          icon={<LandingPageIcon />}
          text="Dashboard"
          link={APP_ROUTES.homepage.path}
          isDisabled={!APP_ROUTES.homepage.isActive}
        />
        <DrawerNavigationButton
          icon={<ChatsPageIcon />}
          text="Chats"
          link={APP_ROUTES.chatsPage.path}
          isDisabled={!APP_ROUTES.chatsPage.isActive}
        />
        <DrawerNavigationButton
          icon={<SubscribersPageIcon />}
          text="Subscribers"
          link={APP_ROUTES.subscribersPage.path}
          isDisabled={!APP_ROUTES.subscribersPage.isActive}
        />
        <DrawerNavigationButton
          icon={<RegistrantsPageIcon />}
          text="Approve Registrants"
          link={APP_ROUTES.registrantsPage.path}
          isDisabled={!APP_ROUTES.registrantsPage.isActive}
        />
      </MenuList>
    </MuiDrawer>
  );
}

export default Drawer;
