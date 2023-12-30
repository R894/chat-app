import FriendRequestsList from "../components/FriendRequestsList";
import Userinfo from "../components/UserInfo";
import UserList from "../components/UserList";

const Requests = () => {
        return (
          <div className="flex h-screen">
            <div className="flex flex-col bg-base-200">
              <UserList/>
              <Userinfo/>
            </div>
            <FriendRequestsList/>
          </div>
        );
};
 
export default Requests;