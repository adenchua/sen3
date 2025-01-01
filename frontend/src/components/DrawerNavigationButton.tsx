import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { ReactElement } from "react";
import { useLocation, useNavigate } from "react-router";

interface IProps {
  icon: ReactElement;
  text: string;
  link: string;
  isDisabled?: boolean;
}

function DrawerNavigationButton(props: IProps) {
  const { icon, text, link, isDisabled = false } = props;
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <MenuItem
      sx={{
        px: 3,
        py: 2,
        borderRadius: "8px",
        color: "text.secondary",
        "&.Mui-selected": {
          color: "primary.main",
        },
      }}
      selected={location.pathname === link}
      disabled={isDisabled}
      onClick={() => navigate(link)}
    >
      {icon}
      <Typography ml={2}>{text}</Typography>
    </MenuItem>
  );
}

export default DrawerNavigationButton;
