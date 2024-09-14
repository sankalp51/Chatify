import router from "./routes/Routes.jsx";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import useTheme from "./hooks/useTheme.js";

export default function App() {
  const { theme } = useTheme();
  return (
    <>
      <Toaster
        position="bottom-right"
        richColors
        theme={theme === "light" ? "light" : "dark"}
      />
      <RouterProvider router={router} />
    </>
  );
}
