import LoginForm from "@/components/base_components/LoginForm";
import RegisterForm from "@/components/base_components/RegisterForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import useRefresh from "@/hooks/useRefresh";

export default function Auth() {
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const refresh = useRefresh();

  useEffect(() => {
    if (auth.accessToken) {
      navigate("/");
    } else {
      refresh();
    }
  }, [auth]);
  return (
    <section className="flex flex-col items-center justify-center h-full w-full">
      <Tabs defaultValue="login" className="w-full max-w-md mt-12">
        <TabsList className="w-full flex justify-center">
          <TabsTrigger className="w-full max-w-xs" value="login">
            Login
          </TabsTrigger>
          <TabsTrigger className="w-full max-w-xs" value="signup">
            Signup
          </TabsTrigger>
        </TabsList>

        <div className="w-full max-w-md flex-grow mt-4 rounded-lg overflow-hidden bg-muted">
          <TabsContent value="login" className="p-6">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup" className="p-6">
            <RegisterForm />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
