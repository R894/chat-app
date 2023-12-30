import { User } from "../../types/types";

const ChatHeader = ({ user }: { user: User }) => (
  <div className="nav shadow-md p-3 flex gap-2">
    <div className="avatar placeholder">
      <div className="bg-neutral text-neutral-content rounded-full w-6">
        <span className="text-xs">{user.name[0].toUpperCase()}</span>
      </div>
    </div>
    <p>{user.name}</p>
  </div>
);

export default ChatHeader;
