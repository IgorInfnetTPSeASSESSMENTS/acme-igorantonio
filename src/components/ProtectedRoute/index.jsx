import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


// eslint-disable-next-line react/prop-types
function ProtectedRoute({ element, roleRequired }) {
  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/login" />;
  }

  return element;
}

export default ProtectedRoute;
