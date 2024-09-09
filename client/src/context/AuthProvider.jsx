import { createContext, useState } from "react";

export const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        accessToken: "",
        user: ""
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}