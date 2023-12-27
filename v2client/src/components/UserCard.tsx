import { useContext } from "react";
import { User } from "../types/types";
import { ChatContext } from "../context/ChatContext";

const UserCard = ({user}:{user:User}) => {
  const {setCurrentChat} = useContext(ChatContext)
  
  return (
    <div className="flex gap-2 hover:bg-base-100 p-2 rounded-md" onClick={() => setCurrentChat(user)}>
      <div className="avatar placeholder online">
        <div className="bg-neutral text-neutral-content rounded-full w-6">
          <span className="text-xs">{user.name[0].toUpperCase()}</span>
        </div>
      </div>
      <p>{user.name}</p>
    </div>
  );
};

export default UserCard;
