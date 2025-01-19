import MuiSwitch, { SwitchProps } from "@mui/material/Switch";

export default function Switch(props: SwitchProps) {
  const { sx, ...rest } = props;

  return (
    <MuiSwitch
      sx={{
        padding: 1,
        "& .MuiSwitch-track": {
          borderRadius: "11px",
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "16px",
            height: "16px",
          },
          "&::before": {
            backgroundImage: (theme) =>
              `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
              )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: "12px",
          },
          "&::after": {
            backgroundImage: (theme) =>
              `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
              )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: "12px",
          },
        },
        "& .MuiSwitch-thumb": {
          boxShadow: "none",
          width: "16px",
          height: "16px",
          margin: "2px",
        },
        ...sx,
      }}
      {...rest}
    />
  );
}
