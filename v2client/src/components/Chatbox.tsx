import { User } from "../types/types";

const Chatbox = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-col justify-between flex-grow">
      <div className="nav shadow-md p-3 flex gap-2">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-6">
            <span className="text-xs">{user.name[0].toUpperCase()}</span>
          </div>
        </div>
        <p>{user.name}</p>
      </div>

      <div className="p-4">
        <input
          type="text"
          placeholder="Type here..."
          className="input input-bordered w-full border focus:outline-none"
        />
      </div>
    </div>
  );
};

export default Chatbox;
