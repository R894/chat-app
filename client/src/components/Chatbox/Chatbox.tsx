import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import AuthContext from "../../context/AuthContext";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const Chatbox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChatUser,
    isChatLoading,
    currentChatId,
    sendMessage,
    messages,
  } = useContext(ChatContext);
  const [text, setText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!user || !currentChatUser) {
        return;
      }
      console.log("sendMessage", text);
      sendMessage(text, user._id, currentChatId, setText);
    }
  };

  return (
    <>
      {currentChatUser && messages ? (
        <div className="flex flex-col justify-between flex-grow">
          <ChatHeader user={currentChatUser} />

          {messages[0]?.message.chatId === currentChatId && (
            <MessageList messages={messages} />
          )}

          <ChatInput
            text={text}
            handleInputChange={handleInputChange}
            handleInputKeyDown={handleInputKeyDown}
          />
        </div>
      ) : (
        <div className="flex flex-grow justify-center items-center">
          {isChatLoading ? "Loading..." : ""}
        </div>
      )}
    </>
  );
};

export default Chatbox;
