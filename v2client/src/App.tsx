import Chatbox from "./components/Chatbox";
import Userinfo from "./components/UserInfo";
import UserList from "./components/UserList";

function App() {
  return (
    <div className="flex h-screen">
      <div className="w-1/12 flex flex-col justify-between bg-base-200">
        <UserList />
        <Userinfo/>
      </div>
      <Chatbox />
    </div>
  );
}

export default App;
