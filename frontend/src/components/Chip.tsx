import MuiChip, { ChipProps } from "@mui/material/Chip";

export default function Chip(props: ChipProps) {
  const { sx, ...rest } = props;

  return <MuiChip sx={{ borderRadius: 2, ...sx }} {...rest} />;
}
