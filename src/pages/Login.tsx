import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { authApi } from "../utils/api";

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await authApi.signin(data);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Please login to continue to your account"
      alternativeText="Don't have an account?"
      alternativeLink="/signup"
      alternativeLinkText="Create one"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            label="Email"
          />
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            label="Password"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Keep me logged in
              </label>
            </div>
            <div className="text-sm">
              {/* <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot Password?
              </a> */}
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            disabled={isLoading}
          >
            Sign in
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
