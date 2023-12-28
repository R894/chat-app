import { useContext, FC } from "react";
import { User } from "../types/types";
import { ChatContext } from "../context/ChatContext";
import Avatar from "./Avatar";

interface UserCardProps {
  user: User;
  online?: boolean;
}

const UserCard: FC<UserCardProps> = ({ user, online }) => {
  const { setCurrentChat } = useContext(ChatContext);

  return (
    <div
      className="flex gap-2 hover:bg-base-100 p-2 rounded-md"
      onClick={() => setCurrentChat(user)}
    >
      <Avatar name={user.name} online={online} />
      <p>{user.name}</p>
    </div>
  );
};

export default UserCard;
