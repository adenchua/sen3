import CssBaseline from "@mui/material/CssBaseline";
import { orange } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { APP_BACKGROUND_COLOR } from "./constants/styling.ts";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[500],
    },
    background: {
      default: APP_BACKGROUND_COLOR,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
