import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types/types";
import { postRequest, baseUrl, getUserById } from "../utils/services";
import AuthContext from "./AuthContext";

interface ChatContextProps {
  friends: User[] | null;
  friendRequests: User[];
  setFriends: Dispatch<SetStateAction<User[] | null>>;
  currentChatUser: User | null;
  setCurrentChatUser: Dispatch<User | null>;
}

export const ChatContext = createContext<ChatContextProps>({
  friends: null,
  friendRequests: [],
  setFriends: () => {},
  currentChatUser: null,
  setCurrentChatUser: () => {},
});

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<User[] | null>(null);
  const [currentChatUser, setCurrentChatUser] = useState<User | null>(null);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getFriends = async () => {
      if (!user) return; // no point in getting friends of a nonexistent user
      const response = await postRequest(
        `${baseUrl}/users/friends`,
        JSON.stringify({ userId: user._id })
      );
      if (response.error) {
        return console.log("Error fetching users", response);
      }

      setFriends(response);
      console.log(friends);
    };
    getFriends();
  }, [user?._id]);

  useEffect(() => {
    const getFriendRequests = async () => {
      if (!user || !user.pendingRequests) return;

      const requestsData = await Promise.all(
        user.pendingRequests.map(async (pendingFriendRequestId) => {
          const response = await getUserById(pendingFriendRequestId);
          if (response.error) {
            console.error(response);
          }
          return response;
        })
      );

      setFriendRequests(requestsData);
    };

    getFriendRequests();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{ friends, setFriends, friendRequests, currentChatUser, setCurrentChatUser }}
    >
      {children}
    </ChatContext.Provider>
  );
};
