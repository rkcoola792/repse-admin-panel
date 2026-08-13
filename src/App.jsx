import { useEffect, useState } from "react";
import "./App.css";
import AdminPanel from "./components/adminPanel.jsx";
import AdminLogin from "./components/adminLogin.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/userSlice";
import api from "./api/axios";

function App() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [checkingSession, setCheckingSession] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      if (!user) {
        setCheckingSession(false);
        return;
      }
      try {
        const res = await api.get("/me");
        if (cancelled) return;
        if (res.data.role !== "admin") {
          setAuthMessage("This account doesn't have admin access.");
          dispatch(logout());
        }
      } catch (error) {
        if (cancelled) return;
        setAuthMessage("Your session has expired. Please sign in again.");
        dispatch(logout());
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    };

    verifySession();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="App">
      {user && user.role === "admin" ? (
        <AdminPanel />
      ) : (
        <AdminLogin authMessage={authMessage} />
      )}
    </div>
  );
}

export default App;
