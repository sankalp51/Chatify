import { useEffect, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { toast } from "sonner";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

export default function Login() {
    const LOGIN_URI = "/api/auth/login";
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
    const { auth, setAuth } = useAuth(); // Destructure auth to check authentication state
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // If the user is already authenticated, redirect them
        if (auth?.accessToken) {
            navigate(from, { replace: true });
        }
    }, [auth, navigate, from]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value
        }));

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
                setAuth({ accessToken, user, id: response?.data?.id, profilePic: response?.data?.profilePic });
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
        <main className="bg-base-200 min-h-screen flex items-center justify-center">
            <form className="w-full max-w-md p-8 bg-base-100 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Login</h2>
                <Input
                    value={credentials.username}
                    onChange={handleChange}
                    type="text"
                    name="username"
                    placeholder="Username"
                    className={`input input-bordered w-full mb-2 ${errors.username ? 'input-error' : ''}`}
                />
                {errors.username && <p className="text-error text-sm mb-2">{errors.username}</p>}
                <div className="relative">
                    <Input
                        value={credentials.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className={`input input-bordered w-full mb-2 ${errors.password ? 'input-error' : ''}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-xl"
                    >
                        {showPassword ? <IoEye /> : <IoMdEyeOff />}
                    </button>
                </div>
                {errors.password && <p className="text-error text-sm mb-2">{errors.password}</p>}
                <Button
                    name={isSubmitting ? "Logging in..." : "Login"}
                    type="submit"
                    className="btn btn-primary w-full mt-4"
                    disabled={isSubmitting}
                />
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
