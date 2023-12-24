import { useContext, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";
import AuthContext from "../context/AuthContext";

const LoginForm = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const handleClick = async () => {
    try {
      setisLoading(true);
      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify({ email, password })
      );
      if (response.error) {
        console.log(response.error);
        return;
      }
      setUser(response);
      console.log("Logged in as:", response);
    } catch (err) {
      console.error("An error occurred:", err);
    } finally{
      setisLoading(false)
    }
  };

  return (
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="form-control w-full pb-4">
          <div className="label">
            <span className="label-text text-xs">Password</span>
          </div>
          <input
            type="password"
            className="input input-bordered bg-base-300 rounded-none h-8 border-none w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <p className="text-xs pb-1">
          No account?{" "}
          <a href="/" className="text-accent">
            Sign up
          </a>
        </p>
        <button className="btn btn-primary text-white" onClick={handleClick}>
          {isLoading ? "Loading" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
