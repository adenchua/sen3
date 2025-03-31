import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import APP_ROUTES from "./constants/routes";
import ChatsPage from "./pages/ChatsPage";
import DashboardsPage from "./pages/DashboardsPage";
import RegistrantsPage from "./pages/RegistrantsPage";
import SubscribersPage from "./pages/SubscribersPage";
import SubscriberDetailsPage from "./pages/SubscriberDetailsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={APP_ROUTES.homepage.path} element={<DashboardsPage />} />
          <Route path={APP_ROUTES.chatsPage.path} element={<ChatsPage />} />
          <Route path={APP_ROUTES.registrantsPage.path} element={<RegistrantsPage />} />
          <Route path={APP_ROUTES.subscribersPage.path} element={<SubscribersPage />} />
          <Route path={APP_ROUTES.subscriberDetailsPage.path} element={<SubscriberDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
