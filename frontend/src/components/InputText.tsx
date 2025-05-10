import MuiTextField, { TextFieldProps } from "@mui/material/TextField";
import { SECONDARY_BACKGROUND_COLOR } from "../constants/styling";
import { JSX } from "react";

interface IProps extends Omit<TextFieldProps<"standard">, "label"> {
  endAdornment?: JSX.Element;
  label: string;
}

export default function InputText(props: IProps) {
  const { endAdornment, label, ...rest } = props;

  return (
    <MuiTextField
      size="small"
      label={label}
      slotProps={{
        input: {
          sx: {
            borderRadius: "8px",
            bgcolor: SECONDARY_BACKGROUND_COLOR,
            minWidth: "240px",
          },
          endAdornment,
        },
      }}
      {...rest}
    />
  );
}
