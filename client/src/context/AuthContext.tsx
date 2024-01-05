import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { User } from "../types/types";
import { api } from "../utils/services";

interface AuthContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  updateUser: ()=>void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  updateUser: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateUser = useCallback(async () => {
    if(!user || !user.token) return;
    const response = await api.getUserById(user._id, user.token)

    if(!response){
      localStorage.removeItem("user")
      setUser(null)
      return;
    }
    
    const userWithKey = {...response, token: user.token}
    console.log("Updating...", userWithKey)
    setUser(userWithKey)
    console.log(user)
    localStorage.setItem("user", JSON.stringify(userWithKey) )
    
  }, [user])

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
