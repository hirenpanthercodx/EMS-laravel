import Login from "../page/Auth/Login";
import NotFound from "../page/Auth/NotFound";
import Dashboard from "../page/index";
import Calendar from "../page/Calendar/index";
import Employee from "../page/Employee/EmployeeDashboard";
import EmployeePage from "../page/Employee/EmployeeDetail";

const routes = [
  {
    path: "/",
    exact: true,
    element: Dashboard,
  },
  {
    path: "/dashboard",
    exact: true,
    element: Dashboard,
  },
  {
    path: "/calendar",
    exact: true,
    element: Calendar,
  },
  {
    path: "/employee",
    exact: true,
    element: Employee,
  },
  {
    path: "/employee/create",
    exact: true,
    element: EmployeePage,
  },
  {
    path: "/employee/edit/:id",
    exact: true,
    element: EmployeePage,
  },
  {
    path: "/login",
    exact: true,
    auth: true,
    element: Login,
  },
  {
    path: "*",
    exact: true,
    // auth: true,
    element: NotFound,
  }
];

export default routes;
