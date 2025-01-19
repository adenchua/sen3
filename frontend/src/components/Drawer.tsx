import MuiDrawer from "@mui/material/Drawer";
import MenuList from "@mui/material/MenuList";
import Toolbar from "@mui/material/Toolbar";

import DrawerNavigationButton from "../components/DrawerNavigationButton";
import DRAWER_WIDTH from "../constants/drawerWidth";
import APP_ROUTES from "../constants/routes";
import ChatsPageIcon from "../icons/ChatsPageIcon";
import LandingPageIcon from "../icons/LandingPageIcon";
import RegistrantsPageIcon from "../icons/RegistrantPageIcon";
import SubscribersPageIcon from "../icons/SubscribersPageIcon";

function Drawer() {
  return (
    <MuiDrawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          border: "none",
          p: 1,
        },
      }}
    >
      <Toolbar />
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
