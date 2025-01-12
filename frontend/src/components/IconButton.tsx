import MuiIconButton, { IconButtonProps } from "@mui/material/IconButton";
import { JSX } from "react";

import Tooltip from "./Tooltip";

interface IProps extends IconButtonProps {
  title: string;
  icon: JSX.Element;
}

export default function IconButton(props: IProps) {
  const { title, icon, ...rest } = props;
  return (
    <MuiIconButton {...rest}>
      <Tooltip title={title}>{icon}</Tooltip>
    </MuiIconButton>
  );
}
