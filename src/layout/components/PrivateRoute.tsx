import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  console.log("check authentication");
  //   const authed = localStorage.getItem("userId");
  const authed = true; // todo

  return authed ? <Outlet /> : <Navigate to={{ pathname: "/login" }} />;
};

export default PrivateRoute;
