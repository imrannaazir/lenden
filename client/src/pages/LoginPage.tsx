import { LoginForm } from "@/components/forms/LoginForm";
import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function LoginPage() {
  return (
    <div className="flex p-10  justify-center min-h-screen">
      <Tabs defaultValue="signUp" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signUp">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="signUp">
          <RegistrationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LoginPage;
