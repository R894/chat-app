import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { addFriend } from "../utils/services";

const AddFriend = () => {
  const [text, setText] = useState("");
  const { user } = useContext(AuthContext);

  const handleSendFriendRequest = async () => {
    if (!user) return;

    const response = addFriend(user?._id, text);
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
