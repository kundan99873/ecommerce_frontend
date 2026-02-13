import PageLoader from "@/components/common/pageLoader";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

const ProtectedRoute = lazy(() => import("./protectedRouter"));
const ProtectedAdminRoute = lazy(() => import("./protectedAdminRouter"));

const Layout = lazy(() => import("@/components/common/layout"));
const AdminLayout = lazy(() => import("@/components/admin/common/layout"));

const Home = lazy(() => import("@/pages/home"));
const Products = lazy(() => import("@/pages/product/products"));
const ProductDetail = lazy(() => import("@/pages/product/productDetails"));
const Cart = lazy(() => import("@/pages/user/cart"));

const Login = lazy(() => import("@/pages/auth/login"));
const Register = lazy(() => import("@/pages/auth/register"));
const ForgotPassword = lazy(() => import("@/pages/auth/forgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/resetPassword"));

const Checkout = lazy(() => import("@/pages/user/checkout"));
const Orders = lazy(() => import("@/pages/order/orders"));
const OrderDetail = lazy(() => import("@/pages/order/orderDetail"));
const Wishlist = lazy(() => import("@/pages/user/wishlist"));
const Profile = lazy(() => import("@/pages/user/profile"));

const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/products"));
const AdminCategories = lazy(() => import("@/pages/admin/categories"));
const AdminOrders = lazy(() => import("@/pages/admin/orders"));
const AdminUsers = lazy(() => import("@/pages/admin/users"));
const AdminAnalytics = lazy(() => import("@/pages/admin/analytics"));
const AdminAddProduct = lazy(() => import("@/pages/admin/addProduct"));

const NotFound = lazy(() => import("@/pages/notFound"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "products", Component: Products },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },

      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },

      {
        Component: ProtectedRoute,
        children: [
          { path: "checkout", Component: Checkout },
          { path: "orders", Component: Orders },
          { path: "order/:id", Component: OrderDetail },
          { path: "wishlist", Component: Wishlist },
          { path: "profile", Component: Profile },
        ],
      },
    ],
  },
  {
    path: "/admin/",
    Component: AdminLayout,
    children: [
      {
        Component: ProtectedAdminRoute,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "products", Component: AdminProducts },
          { path: "products/add", Component: AdminAddProduct },
          { path: "categories", Component: AdminCategories },
          { path: "orders", Component: AdminOrders },
          { path: "users", Component: AdminUsers },
          { path: "analytics", Component: AdminAnalytics },
        ],
      },
    ],
  },

  { path: "*", Component: NotFound },
]);

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
