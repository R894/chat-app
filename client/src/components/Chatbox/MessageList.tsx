import { useContext, useEffect, useRef } from "react";
import { Message } from "../../types/types";
import MessageComponent from "../Message";
import { ChatContext } from "../../context/ChatContext";

const MessageList = ({ messages }: { messages: Message[] }) => {
  const {isChatLoading} = useContext(ChatContext);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isChatLoading]);

  if (!messages) {
    return;
  }

  return (
    <div ref={messageListRef} className="flex-grow p-3 overflow-y-auto">
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
