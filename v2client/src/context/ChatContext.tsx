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
import { postRequest, baseUrl } from "../utils/services";
import AuthContext from "./AuthContext";

interface ChatContextProps {
  friends: User[] | null;
  setFriends: Dispatch<SetStateAction<User[] | null>>;
  currentChatUser: User | null;
  setCurrentChatUser: Dispatch<User | null>;
}

export const ChatContext = createContext<ChatContextProps>({
  friends: null,
  setFriends: () => {},
  currentChatUser: null,
  setCurrentChatUser: () => {},
});

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<User[] | null>(null);
  const [currentChatUser, setCurrentChatUser] = useState<User | null>(null);
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

  return (
    <ChatContext.Provider
      value={{ friends, setFriends, currentChatUser, setCurrentChatUser }}
    >
      {children}
    </ChatContext.Provider>
  );
};
