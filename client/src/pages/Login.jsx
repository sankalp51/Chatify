import { useEffect, useState, useRef } from "react";
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
  const { auth, setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    if (auth?.accessToken) {
      navigate(from, { replace: true });
    }
  }, [auth?.accessToken, navigate, from]);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
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
        const response = await axios.post(
          LOGIN_URI,
          JSON.stringify(credentials),
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        const accessToken = response?.data?.accessToken;
        const user = response?.data?.user;
        setAuth({
          accessToken,
          user,
          id: response?.data?.id,
          profilePic: response?.data?.profilePic,
        });
        toast.success("Successfully logged in");
        navigate(from, { replace: true });
      } catch (error) {
        toast.error(error.response.data.message);
      }
      setCredentials({
        username: "",
        password: "",
      });
      setIsSubmitting(false);
    } else {
      setErrors(newErrors);
      // Set focus to the first input with an error
      if (newErrors.username) {
        usernameRef.current.focus();
      } else if (newErrors.password) {
        passwordRef.current.focus();
      }
    }
  };

  return (
    <main className="bg-base-200 min-h-screen flex items-center justify-center">
      <form
        className="w-full max-w-md p-8 bg-base-100 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Login
        </h2>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <Input
            id="username"
            ref={usernameRef}
            value={credentials.username}
            onChange={handleChange}
            type="text"
            name="username"
            placeholder="Enter your username"
            aria-describedby={errors.username ? "username-error" : null}
            aria-invalid={!!errors.username}
            className={`input input-bordered w-full ${
              errors.username ? "input-error" : ""
            }`}
          />
          {errors.username && (
            <p id="username-error" className="text-error text-sm mt-1">
              {errors.username}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              ref={passwordRef}
              value={credentials.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              aria-describedby={errors.password ? "password-error" : null}
              aria-invalid={!!errors.password}
              className={`input input-bordered w-full ${
                errors.password ? "input-error" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-xl"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoEye /> : <IoMdEyeOff />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-error text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>
        <Button
          name={isSubmitting ? "Logging in..." : "Login"}
          type="submit"
          className="btn btn-primary w-full mt-4"
          disabled={isSubmitting}
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
