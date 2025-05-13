import MuiIconButton, { IconButtonProps } from "@mui/material/IconButton";
import { JSX } from "react";

import Tooltip from "./Tooltip";

interface IProps extends Omit<IconButtonProps, "variant"> {
  title: string;
  icon: JSX.Element;
  variant?: "standard" | "outlined";
}

export default function IconButton(props: IProps) {
  const { title, icon, variant = "standard", sx, ...rest } = props;
  return (
    <MuiIconButton
      sx={
        variant === "outlined"
          ? {
              border: "1px solid",
              borderRadius: "4px",
              borderColor: "divider",
              ...sx,
            }
          : sx
      }
      {...rest}
    >
      <Tooltip title={title}>{icon}</Tooltip>
    </MuiIconButton>
  );
}
