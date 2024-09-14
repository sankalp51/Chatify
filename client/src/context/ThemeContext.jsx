import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
  theme: "",
});

export default function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setTheme(theme);
    };

    updateTheme();

    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);
  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
}
