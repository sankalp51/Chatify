import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, useEffect } from "react";
import { api } from "@/utils/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/base_components/Spinner";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { ResetPasswordContext } from "@/context/ResetPasswordContext";

export default function ResetPassword() {
  const { resetPassword } = useContext(ResetPasswordContext);
  const navigate = useNavigate();
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
  const [otpError, setOtpError] = useState(false);
  const [password, setPassword] = useState({
    value: "",
    error: "",
  });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: "",
  });
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);

  useEffect(() => {
    if (!resetPassword) {
      navigate("/auth");
    }
  }, [resetPassword]);

  const handleEmailSubmit = async () => {
    try {
      if (email.value.trim() === "") {
        setEmail((prevState) => ({
          ...prevState,
          error: "Please enter a valid email",
        }));
        return;
      }
      setIsEmailVerifying(true);
      const response = await api.post("/api/forgot-password/verify-email", {
        email: email.value,
      });
      setIsEmailVerifying(false);
      toast.success(response.data.message);
      setSteps((prev) => ({ ...prev, isEmailProvided: true }));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setIsEmailVerifying(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      if (otp.length !== 6) {
        setOtpError(true);
        return;
      }
      const response = await api.post("/api/forgot-password/verify-otp", {
        otp,
        email: email.value,
      });
      toast.success(response.data.message);
      setSteps((prev) => ({ ...prev, isOtpVerified: true }));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (password.value.trim() === "" || confirmPassword.value.trim() === "") {
        setPassword((prevState) => {
          return {
            ...prevState,
            error: "Enter a valid Password",
          };
        });
        setConfirmPassword((prevState) => {
          return {
            ...prevState,
            error: "Passwords do not match",
          };
        });
        return;
      }
      if (password.value !== confirmPassword.value) {
        setPassword((prevState) => {
          return {
            ...prevState,
            error: "Passwords do not match",
          };
        });
        setConfirmPassword((prevState) => {
          return {
            ...prevState,
            error: "Passwords do not match",
          };
        });
        return;
      }

      if (password.value.length > 8 || confirmPassword.value.length > 8) {
        setPassword((prevState) => {
          return {
            ...prevState,
            error: "Password must be 8 characters long",
          };
        });
        setConfirmPassword((prevState) => {
          return {
            ...prevState,
            error: "Password must be 8 characters long",
          };
        });
      }
      const response = await api.patch("/api/forgot-password/reset-password", {
        email: email.value,
        newPassword: password.value,
        confirmNewPassword: confirmPassword.value,
      });
      toast.success(response.data.message);
      setSteps((prev) => ({ ...prev, isPasswordReset: true }));
      navigate("/auth");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleOtpSubmit();
    }
  }, [otp]);

  return (
    <section className="w-full h-[calc(100vh-90px)] flex justify-center items-center">
      <div className="flex flex-col gap-6 w-full max-w-md shadow-md rounded-lg p-6 bg-secondary">
        {/* Email Input Step */}
        {!steps.isEmailProvided && (
          <div className="w-full">
            <h1 className="text-2xl font-bold text-center mb-4">
              Forgot Password?
            </h1>
            <p className="text-sm text-center mb-6">
              Enter your registered email to receive a verification code.
            </p>
            <Input
              type="email"
              placeholder="Enter your registered email"
              value={email.value}
              style={{ border: email.error && "1px solid red" }}
              onChange={(e) =>
                setEmail((prevState) => ({
                  ...prevState,
                  value: e.target.value,
                  error: "",
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {email.error && (
              <span className="text-red-500 text-sm mt-1 block">
                {email.error}
              </span>
            )}
            <Button
              disabled={isEmailVerifying}
              onClick={handleEmailSubmit}
              className="mt-4 w-full bg-blue-500 py-3 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
            >
              {isEmailVerifying ? <Spinner /> : "Submit Email"}
            </Button>
          </div>
        )}

        {/* OTP Verification Step */}
        {steps.isEmailProvided && !steps.isOtpVerified && (
          <>
            <h1 className="text-2xl font-bold text-gray-700 text-center">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter the 6-digit code sent to your email.
            </p>
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={setOtp}
            >
              <div className="flex justify-center items-center gap-3 m-auto">
                <InputOTPGroup>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      style={{ border: otpError ? "1px solid red" : "" }}
                      key={index}
                      index={index}
                      className="w-12 h-12 border rounded-lg text-center text-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ))}
                </InputOTPGroup>
              </div>
              {otpError && (
                <span className="text-red-500 text-sm mt-2 block text-center">
                  Enter a valid OTP
                </span>
              )}
            </InputOTP>
            <p className="text-sm text-center mt-4">
              Didn&apos;t receive a code?{" "}
              <Button className="text-blue-600 font-medium hover:underline">
                Resend Code
              </Button>
            </p>
          </>
        )}

        {/* Password Reset Step */}
        {steps.isOtpVerified && !steps.isPasswordReset && (
          <>
            <h1 className="text-2xl font-bold text-gray-700 text-center">
              Reset Your Password
            </h1>
            <Input
              type="password"
              placeholder="Enter new password"
              value={password.value}
              style={{ border: password.error && "1px solid red" }}
              onChange={(e) =>
                setPassword((prevState) => {
                  return {
                    ...prevState,
                    value: e.target.value,
                  };
                })
              }
              className="w-full border rounded-lg p-3 mt-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {password.error && (
              <span className="text-red-500 text-sm mt-1 block">
                {password.error}
              </span>
            )}
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword.value}
              style={{ border: confirmPassword.error && "1px solid red" }}
              onChange={(e) =>
                setConfirmPassword((prevState) => {
                  return {
                    ...prevState,
                    value: e.target.value,
                  };
                })
              }
              className="w-full border rounded-lg p-3 mt-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {confirmPassword.error && (
              <span className="text-red-500 text-sm mt-1 block">
                {confirmPassword.error}
              </span>
            )}
            <Button
              onClick={handlePasswordReset}
              className="mt-6 w-full bg-blue-500 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Reset Password
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
