import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { postRequest, baseUrl, getRequest } from "../../utils/services";
import AuthContext from "../../context/AuthContext";
import { Message } from "../../types/types";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const Chatbox = () => {
  const { user } = useContext(AuthContext);
  const { currentChatUser } = useContext(ChatContext);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>();
  const [text, setText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("sendMessage", text);
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!user || !currentChatId || text === "") return;

    const response = await postRequest(
      `${baseUrl}/messages/`,
      JSON.stringify({ chatId: currentChatId, senderId: user._id, text: text })
    );
    if (!response || response.error) {
      return console.error("Error sending message", response);
    }
    setText("");
  };

  useEffect(() => {
    if (!user || !currentChatUser) return;
    const getChatId = async (userId: string, friendId: string) => {
      const response = await postRequest(
        `${baseUrl}/chats/`,
        JSON.stringify({ firstId: userId, secondId: friendId })
      );
      setIsChatLoading(false);
      if (!response || response.error) {
        return console.error("Error creating chat", response);
      }
      setCurrentChatId(response._id);
    };
    getChatId(user._id, currentChatUser._id);
    console.log("current chat", currentChatId);
  }, [user, currentChatUser, currentChatId]);

  useEffect(() => {
    const getMessages = async () => {
      if (!currentChatUser || !currentChatId || !user) return;

      setIsChatLoading(true);

      console.log(`${baseUrl}/messages/${currentChatId}`);
      const response = await getRequest(`${baseUrl}/messages/${currentChatId}`);
      if (!response || response.error) {
        return console.log("error", response);
      } else {
        setMessages(response);
      }
      setIsChatLoading(false);
    };
    getMessages();
    console.log(messages);
  }, [currentChatId, user, currentChatUser]);
  
  return (
    <>
      {currentChatUser && messages ? (
        <div className="flex flex-col justify-between flex-grow">
          <ChatHeader user={currentChatUser} />

          {currentChatId === messages[0].message.chatId && <MessageList messages={messages} />}

          <ChatInput
            text={text}
            handleInputChange={handleInputChange}
            handleInputKeyDown={handleInputKeyDown}
          />
        </div>
      ) : (
        <div className="flex flex-grow justify-center items-center">
          {isChatLoading ? 'Loading...' : ''}
        </div>
      )}
    </>
  );

};

export default Chatbox;
