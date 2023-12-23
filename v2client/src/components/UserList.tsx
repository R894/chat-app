import UserCard from "./UserCard";

const UserList = () => {
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
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
        <UserCard username="test" />
      </div>
    </div>
  );
};

export default UserList;
