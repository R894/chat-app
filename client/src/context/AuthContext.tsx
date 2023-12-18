import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { baseUrl, postRequest } from "../utils/services";

interface AuthInterface {
  user: UserInfo | null;
  registerInfo: RegisterInfo;
  updateRegisterInfo: (info: RegisterInfo) => void;
  updateLoginInfo: (info: LoginInfo) => void;
  registerUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loginUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  registerError: RegisterError;
  loginError: RegisterError;
  isRegisterLoading: boolean;
  isLoginLoading: boolean;
  logoutUser: () => void;
  loginInfo: LoginInfo;
}

interface RegisterInfo {
  name: string | null;
  email: string | null;
  password: string | null;
}

interface LoginInfo {
  email: string | null;
  password: string | null;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface RegisterError {
  error: string | null;
  message: string | null;
}

export const AuthContext = createContext<AuthInterface>({
  user: {
    id: "",
    name: "",
    email: "",
    token: "",
  },
  registerInfo: {
    name: "",
    email: "",
    password: "",
  },
  loginInfo: {
    email: "",
    password: "",
  },
  updateRegisterInfo: () => {},
  updateLoginInfo: () => {},
  registerUser: async () => {},
  loginUser: async () => {},
  registerError: { error: null, message: null },
  loginError: { error: null, message: null },
  isRegisterLoading: false,
  isLoginLoading: false,
  logoutUser: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [registerError, setRegisterError] = useState<RegisterError>({
    error: null,
    message: null,
  });
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState<RegisterError>({
    error: null,
    message: null,
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const updateRegisterInfo = useCallback((info: RegisterInfo) => {
    setRegisterInfo(info);
  }, []);
  const updateLoginInfo = useCallback((info: LoginInfo) => {
    setLoginInfo(info);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const registerUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError({ error: null, message: null });
      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );
      setIsRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }

      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const loginUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError({ error: null, message: null });

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );
      setIsLoginLoading(false);
        
      if (response.error) {
        return setLoginError(response);
      }
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        updateLoginInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        isLoginLoading,
        logoutUser,
        loginInfo,
        loginUser,
        loginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
