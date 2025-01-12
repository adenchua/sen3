export default interface SubscriberInterface {
  id: string;
  allowNotifications: boolean;
  firstName: string;
  isApproved: boolean;
  registeredDate: string;
  lastName: string | null;
  username: string | null;
}
