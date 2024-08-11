import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "../api/axios";

export default function Register() {
    const REGISTER_URL = "/api/auth/register";
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
        confirmPassword: ""
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
        if (credentials.password !== credentials.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post(REGISTER_URL, JSON.stringify(credentials), {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                toast.success(response.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
            }

            setIsSubmitting(true);
            setCredentials({
                username: "",
                password: "",
                confirmPassword: ""
            });
            setIsSubmitting(false);
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <main className="bg-blue-50 h-screen flex items-center justify-center">
            <form className="w-80 mx-auto p-6 bg-white rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
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
                <Input
                    value={credentials.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className={`block w-full rounded-sm p-2 mb-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>}
                <Button
                    name={isSubmitting ? "Registering..." : "Register"}
                    type="submit"
                    className="bg-blue-500 text-white block w-full rounded-sm p-2 mt-4 hover:bg-blue-600"
                    disabled={isSubmitting}
                />
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
