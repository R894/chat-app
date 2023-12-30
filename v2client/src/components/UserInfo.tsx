import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import UserCard from "./UserCard";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

const Userinfo = () => {
  const { user, setUser } = useContext(AuthContext);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/login')
  };

  const copyIdHandler = () => {
    if (!user) return;

    navigator.clipboard.writeText(user._id);
    setAlertMessage("Copied to clipboard");

    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  return (
    <div className="bg-base-300 p-2 py-4 flex  items-center justify-between">
      {user && <UserCard user={user} onClick={copyIdHandler} online={true} />}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-6 hover:cursor-pointer"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
        onClick={logoutHandler}
      >
        <path
          fillRule="evenodd"
          d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
        />
        <path
          fillRule="evenodd"
          d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
        />
      </svg>
      {alertMessage && <Alert message={alertMessage} />}
    </div>
  );
};

export default Userinfo;
