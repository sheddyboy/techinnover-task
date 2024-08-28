"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { registerFormSchema } from "@/lib/zod";
import { toast } from "sonner";
import { logInAsGuest, signUp } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface RegisterFormProps {}

const RegisterForm = ({}: RegisterFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    toast.promise(signUp(values), {
      loading: "Registering",
      success: ({ data, error }) => {
        if (error) {
          throw error;
        }
        router.push("/");
        return `Registered`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="test@test.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2 mt-3">
          <Button type="submit" className="w-full">
            Register
          </Button>
          <Button
            type="button"
            variant={"outline"}
            className="w-full"
            onClick={() => {
              toast.promise(logInAsGuest(), {
                loading: "Logging in...",
                success: ({ data, error }) => {
                  if (error) {
                    throw error;
                  }
                  router.push("/");
                  return `Logged In as guest`;
                },
                error: (error) => {
                  return `${error.message}`;
                },
              });
            }}
          >
            Login as guest
          </Button>
        </div>
        <div className="mt-1 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
