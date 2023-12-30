import Chatbox from "../components/Chatbox/Chatbox";
import Userinfo from "../components/UserInfo";
import UserList from "../components/UserList";

const Chat = () => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col bg-base-200">
        <UserList />
        <Userinfo />
      </div>
      <Chatbox />
    </div>
  );
};

export default Chat;
