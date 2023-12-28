import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
      <div className={"m-10 ml-20 mr-20 font-sans"}>
          <Outlet />
      </div>
    );
}