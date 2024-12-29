import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { api } from "../../utils/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAppDispatch } from "@/redux/store";
import { setLogIn } from "@/redux/features/authSlics";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ResetPasswordContext } from "@/context/ResetPasswordContext";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Invalid password" }),
});

type Inputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { setResetPassword } = useContext(ResetPasswordContext);
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(loginSchema) });

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async function (data: Inputs) {
      const response = await api.post<AuthPayload>("/api/auth/login", data, {
        withCredentials: true,
      });
      return response;
    },
    onSuccess: function ({ data }) {
      toast.success("successfully logged in");
      dispatch(setLogIn(data));
      navigate("/");
    },
    onError: function (error: AxiosError<{ message: string }>) {
      let message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data);
  };

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Label htmlFor="email">Email</Label>
      <Input
        {...register("email")}
        id="email"
        className={`dark:ring-1 ${errors.email && "border-red-500 ring-0"}`}
        placeholder="Enter your email"
        type="email"
      />
      {errors.email && (
        <p className="text-red-600 text-sm">{errors.email.message}</p>
      )}

      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Input
          {...register("password")}
          id="password"
          className={`dark:ring-1 ${
            errors.password && "border-red-500 ring-0"
          }`}
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
        />
        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </div>
      </div>
      {errors.password && (
        <p className="text-red-600 text-sm">{errors.password.message}</p>
      )}

      <Button
        type="button"
        className="text-right text-blue-500 bg-transparent outline-none hover:bg-transparent self-end shadow-none"
        onClick={() => {
          setResetPassword(true);
          navigate("/reset-password");
        }}
      >
        Forgot password?
      </Button>
      <Button className="bg-blue-500 text-white hover:bg-blue-600">
        Login
      </Button>
    </form>
  );
}
