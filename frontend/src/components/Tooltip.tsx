import MuiTooltip, { TooltipProps } from "@mui/material/Tooltip";

export default function Tooltip(props: TooltipProps) {
  return <MuiTooltip disableInteractive arrow {...props} />;
}
