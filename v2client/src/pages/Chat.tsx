import Chatbox from "../components/Chatbox";
import Userinfo from "../components/UserInfo";
import UserList from "../components/UserList";
import { User } from "../types/types";

const Chat = () => {
  const testUser: User = { name: "test", email: "test", id: "test" };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col bg-base-200">
        <UserList />
        <Userinfo />
      </div>
      <Chatbox user={testUser} />
    </div>
  );
};

export default Chat;
