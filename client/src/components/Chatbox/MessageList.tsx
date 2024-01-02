import { useContext } from "react";
import { Message } from "../../types/types";
import MessageComponent from "../Message";
import { ChatContext } from "../../context/ChatContext";

const MessageList = ({ messages }: { messages: Message[] }) => {
  const {isChatLoading} = useContext(ChatContext);

  if (!messages) {
    return;
  }

  return (
    <div className="flex-grow p-3 overflow-y-auto">
      {!isChatLoading? messages.map((message, index) => (
        <MessageComponent
          key={index}
          name={message.userName}
          content={message.message.text}
        />
      )): 'Loading...'}
    </div>
  );
};

export default MessageList;
