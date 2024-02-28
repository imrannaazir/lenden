/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { registrationFormSchema } from "@/schemas/registration.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { logIn } from "@/redux/features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/redux/features/auth/authApi";

export function RegistrationForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  // 1. Define your form.
  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof registrationFormSchema>) {
    const { pin, role, nidNumber, mobileNumber, email } = data;
    const payload = {
      name: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
      pin,
      role,
      nidNumber,
      mobileNumber,
      email,
    };

    const toastId = toast.loading("Signing up.", { duration: 2000 });
    try {
      const response = await register(payload).unwrap();

      if (response.data.accessToken) {
        dispatch(
          logIn({
            token: response.data.accessToken,
            user: jwtDecode(response.data.accessToken),
          })
        );
      }

      toast.success("Signed up successfully.", { id: toastId });
      navigate("/");
    } catch (error: any) {
      const { message } = error.data.errorSources[0];
      console.log(error);

      if (message) {
        toast.error(message, { id: toastId });
      } else {
        toast.error("Failed to sign up.", { id: toastId });
      }
    }
  }

  return (
    <Card className="flex-grow ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sign up</CardTitle>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">user</SelectItem>
                        <SelectItem value="agent">agent</SelectItem>
                        <SelectItem value="admin">admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex  gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@doe.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile number </FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="01900000000" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="nidNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter 15 digit nid number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="324348298649879"
                      {...field}
                    />
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
                  <FormLabel>Enter 5 digit password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="32434" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="">
            <Button>Sign up</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
