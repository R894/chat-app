import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { api } from "../utils/services";

const AddFriend = () => {
  const [text, setText] = useState("");
  const { user } = useContext(AuthContext);

  const handleSendFriendRequest = async () => {
    if (!user || !user.token) return;

    const response = api.addFriend(user._id, text, user.token);
    if (!response) {
      console.error("Something went wrong");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        className="input input-sm bg-base-200"
        placeholder="Friend code"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="btn btn-sm btn-primary"
        onClick={handleSendFriendRequest}
      >
        Send friend request
      </button>
    </div>
  );
};

export default AddFriend;
