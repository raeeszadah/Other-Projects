import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
