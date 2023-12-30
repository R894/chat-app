import { useContext, FC } from "react";
import { User } from "../types/types";
import { ChatContext } from "../context/ChatContext";
import Avatar from "./Avatar";
import { useLocation, useNavigate } from "react-router-dom";

interface UserCardProps {
  user: User;
  online?: boolean;
  onClick?: () => void;
}

const UserCard: FC<UserCardProps> = ({ user, online, onClick }) => {
  const { setCurrentChatUser } = useContext(ChatContext);
  const location = useLocation();
  const navigate =  useNavigate();
  
  const handleClick = () => {
    if(location.pathname != '/'){
      navigate("/")
    }
    setCurrentChatUser(user);
  };
  return (
    <div
      className="flex gap-2 hover:bg-base-100 p-1 rounded-md hover:cursor-pointer"
      onClick={onClick ? onClick : handleClick}
    >
      <Avatar name={user.name} online={online} />
      <p>{user.name}</p>
    </div>
  );
};

export default UserCard;
