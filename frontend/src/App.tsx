import { BrowserRouter, Routes, Route } from "react-router";

import DashboardsPage from "./pages/DashboardsPage";
import ChatsPage from "./pages/ChatsPage";
import APP_ROUTES from "./constants/routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.homepage} element={<DashboardsPage />} />
        <Route path={APP_ROUTES.chatsPage} element={<ChatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
