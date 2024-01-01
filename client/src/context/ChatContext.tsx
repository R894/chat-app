import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Message, User } from "../types/types";
import { postRequest, baseUrl, api } from "../utils/services";
import AuthContext from "./AuthContext";

interface ChatContextProps {
  friends: User[] | null;
  friendRequests: User[];
  setFriendRequests: Dispatch<SetStateAction<User[]>>;
  setFriends: Dispatch<SetStateAction<User[] | null>>;
  currentChatUser: User | null;
  setCurrentChatUser: Dispatch<User | null>;
  currentChatId: string;
  sendMessage: (
    text: string,
    senderId: string,
    currentChatId: string,
    setText: (text: string) => void
  ) => Promise<void>;
  isChatLoading: boolean;
  messages: Message[];
  setMessages: Dispatch<Message[]>;
}

export const ChatContext = createContext<ChatContextProps>({
  friends: null,
  friendRequests: [],
  setFriendRequests: () => {},
  setFriends: () => {},
  currentChatUser: null,
  setCurrentChatUser: () => {},
  sendMessage: async () => {},
  isChatLoading: false,
  messages: [],
  currentChatId:'',
  setMessages: () => {},
});

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<User[] | null>(null);
  const [currentChatUser, setCurrentChatUser] = useState<User | null>(null);
  const [currentChatId, setCurrentChatId] = useState("");
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getFriends = async () => {
      try {
        if (!user) return;

        const response = await postRequest(
          `${baseUrl}/users/friends`,
          JSON.stringify({ userId: user._id })
        );

        if (!response.error) {
          setFriends(response);
        } else {
          console.log("Error fetching users", response);
        }
      } catch (error) {
        console.error("Error in getFriends:", error);
      }
    };

    getFriends();
  }, [user?._id]);

  useEffect(() => {
    const getChatId = async () => {
      try {
        if (!user || !currentChatUser) return;

        const response = await api.getChatId(user._id, currentChatUser._id);

        if (response && !response.error) {
          setCurrentChatId(response._id);
        } else {
          console.log("Error fetching current chat", response);
        }
      } catch (error) {
        console.error("Error in getChatId:", error);
      }
    };

    getChatId();
  }, [currentChatUser, user]);

  useEffect(() => {
    const getFriendRequests = async () => {
      try {
        if (!user || !user.pendingRequests) return;

        const requestsData = await Promise.all(
          user.pendingRequests.map(async (pendingFriendRequestId) => {
            try {
              const response = await api.getUserById(pendingFriendRequestId);

              if (!response.error) {
                return response;
              } else {
                console.error(response);
                return null;
              }
            } catch (error) {
              console.error("Error in getFriendRequests map:", error);
              return null;
            }
          })
        );

        const filteredRequestsData = requestsData.filter(Boolean);
        setFriendRequests(filteredRequestsData);
      } catch (error) {
        console.error("Error in getFriendRequests:", error);
      }
    };

    getFriendRequests();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (!currentChatId || !currentChatUser || !user) return;

        setIsChatLoading(true);

        const response = await api.getMessages(currentChatId);

        if (response) {
          setMessages(response);
        } else {
          console.log("Error getting messages:", response);
        }
      } catch (error) {
        console.error("Error in getMessages:", error);
      } finally {
        setIsChatLoading(false);
      }
    };

    getMessages();
  }, [currentChatId, currentChatUser, user]);

  const sendMessage = useCallback(
    async (
      text: string,
      senderId: string,
      currentChatId: string,
      setText: (text: string) => void
    ) => {
      try {
        if (!text) return;
        console.log("sending message...")
        const response = await api.sendMessage(currentChatId, senderId, text);

        if (!response) {
          console.log("Error sending message");
        } else {
          console.log("got response", response)
          setText("");
          setMessages((prevMessages) => [...prevMessages, response])
        }
      } catch (error) {
        console.error("Error in sendMessage:", error);
      }
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        friends,
        setFriends,
        friendRequests,
        setFriendRequests,
        currentChatUser,
        setCurrentChatUser,
        sendMessage,
        isChatLoading,
        messages,
        setMessages,
        currentChatId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
