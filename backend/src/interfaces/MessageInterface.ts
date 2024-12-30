interface Message {
  id: string;
  chatId: string;
  createdDate: Date;
  chatUsername: string;
  editedDate: Date | null;
  forwardCount: number;
  messageId: string;
  text: string;
  updatedDate: Date;
  viewCount: number;
}

export default Message;
