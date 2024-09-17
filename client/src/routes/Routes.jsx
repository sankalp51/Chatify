import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RequireAuth from "../layouts/RequireAuth";
import HomePage from "../pages/Home";
import PersistLogin from "../layouts/PersistLogin";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <PersistLogin />, 
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "signup",
            element: <Register />,
          },
          // Protected routes
          {
            element: <RequireAuth />,
            children: [
              {
                index: true,
                path: "/",
                element: <HomePage />,
              },
            ],
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

export default router;
