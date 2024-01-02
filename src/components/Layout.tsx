import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
    return (
      <div className={"m-10 ml-20 mr-20 font-sans"}>
          <Toaster />
          <Outlet />
      </div>
    );
}