export default interface Notification {
  id?: string;
  chatId: string;
  keywords: string[];
  message: string;
  notificationDate: Date;
  subscriberId: string;
}
