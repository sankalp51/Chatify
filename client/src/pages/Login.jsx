import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { toast } from "sonner";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function Login() {
    const LOGIN_URI = "/api/auth/login";
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
    const { setAuth } = useAuth();
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value
        }));

        // Clear error for the field being modified
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ""
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!credentials.username) newErrors.username = "Username is required";
        if (!credentials.password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                const response = await axios.post(LOGIN_URI, JSON.stringify(credentials), {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                const accessToken = response?.data?.accessToken;
                const user = response?.data?.user;
                setAuth({ accessToken, user });
                toast.success("Successfully logged in");
                navigate(from, { replace: true });
            } catch (error) {
                toast.error(error.response.data.message);
            }
            setCredentials({
                username: "",
                password: ""
            });
            setIsSubmitting(false);
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <main className="bg-blue-50 h-screen flex items-center justify-center">
            <form className="w-80 mx-auto p-6 bg-white rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <Input
                    value={credentials.username}
                    onChange={handleChange}
                    type="text"
                    name="username"
                    placeholder="Username"
                    className={`block w-full rounded-sm p-2 mb-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.username && <p className="text-red-500 text-sm mb-2">{errors.username}</p>}
                <Input
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={`block w-full rounded-sm p-2 mb-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}
                <Button
                    name={isSubmitting ? "Logging in..." : "Login"}
                    type="submit"
                    className="bg-blue-500 text-white block w-full rounded-sm p-2 mt-4 hover:bg-blue-600"
                    disabled={isSubmitting}
                />
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
