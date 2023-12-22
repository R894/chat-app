function App() {
  return (
    <div className="flex h-screen">
      <div className="w-1/12 flex flex-col justify-between bg-primary-content p-4">
        Users
        <div className="">
          User info and config
        </div>
      </div>
      <div className="flex flex-col justify-between flex-grow p-4">
        Chat
        <input type="text" placeholder="Type here..." className="input input-bordered w-full">
        </input>
      </div>
    </div>
  );
}

export default App;
