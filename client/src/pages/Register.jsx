import Input from "../components/Input";
import Button from "../components/Button";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "../api/axios";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const REGISTER_URL = "/api/auth/register";
  const [credentials, setCredentials] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const fullNameRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const genderRef = useRef();

  useEffect(() => {
    fullNameRef.current.focus();
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
    if (!credentials.fullName) newErrors.fullName = "Full Name is required";
    if (!credentials.username) newErrors.username = "Username is required";
    if (!credentials.password) newErrors.password = "Password is required";
    if (!credentials.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (credentials.password !== credentials.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!credentials.gender) newErrors.gender = "Gender is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          REGISTER_URL,
          JSON.stringify(credentials),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success(response.data.message);
        setCredentials({
          fullName: "",
          username: "",
          password: "",
          confirmPassword: "",
          gender: "",
        });
        navigate("/login");
      } catch (error) {
        toast.error(error.response.data.message);
      }
      setIsSubmitting(false);
    } else {
      setErrors(newErrors);
      if (newErrors.fullName) {
        fullNameRef.current.focus();
      } else if (newErrors.username) {
        usernameRef.current.focus();
      } else if (newErrors.password) {
        passwordRef.current.focus();
      } else if (newErrors.confirmPassword) {
        confirmPasswordRef.current.focus();
      } else if (newErrors.gender) {
        genderRef.current.focus();
      }
    }
  };

  return (
    <main className="bg-base-200 min-h-screen flex items-center justify-center mt-10 pt-16">
      <form
        className="w-full max-w-md p-8 bg-base-100 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Register
        </h2>
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <Input
            id="fullName"
            ref={fullNameRef}
            value={credentials.fullName}
            onChange={handleChange}
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            aria-describedby={errors.fullName ? "fullName-error" : null}
            aria-invalid={!!errors.fullName}
            className={`input input-bordered w-full ${
              errors.fullName ? "input-error" : ""
            }`}
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-error text-sm mt-1">
              {errors.fullName}
            </p>
          )}
        </div>
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
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              ref={confirmPasswordRef}
              value={credentials.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : null
              }
              aria-invalid={!!errors.confirmPassword}
              className={`input input-bordered w-full ${
                errors.confirmPassword ? "input-error" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-xl"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <IoEye /> : <IoMdEyeOff />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-error text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <fieldset className="mb-4">
          <legend className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </legend>
          <div
            ref={genderRef}
            className="flex items-center space-x-4"
            role="radiogroup"
            aria-describedby={errors.gender ? "gender-error" : null}
          >
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={credentials.gender === "Male"}
                onChange={handleChange}
                className="radio radio-primary"
                aria-checked={credentials.gender === "Male"}
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
                aria-checked={credentials.gender === "Female"}
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
          {errors.gender && (
            <p id="gender-error" className="text-error text-sm mt-1">
              {errors.gender}
            </p>
          )}
        </fieldset>
        <Button
          name={isSubmitting ? "Registering..." : "Register"}
          type="submit"
          className="btn btn-primary w-full mt-4"
          disabled={isSubmitting}
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
