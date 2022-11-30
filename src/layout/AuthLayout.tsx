import { Outlet } from "react-router-dom";
import Header from "./components/Header";

type AuthLayoutProps = {};

const AuthLayout = (props: AuthLayoutProps) => {
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

export default AuthLayout;
