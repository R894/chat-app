const Login = () => {
    return (
      <div className="flex h-screen">
        <div className="container flex justify-center items-center">
          <div className="bg-base-200 min-w-72 p-4 flex flex-col shadow-md">
            <h1 className="text text-center font-bold pb-2">Login</h1>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text text-xs">Email</span>
              </div>
              <input
                type="email"
                className="input input-bordered bg-base-300 rounded-none h-8 border-none w-full"
              />
            </label>
            <label className="form-control w-full pb-4">
              <div className="label">
                <span className="label-text text-xs">Password</span>
              </div>
              <input
                type="password"
                className="input input-bordered bg-base-300 rounded-none h-8 border-none w-full"
              />
            </label>
            <p className="text-xs pb-1">No account? <a href="">Sign up</a></p>
            <button className="btn btn-primary text-white">Continue</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;
  