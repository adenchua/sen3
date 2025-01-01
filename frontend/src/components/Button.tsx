import MuiButton, { ButtonProps } from "@mui/material/Button";

function Button(props: ButtonProps) {
  const { sx, ...rest } = props;

  return <MuiButton sx={{ textTransform: "none", ...sx }} {...rest} />;
}

export default Button;
