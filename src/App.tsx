import { Routes, Route } from "react-router-dom";
import AuthLayout from "layout/AuthLayout";
import DashboardLayout from "layout/DashboardLayout";
import Login from "pages/auth/Login";
import Register from "pages/auth/Register";
import Dashboard from "pages/dashboard/Dashboard";
import PrivateRoute from "layout/components/PrivateRoute";
import { Navigate } from "react-router-dom";
import UsersManager from "components/UserManager/UsersManager";

function App() {
  return (
    <div className="App mx-auto max-w-6xl text-center my-8">
      <div>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<UsersManager />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
