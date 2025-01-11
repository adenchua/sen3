export default interface Deck {
  id?: string;
  subscriberId: string;
  chatIds: string[];
  createdDate: Date;
  isActive: boolean;
  keywords: string[];
  lastNotificationDate: Date;
  title: string;
}
