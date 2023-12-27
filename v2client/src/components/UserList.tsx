import { useContext } from "react";
import UserCard from "./UserCard";
import { ChatContext } from "../context/ChatContext";

const UserList = () => {
  const {friends} = useContext(ChatContext)
  
  return (
    <div className="p-4 flex-grow max-h-screen overflow-hidden">
      <input
        className="text-xs w-full p-2 bg-base-300 rounded-md"
        placeholder="Find or start a conversation"
      />
      <button className="btn w-full hover:bg-base-100 justify-start">
        Friends
      </button>
      <div className="overflow-auto h-full">
      {friends?.map((friend) => (
          <div key={friend._id}>
            <UserCard user={friend} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
