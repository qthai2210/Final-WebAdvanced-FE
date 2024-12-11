import { RouteObject } from "react-router-dom";
// import LoginPage from "../pages/LoginPage";
// import DashboardPage from "../pages/DashboardPage";
// import Layout from "../components/Layout";
// import ProtectedRoute from "./ProtectedRoute";

import { UserRoutes } from "./UserRoute";
import { AdminRoutes } from "./AdminRoutes";

export const routes: RouteObject[] = [...UserRoutes, ...AdminRoutes];
