import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/context/authContext";
import PageLoader from "@/components/common/pageLoader";

const ProtectedRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRouter;
