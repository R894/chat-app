import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message";
import { postRequest, baseUrl, getRequest } from "../utils/services";
import AuthContext from "../context/AuthContext";
interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
}

const Chatbox = () => {
  const { user } = useContext(AuthContext);
  const { currentChatUser } = useContext(ChatContext);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
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
      console.log(`${baseUrl}/messages/${currentChatId}`);
      const response = await getRequest(`${baseUrl}/messages/${currentChatId}`);
      if (!response || response.error) {
        return console.log("error", response);
      }
      setMessages(response);
    };
    getMessages();
    console.log(messages);
  }, [currentChatId, user, currentChatUser]);

  return (
    <>
      {currentChatUser ? (
        <div className="flex flex-col justify-between flex-grow">
          <div className="nav shadow-md p-3 flex gap-2">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-6">
                <span className="text-xs">
                  {currentChatUser.name[0].toUpperCase()}
                </span>
              </div>
            </div>
            <p>{currentChatUser.name}</p>
          </div>

          <div className="flex-grow p-3">
            {messages &&
              messages.map((message, index) => (
                <Message
                  key={index}
                  name={
                    message.senderId === user?._id // this feels like a really bad way to handle this
                      ? user.name
                      : currentChatUser.name
                  }
                  content={message.text}
                />
              ))}
          </div>

          <div className="p-4">
            <input
              type="text"
              placeholder="Type here..."
              className="input input-bordered w-full border focus:outline-none"
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              value={text}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-grow justify-center items-center">
          Idk some main menu or something
        </div>
      )}
    </>
  );
};

export default Chatbox;
