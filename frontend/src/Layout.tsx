import { NavbarCompo } from "./components/navbarcompo";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

function Layout() {
  return (
    <div>
      <NavbarCompo />
      <Toaster position="top-right" duration={3000} />
      <Outlet />
    </div>
  );
}

export default Layout;
