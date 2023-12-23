const Chatbox = () => {
  return (
    <div className="flex flex-col justify-between flex-grow">
      <div className="nav shadow-md p-3">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-6">
            <span className="text-xs">U</span>
          </div>
        </div>
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
