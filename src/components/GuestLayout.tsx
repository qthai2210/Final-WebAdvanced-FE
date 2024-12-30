//import { useState } from "react";
import { Outlet } from "react-router-dom";
//import { GuestSidebar } from "./GuestSidebar";

const GuestLayout = () => {
  //const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* <GuestSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} /> */}
      <main className="flex-1 h-full overflow-y-auto">
        <div className="container mx-auto py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default GuestLayout;
