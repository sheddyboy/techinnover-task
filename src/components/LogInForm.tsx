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
import { logInFormSchema } from "@/lib/zod";
import { toast } from "sonner";
import { logIn, logInAsGuest } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface LogInFormProps {}

const LogInForm = ({}: LogInFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof logInFormSchema>>({
    resolver: zodResolver(logInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof logInFormSchema>) {
    toast.promise(logIn(values), {
      loading: "Logging in...",
      success: ({ error }) => {
        if (error) {
          throw error;
        }
        router.push("/");
        return `Logged In`;
      },
      error: (error) => {
        return error.message;
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
            Login
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
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LogInForm;
