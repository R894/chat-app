import { useContext } from "react";
import UserCard from "./UserCard";
import { ChatContext } from "../context/ChatContext";

const FriendRequestsList = () => {
  const {friendRequests} = useContext(ChatContext);

  return (
    <div className="flex flex-col w-full">
        <div className="nav shadow-md p-3 flex gap-2">
          Friend Requests
        </div>
        <div className="p-4">
          {friendRequests.length > 0 ? (
            friendRequests.map((request, index) => (
              <div
                key={index}
                className="flex items-center gap-2"
              >
                <UserCard user={request}/>
                <div className="flex gap-1">
                  <button className="btn btn-sm btn-success">Accept</button>
                  <button className="btn btn-sm">Decline</button>
                </div>
              </div>
            ))
          ) : (
            <p>You have no pending friend requests...</p>
          )}
        </div>
      </div>
  );
};

export default FriendRequestsList;
