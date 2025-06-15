interface AppRouteFeatureFlag {
  path: string;
  isActive: boolean;
}

type Page =
  | "homepage"
  | "chatsPage"
  | "deckTemplatesPage"
  | "subscribersPage"
  | "registrantsPage"
  | "subscriberDetailsPage";

const APP_ROUTES: Record<Page, AppRouteFeatureFlag> = {
  homepage: { path: "/", isActive: true },
  chatsPage: { path: "/manage-chats", isActive: true },
  subscribersPage: { path: "/manage-subscribers", isActive: true },
  subscriberDetailsPage: { path: "/manage-subscribers/:id", isActive: true },
  registrantsPage: { path: "/manage-registrants", isActive: true },
  deckTemplatesPage: { path: "/deck-templates", isActive: true },
};

export default APP_ROUTES;
