import { Outlet } from "react-router-dom";
import Header from "./components/Header";

type DashboardLayoutProps = {};

const DashboardLayout = (props: DashboardLayoutProps) => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
