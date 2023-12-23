const UserCard = ({username}:{username:string}) => {
  return (
    <div className="flex gap-2 hover:bg-base-100 p-2 rounded-md">
      <div className="avatar placeholder online">
        <div className="bg-neutral text-neutral-content rounded-full w-6">
          <span className="text-xs">{username[0].toUpperCase()}</span>
        </div>
      </div>
      <p>{username}</p>
    </div>
  );
};

export default UserCard;
