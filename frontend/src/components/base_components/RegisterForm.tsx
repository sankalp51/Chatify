import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Spinner from "./Spinner";

const registerSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Invalid password" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password is required" }),
    profilePic: z.instanceof(File).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidFile, setIsValidFile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate } = useMutation({
    mutationFn: async function (data: RegisterData) {
      setIsSubmitting(true);
      const res = await api.post<{ message: string }>(
        "/api/auth/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    },
    onSuccess: function (res) {
      toast.success(res.data.message);
      setIsSubmitting(false);
      reset();
    },
    onError(err: AxiosError<{ message: string }>) {
      setIsSubmitting(false);
      toast.error(err.response?.data.message);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      setIsValidFile(false);
      return;
    }
    setValue("profilePic", file);
    setIsValidFile(true);
  };
  const onSubmit: SubmitHandler<RegisterData> = (data) => {
    if (isValidFile) {
      mutate(data);
    }
    return;
  };

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fname">First Name</Label>
          <Input
            {...register("firstName")}
            type="text"
            id="fname"
            placeholder="Enter your first name"
            className={`dark:ring-1 ${
              errors.firstName && "border-red-500 ring-0"
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lname">Last Name</Label>
          <Input
            {...register("lastName")}
            type="text"
            id="lname"
            placeholder="Enter your last name"
            className={`dark:ring-1 ${
              errors.lastName && "border-red-500 ring-0"
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email")}
          type="email"
          id="email"
          placeholder="Enter your email"
          className={`dark:ring-1 ${errors.email && "border-red-500 ring-0"}`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            className={`dark:ring-1 ${
              errors.password && "border-red-500 ring-0"
            }`}
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cpassword">Confirm Password</Label>
        <div className="relative">
          <Input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            id="cpassword"
            placeholder="Confirm Password"
            className={`dark:ring-1 ${
              errors.confirmPassword && "border-red-500 ring-0"
            }`}
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>Add profile picture</Label>
        <Input
          type="file"
          id="profile-pic"
          accept="image/*"
          className={`dark:ring-1 ${!isValidFile && "border-red-500 ring-0"}`}
          onChange={handleFileChange}
        />
        {!isValidFile && (
          <p className="text-red-500 text-sm">Please choose a valid image</p>
        )}
      </div>
      <Button
        type="submit"
        className={`w-full mt-4 bg-blue-500 text-white hover:bg-blue-600 ${
          isSubmitting && "bg-blue-600"
        }`}
      >
        {isSubmitting ? <Spinner /> : "Register"}
      </Button>
    </form>
  );
}
