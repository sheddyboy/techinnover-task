import LogInForm from "@/components/LogInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LogInProps {}

const LogIn = ({}: LogInProps) => {
  return (
    <main className="h-dvh flex flex-col justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogInForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default LogIn;
