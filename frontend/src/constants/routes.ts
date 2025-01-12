interface AppRouteFeatureFlag {
  path: string;
  isActive: boolean;
}

type Page = "homepage" | "chatsPage" | "subscribersPage" | "registrantsPage";

const APP_ROUTES: Record<Page, AppRouteFeatureFlag> = {
  homepage: { path: "/", isActive: true },
  chatsPage: { path: "/manage-chats", isActive: true },
  subscribersPage: { path: "/manage-subscribers", isActive: false },
  registrantsPage: { path: "/manage-registrants", isActive: true },
};

export default APP_ROUTES;
