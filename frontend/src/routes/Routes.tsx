import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Auth from "@/pages/Auth";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Auth />,
      },
    ],
  },
]);

export default router;
