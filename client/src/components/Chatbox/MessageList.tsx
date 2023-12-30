import { Message } from "../../types/types";
import MessageComponent from "../Message";

const MessageList = ({ messages }: { messages: Message[] }) => {
  if (!messages) {
    return;
  }

  return (
    <div className="flex-grow p-3 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageComponent
          key={index}
          name={message.userName}
          content={message.message.text}
        />
      ))}
    </div>
  );
};

export default MessageList;
