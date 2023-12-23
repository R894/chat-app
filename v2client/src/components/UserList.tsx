import UserCard from "./Usercard";

const UserList = () => {
  return (
    <div className="p-4">
      <input className="text-xs w-full p-2 bg-base-300 rounded-md" placeholder="Find or start a conversation"/>
      <button className="btn w-full hover:bg-base-100 justify-start">Friends</button>
      <UserCard username="test"/>
      <UserCard username="test"/>
      <UserCard username="test"/>
      <UserCard username="test"/>
    </div>
  );
};

export default UserList;
