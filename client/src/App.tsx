import { useContext } from "react";
import Login from "./pages/Login";
import AuthContext from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import Requests from "./pages/Requests";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={user ? <Chat/> : <Login/>} />
      <Route path="/login" element={user ? <Chat/> : <Login/>} />
      <Route path="/register" element={user ? <Chat/> : <Signup/>} />
      <Route path="/requests" element={<Requests/>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
