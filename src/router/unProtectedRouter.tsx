import PageLoader from "@/components/common/pageLoader";
import { useAuth } from "@/context/authContext";
import { Navigate, Outlet, useLocation } from "react-router";

const UnProtectedRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  return <Outlet />;
};

export default UnProtectedRouter;
