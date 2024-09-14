import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import ThemeContextProvider from "./context/ThemeContext.jsx";
import "./index.css";

import AuthProvider from "./context/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeContextProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
