import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Chatbox = () => {
  const { currentChat } = useContext(ChatContext);
  return (
    <>
      {currentChat ? (
        <div className="flex flex-col justify-between flex-grow">
          <div className="nav shadow-md p-3 flex gap-2">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-6">
                <span className="text-xs">
                  {currentChat.name[0].toUpperCase()}
                </span>
              </div>
            </div>
            <p>{currentChat.name}</p>
          </div>

          <div className="p-4">
            <input
              type="text"
              placeholder="Type here..."
              className="input input-bordered w-full border focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-grow justify-center items-center">Idk some main menu or something</div>
      )}
    </>
  );
};

export default Chatbox;
