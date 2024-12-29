import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { api } from "@/utils/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function ResetPassword() {
  const [steps, setSteps] = useState({
    isEmailProvided: false,
    isOtpVerified: false,
    isPasswordReset: false,
  });
  const [email, setEmail] = useState({
    value: "",
    error: "",
  });
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = async () => {
    try {
      if (email.value.trim() === "") {
        setEmail((prevState) => {
          return {
            ...prevState,
            error: "Please enter a valid email",
          };
        });
        return;
      }
      const response = await api.post<{ message: string }>(
        "/api/forgot-password/verify-email",
        { email: email.value }
      );
      toast.success(response.data.message);
      setSteps((prev) => ({ ...prev, isEmailProvided: true }));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data.message);
      }
    }
  };

  const handleOtpSubmit = () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    console.log("OTP submitted:", otp);
    setSteps((prev) => ({ ...prev, isOtpVerified: true }));
  };

  const handlePasswordReset = () => {
    if (password.trim() === "" || confirmPassword.trim() === "") {
      alert("Please fill out all password fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Simulate password reset (API call)
    console.log("Password reset successfully:", password);
    setSteps((prev) => ({ ...prev, isPasswordReset: true }));
  };

  return (
    <section className="w-full h-[calc(100vh-90px)] flex justify-center items-center gap-4">
      <div className="flex flex-col gap-6 w-full px-4">
        {/* Email Input Step */}
        {!steps.isEmailProvided && (
          <div className="w-full">
            <Input
              type="email"
              placeholder="Enter your registered email"
              value={email.value}
              style={{ border: email.error && "1px solid red" }}
              onChange={(e) =>
                setEmail((prevState) => {
                  return {
                    ...prevState,
                    value: e.target.value,
                    error: "",
                  };
                })
              }
              className="w-full border rounded-lg p-2"
            />
            {email.error && <span className="text-red-500">{email.error}</span>}
            <button
              onClick={handleEmailSubmit}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Submit Email
            </button>
          </div>
        )}

        {/* OTP Verification Step */}
        {steps.isEmailProvided && !steps.isOtpVerified && (
          <>
            <h1 className="text-center text-2xl font-semibold">
              Enter Verification Code
            </h1>
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={setOtp}
            >
              <div className="flex justify-center items-center gap-4 m-auto">
                <InputOTPGroup>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-12 h-12 border rounded-lg text-center text-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ))}
                </InputOTPGroup>
              </div>
            </InputOTP>
            <button
              onClick={handleOtpSubmit}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Verify OTP
            </button>
            <p className="text-center text-sm">
              Didn&apos;t receive a code?{" "}
              <button className="text-blue-600 font-medium hover:underline">
                Resend Code
              </button>
            </p>
          </>
        )}

        {/* Password Reset Step */}
        {steps.isOtpVerified && !steps.isPasswordReset && (
          <>
            <h1 className="text-center text-2xl font-semibold">
              Reset Your Password
            </h1>
            <Input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2 mt-2"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg p-2 mt-2"
            />
            <button
              onClick={handlePasswordReset}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Reset Password
            </button>
          </>
        )}

        {/* Password Reset Confirmation Step */}
        {steps.isPasswordReset && (
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-green-600">
              Password Reset Successful
            </h1>
            <p className="text-lg mt-4">
              You can now log in with your new password.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
