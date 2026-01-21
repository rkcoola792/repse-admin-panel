import { useState } from "react";
import "./App.css";
import AdminPanel from "./components/adminPanel.jsx";
import AdminLogin from "./components/adminLogin.jsx";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.user.user);
  return <div className="App">{user ? <AdminPanel /> : <AdminLogin />}</div>;
}

export default App;
