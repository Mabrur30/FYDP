import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

function getPasswordStrength(password: string) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (!password) {
    return { label: "Password strength", width: "0%", tone: "bg-slate-200" };
  }

  if (score <= 1) return { label: "Weak", width: "25%", tone: "bg-rose-500" };
  if (score === 2) return { label: "Fair", width: "50%", tone: "bg-amber-500" };
  if (score === 3)
    return { label: "Strong", width: "75%", tone: "bg-blue-500" };
  return { label: "Very strong", width: "100%", tone: "bg-emerald-500" };
}

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("engineer");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const passwordStrength = getPasswordStrength(password);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: userType }),
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to sign in");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("authRole", userType);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_30%),linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:auto,auto,36px_36px,36px_36px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md items-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                <span className="text-2xl font-bold text-white">CH</span>
              </div>
              <span className="text-3xl font-bold text-slate-900">
                CivilHub
              </span>
            </Link>
            <p className="mt-4 text-slate-500">Sign in to your account</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl"
          >
            <p className="mb-3 text-sm font-medium text-slate-600">
              Choose account type
            </p>

            <Tabs value={userType} onValueChange={setUserType} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="engineer">Engineer</TabsTrigger>
                <TabsTrigger value="client">Client</TabsTrigger>
              </TabsList>
            </Tabs>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.tone}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    {passwordStrength.label}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm text-slate-600">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  `Sign In as ${userType === "client" ? "Client" : "Engineer"}`
                )}
              </Button>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">
                  Secure, role-aware access
                </p>
                <p className="mt-1 text-slate-600">
                  Engineers and clients land on the right dashboard with one
                  clear sign-in flow.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-slate-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" className="h-12">
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button type="button" variant="outline" className="h-12">
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              <div className="text-center">
                <p className="text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-slate-500 hover:text-blue-600">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
