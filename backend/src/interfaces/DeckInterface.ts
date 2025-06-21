export default interface Deck {
  chatIds: string[];
  createdDate: Date;
  deckTemplateId?: string;
  id: string;
  isActive: boolean;
  keywords: string[];
  lastNotificationDate: Date;
  subscriberId: string;
  title: string;
  updatedDate: Date;
}
