import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "./routes/Routes";
import useTheme from "./hooks/useTheme";

export default function App() {
  const { theme } = useTheme();
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        richColors
        position="bottom-right"
        duration={3000}
        theme={theme}
      />
    </>
  );
}
