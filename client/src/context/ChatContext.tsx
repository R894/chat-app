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
import { Socket, io } from "socket.io-client";

interface OnlineUser {
  userId: string;
  socketId: string;
}

interface ChatContextProps {
  friends: User[];
  friendRequests: User[];
  setFriendRequests: Dispatch<SetStateAction<User[]>>;
  setFriends: Dispatch<SetStateAction<User[]>>;
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
  onlineUsers: OnlineUser[];
}

export const ChatContext = createContext<ChatContextProps>({
  friends: [],
  friendRequests: [],
  setFriendRequests: () => {},
  setFriends: () => {},
  currentChatUser: null,
  setCurrentChatUser: () => {},
  sendMessage: async () => {},
  isChatLoading: false,
  messages: [],
  currentChatId: "",
  setMessages: () => {},
  onlineUsers: [],
});

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [currentChatUser, setCurrentChatUser] = useState<User | null>(null);
  const [currentChatId, setCurrentChatId] = useState("");
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, setUser } = useContext(AuthContext);

  const SOCKET_EVENTS = {
    getMessage: "getMessage",
    getOnlineUsers: "getOnlineUsers",
    addNewUser: "addNewUser",
  };

  const initializeSocket = () => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return newSocket;
  };

  const setupSocketListeners = useCallback(
    (socket: Socket | null) => {
      if (!socket) return;

      socket.on(SOCKET_EVENTS.getMessage, (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on(SOCKET_EVENTS.getOnlineUsers, (users) => {
        setOnlineUsers(users);
      });
    },
    [SOCKET_EVENTS.getMessage, SOCKET_EVENTS.getOnlineUsers]
  );

  const getFriends = useCallback(async () => {
    try {
      if (!user) return;

      const response = await postRequest(
        `${baseUrl}/users/friends`,
        JSON.stringify({ userId: user._id }),
        user.token
      );
      if(response.error){
        // This is a very bad way to check if the user is still authorized
        localStorage.removeItem("user")
        setUser(null)
      }
      if (response && !response.error) {
        setFriends(response);
      }
    } catch (error) {
      console.error("Error in getFriends:", error);
    }
  }, [user]);

  const getChatId = useCallback(async () => {
    try {
      if (!user || !currentChatUser || !user.token) return;

      const response = await api.getChatId(
        user._id,
        currentChatUser._id,
        user.token
      );
      if (response) {
        setCurrentChatId(response._id);
      }
    } catch (error) {
      console.error("Error in getChatId:", error);
    }
  }, [currentChatUser, user]);

  useEffect(() => {
    const newSocket = initializeSocket();
    setupSocketListeners(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, setupSocketListeners]);

  const getFriendRequests = useCallback(async () => {
    try {
      if (!user || !user.pendingRequests) return;

      const requestsData = await Promise.all(
        user.pendingRequests.map(async (pendingFriendRequestId) => {
          try {
            if (!user.token) return;
            const response = await api.getUserById(
              pendingFriendRequestId,
              user.token
            );

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
  }, [user]);

  const getMessages = useCallback(async () => {
    try {
      if (!currentChatId || !currentChatUser || !user || !user.token) return;
      setIsChatLoading(true);
      const response = await api.getMessages(currentChatId, user.token);

      if (response) {
        setMessages(response);
      }
    } catch (error) {
      console.error("Error in getMessages:", error);
    } finally {
      setIsChatLoading(false);
    }
  }, [currentChatId, user, currentChatUser]);

  useEffect(() => {
    if (socket === null || !user) return;
    socket.emit(SOCKET_EVENTS.addNewUser, user._id);
  }, [socket, user, SOCKET_EVENTS.addNewUser]);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  useEffect(() => {
    getChatId();
  }, [getChatId]);

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_EVENTS.getMessage, (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off(SOCKET_EVENTS.getMessage);
    };
  }, [socket, SOCKET_EVENTS.getMessage]);

  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_EVENTS.getOnlineUsers, (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.off(SOCKET_EVENTS.getOnlineUsers);
    };
  }, [socket, SOCKET_EVENTS.getOnlineUsers]);

  const sendMessage = useCallback(
    async (
      text: string,
      senderId: string,
      currentChatId: string,
      setText: (text: string) => void
    ) => {
      try {
        if (!text || !socket || !currentChatUser || !user?.token) return;
        const response = await api.sendMessage(currentChatId, senderId, text, user.token);
        setText("");
        if (response) {
          setMessages((prevMessages) => [...prevMessages, response]);
          socket.emit("sendMessage", {
            ...response,
            recipientId: currentChatUser._id,
          });
        }
      } catch (error) {
        console.error("Error in sendMessage:", error);
      }
    },
    [currentChatUser, socket]
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
        currentChatId,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
