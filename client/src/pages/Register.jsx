import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "../api/axios";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

export default function Register() {
    const REGISTER_URL = "/api/auth/register";
    const [credentials, setCredentials] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        if (!credentials.fullName) newErrors.fullName = "Full Name is required";
        if (!credentials.username) newErrors.username = "Username is required";
        if (!credentials.password) newErrors.password = "Password is required";
        if (credentials.password !== credentials.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        if (!credentials.gender) newErrors.gender = "Gender is required";
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
                fullName: "",
                username: "",
                password: "",
                confirmPassword: "",
                gender: ""
            });
            setIsSubmitting(false);
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <main className="bg-base-200 min-h-screen flex items-center justify-center">
            <form className="w-full max-w-md p-8 bg-base-100 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Register</h2>
                <Input
                    value={credentials.fullName}
                    onChange={handleChange}
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className={`input input-bordered w-full mb-2 ${errors.fullName ? 'input-error' : ''}`}
                />
                {errors.fullName && <p className="text-error text-sm mb-2">{errors.fullName}</p>}
                <Input
                    value={credentials.username}
                    onChange={handleChange}
                    type="text"
                    name="username"
                    placeholder="Username"
                    className={`input input-bordered w-full mb-2 ${errors.username ? 'input-error' : ''}`}
                />
                {errors.username && <p className="text-error text-sm mb-2">{errors.username}</p>}

                <div className="relative mb-2">
                    <Input
                        value={credentials.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
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

                <div className="relative mb-2">
                    <Input
                        value={credentials.confirmPassword}
                        onChange={handleChange}
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-xl"
                    >
                        {showConfirmPassword ? <IoEye /> : <IoMdEyeOff />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="text-error text-sm mb-2">{errors.confirmPassword}</p>}

                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={credentials.gender === "Male"}
                                onChange={handleChange}
                                className="radio radio-primary"
                            />
                            <span className="ml-2">Male</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={credentials.gender === "Female"}
                                onChange={handleChange}
                                className="radio radio-primary"
                            />
                            <span className="ml-2">Female</span>
                        </label>
                    </div>
                    {errors.gender && <p className="text-error text-sm mt-2">{errors.gender}</p>}
                </div>

                <Button
                    name={isSubmitting ? "Registering..." : "Register"}
                    type="submit"
                    className="btn btn-primary w-full mt-4"
                    disabled={isSubmitting}
                />
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
