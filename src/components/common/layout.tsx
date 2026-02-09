import { Outlet } from "react-router";
import Footer from "./footer";
import Navbar from "./navbar";

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
