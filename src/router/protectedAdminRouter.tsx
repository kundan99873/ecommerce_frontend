import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/context/authContext";
import PageLoader from "@/components/common/pageLoader";

const ProtectedAdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
