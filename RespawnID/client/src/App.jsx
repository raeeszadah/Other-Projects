import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import GameLibrary from "./pages/GameLibrary";
import Sales from "./pages/Sales";
import Achievements from "./pages/Achievements";
import Messages from "./pages/Messages";
import Discover from "./pages/Discover";
import DashboardLayout from "./components/DashboardLayout";
import LibraryBridge from "./components/LibraryBridge";
import ProtectedRoute from "./components/ProtectedRoute";
import { FavoritesProvider } from "./context/FavoritesContext";
import { GamesProvider } from "./context/GamesContext";
import { ProfileProvider } from "./context/ProfileContext";
import { SocketProvider } from "./context/SocketContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:username" element={<PublicProfile />} />
          <Route path="/coming-soon" element={<Navigate to="/dashboard" replace />} />
          <Route
            element={
              <ProtectedRoute>
                <ProfileProvider>
                  <SocketProvider>
                    <GamesProvider>
                      <FavoritesProvider>
                        <LibraryBridge />
                        <DashboardLayout />
                      </FavoritesProvider>
                    </GamesProvider>
                  </SocketProvider>
                </ProfileProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:userId" element={<Messages />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/library" element={<GameLibrary />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/achievements" element={<Achievements />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
