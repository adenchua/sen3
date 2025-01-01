import MuiDrawer from "@mui/material/Drawer";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";

import DrawerNavigationButton from "../components/DrawerNavigationButton";
import DRAWER_WIDTH from "../constants/drawerWidth";
import APP_ROUTES from "../constants/routes";
import ChatsPageIcon from "../icons/ChatsPageIcon";
import LandingPageIcon from "../icons/LandingPageIcon";
import SubscribersPageIcon from "../icons/SubscribersPageIcon";

function Drawer() {
  return (
    <MuiDrawer variant="permanent">
      <Toolbar />
      <Paper
        sx={{
          width: DRAWER_WIDTH,
          height: "100%",
          p: 1,
        }}
        square
      >
        <MenuList>
          <DrawerNavigationButton
            icon={<LandingPageIcon />}
            text="Dashboard"
            link={APP_ROUTES.homepage}
          />
          <DrawerNavigationButton
            icon={<ChatsPageIcon />}
            text="Chats"
            link={APP_ROUTES.chatsPage}
          />
          <DrawerNavigationButton
            icon={<SubscribersPageIcon />}
            text="Subscribers"
            link={APP_ROUTES.subscribersPage}
            isDisabled
          />
        </MenuList>
      </Paper>
    </MuiDrawer>
  );
}

export default Drawer;
