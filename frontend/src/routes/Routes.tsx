import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Auth from "@/pages/Auth";
import AuthLayout from "@/layouts/AuthLayout";
import Home from "@/pages/Home";
import PersistLogin from "@/layouts/PersistLogin";
import ResetPassword from "@/pages/ResetPassword";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/auth",
          element: <Auth />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
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
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
