import MuiButton, { ButtonProps } from "@mui/material/Button";

function Button(props: ButtonProps) {
  const { sx, ...rest } = props;

  return (
    <MuiButton
      variant="contained"
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
