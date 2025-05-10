import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { PRIMARY_COLOR } from "./constants/styling.ts";

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
    },
    text: {
      primary: PRIMARY_COLOR,
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
