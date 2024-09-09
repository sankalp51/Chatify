import router from './routes/Routes.jsx';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect, useState } from "react";

export default function App() {
  const [currentTheme, setCurrentTheme] = useState("");

  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setCurrentTheme(theme);
    };

    // Update theme on initial load
    updateTheme();

    // Create a MutationObserver to listen for changes to the 'data-theme' attribute
    const observer = new MutationObserver(() => {
      updateTheme();
    });

    // Observe changes to the `data-theme` attribute on the documentElement (root)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Cleanup function to disconnect the observer when the component unmounts
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Toaster position="bottom-right" richColors theme={currentTheme === 'light' ? 'light' : 'dark'} />
      <RouterProvider router={router} />
    </>
  );
}
