import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Auth from "@/pages/Auth";
import AuthLayout from "@/layouts/AuthLayout";
import Home from "@/pages/Home";
import PersistLogin from "@/layouts/PersistLogin";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        element: <PersistLogin />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                index: true,
                element: <Home />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
