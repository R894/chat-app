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
  currentChat: User | null;
  setCurrentChat: Dispatch<User | null>;
}

export const ChatContext = createContext<ChatContextProps>({
  friends: null,
  setFriends: () => {},
  currentChat: null,
  setCurrentChat: () => {},
});

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<User[] | null>(null);
  const [currentChat, setCurrentChat] = useState<User | null>(null);
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
      value={{ friends, setFriends, currentChat, setCurrentChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};
