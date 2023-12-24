import { useContext } from "react";
import UserCard from "./UserCard";
import AuthContext from "../context/AuthContext";

const Userinfo = () => {
    const {user} = useContext(AuthContext)
    return ( <div className="bg-base-300 p-2">
        {user && <UserCard username={user?.name}/>}
    </div> );
}
 
export default Userinfo;