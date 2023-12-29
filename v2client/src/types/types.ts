export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string | null;
}
export interface Message {
  message: {
    _id: string;
    chatId: string
    senderId: string;
    text: string;
    createdAt: string;
    updatedAt: string;
  }
  userName: string;
}
