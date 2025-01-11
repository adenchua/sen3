interface Subscriber {
  id: string;
  allowNotifications: boolean;
  firstName: string;
  isApproved: boolean;
  lastName?: string;
  registeredDate: Date;
  username?: string;
}

export default Subscriber;
