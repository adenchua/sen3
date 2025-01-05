import MuiButton, { ButtonProps } from "@mui/material/Button";

function Button(props: ButtonProps) {
  const { sx, ...rest } = props;

  return (
    <MuiButton
      disableElevation
      disableFocusRipple
      disableRipple
      disableTouchRipple
      sx={{ textTransform: "none", borderRadius: 50, ...sx }}
      {...rest}
    />
  );
}

export default Button;
