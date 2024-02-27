/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/schemas/login.schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { logIn } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // define login form
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      mobileNumberOrEmail: "user@gmail.com",
      pin: "64432",
    },
  });

  // login submit handler
  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    const toastId = toast.loading("Logging in.", { duration: 2000 });
    try {
      const response = await login(data).unwrap();
      console.log(response.data.accessToken);

      if (response.data.accessToken) {
        dispatch(
          logIn({
            token: response.data.accessToken,
            user: jwtDecode(response.data.accessToken),
          })
        );
      }

      toast.success("Logged in successfully.", { id: toastId });
      navigate("/");
    } catch (error: any) {
      if (error?.status === 401) {
        toast.error("Login credentials are incorrect.", { id: toastId });
      }

      if (error?.status === 403) {
        toast.error("This account is already logged in another device.", {
          id: toastId,
        });
      }
    }
  }

  return (
    <Card className="flex-grow ">
      <CardHeader>
        <CardTitle>Login Here</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="mobileNumberOrEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter mobile number / email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@doe.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter 5 digit pin</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="">
            <Button>Login</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
