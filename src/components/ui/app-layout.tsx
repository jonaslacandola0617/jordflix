import { Outlet } from "react-router";
import Navbar from "@/components/ui/navbar";

function AppLayout() {
  return (
    <div className="relative w-full h-full">
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
