import LoginForm from "@/components/base_components/LoginForm";
import RegisterForm from "@/components/base_components/RegisterForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Auth() {
  return (
    <Tabs defaultValue="login" className="w-full max-w-md mt-12">
      <TabsList className="w-full flex justify-center space-x-2">
        <TabsTrigger className="w-full max-w-xs p-2" value="login">
          Login
        </TabsTrigger>
        <TabsTrigger className="w-full max-w-xs p-2" value="signup">
          Signup
        </TabsTrigger>
      </TabsList>

      <div className="w-full max-w-md flex-grow mt-4 rounded-lg bg-primary-foreground overflow-hidden">
        <TabsContent value="login" className="p-6">
          <LoginForm />
        </TabsContent>
        <TabsContent value="signup" className="p-6">
          <RegisterForm />
        </TabsContent>
      </div>
    </Tabs>
  );
}
