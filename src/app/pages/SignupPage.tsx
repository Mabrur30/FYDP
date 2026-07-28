import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Briefcase,
  CheckCircle,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

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

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("engineer");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const passwordStrength = getPasswordStrength(password);
  const requiredStarClass =
    "after:content-['*'] after:ml-1 after:text-rose-500";

  // Engineer form state
  const [engineerCity, setEngineerCity] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");

  // Client form state
  const [clientCity, setClientCity] = useState("");
  const [projectType, setProjectType] = useState("");

  function parseExperienceYears(value: string) {
    if (value === "0-2") return 1;
    if (value === "3-5") return 4;
    if (value === "6-10") return 8;
    if (value === "10+") return 10;
    return 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (!phone) {
      setError("Phone number is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const isEngineer = userType === "engineer";
      const payload = isEngineer
        ? {
            name,
            email,
            phone,
            password,
            specialization,
            location: engineerCity,
            experience_years: parseExperienceYears(experience),
          }
        : {
            name,
            email,
            phone,
            password,
            location: clientCity,
          };

      const endpoint = isEngineer
        ? "/api/auth/engineer/register"
        : "/api/auth/client/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create account");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("authRole", userType);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_30%),linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:auto,auto,36px_36px,36px_36px]" />

      <div className="relative mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
              <span className="text-2xl font-bold text-white">CH</span>
            </div>
            <span className="text-3xl font-bold text-slate-900">CivilHub</span>
          </Link>
          <p className="mt-4 text-slate-500">Create your account</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl"
        >
          <Tabs value={userType} onValueChange={setUserType} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="engineer">I'm an Engineer</TabsTrigger>
              <TabsTrigger value="client">I'm a Client</TabsTrigger>
            </TabsList>

            <TabsContent value="engineer" className="mt-6">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="engineer-name"
                      className={requiredStarClass}
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="engineer-name"
                        name="name"
                        type="text"
                        placeholder="Ahmed Khan"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="engineer-email"
                      className={requiredStarClass}
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="engineer-email"
                        name="email"
                        type="email"
                        placeholder="ahmed@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="engineer-phone"
                      className={requiredStarClass}
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="engineer-phone"
                        name="phone"
                        type="tel"
                        placeholder="+880 1700-000000"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="engineer-location"
                      className={requiredStarClass}
                    >
                      Location
                    </Label>
                    <Select
                      value={engineerCity}
                      onValueChange={setEngineerCity}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dhaka">Dhaka</SelectItem>
                        <SelectItem value="Chattogram">Chattogram</SelectItem>
                        <SelectItem value="Sylhet">Sylhet</SelectItem>
                        <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                        <SelectItem value="Khulna">Khulna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="specialization"
                      className={requiredStarClass}
                    >
                      Specialization
                    </Label>
                    <Select
                      value={specialization}
                      onValueChange={setSpecialization}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="structural">
                          Structural Engineer
                        </SelectItem>
                        <SelectItem value="geotechnical">
                          Geotechnical Engineer
                        </SelectItem>
                        <SelectItem value="project-manager">
                          Project Manager
                        </SelectItem>
                        <SelectItem value="architectural">
                          Architectural Engineer
                        </SelectItem>
                        <SelectItem value="construction">
                          Construction Manager
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className={requiredStarClass}>
                      Years of Experience
                    </Label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">0-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="bio">Professional Summary</Label>
                    <span className="text-xs font-medium text-slate-500">
                      {bio.length}/280
                    </span>
                  </div>
                  <Textarea
                    id="bio"
                    maxLength={280}
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="Brief description of your expertise and experience..."
                    className="min-h-28"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license">
                    Professional License Number (IEB)
                  </Label>
                  <div className="relative">
                    <Briefcase
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      id="license"
                      type="text"
                      placeholder="IEB License Number (Optional)"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="engineer-password"
                      className={requiredStarClass}
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="engineer-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="engineer-confirm"
                      className={requiredStarClass}
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="engineer-confirm"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <Checkbox id="engineer-terms" className="mt-0.5" />
                  <label
                    htmlFor="engineer-terms"
                    className="text-sm leading-6 text-slate-600"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-4" />
                      Create Engineer Account
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <h3 className="mb-3 font-semibold text-slate-900">
                  Engineer Benefits
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-blue-600">✓</span> Get project
                    opportunities from verified clients
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">✓</span> Showcase your
                    portfolio and expertise
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">✓</span> Secure payment
                    processing
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">✓</span> Build your
                    professional reputation
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="client" className="mt-6">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="client-name" className={requiredStarClass}>
                      Full Name / Company Name
                    </Label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="client-name"
                        name="name"
                        type="text"
                        placeholder="Your name or company"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-email" className={requiredStarClass}>
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="client-email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="client-phone" className={requiredStarClass}>
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="client-phone"
                        name="phone"
                        type="tel"
                        placeholder="+880 1700-000000"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="client-location"
                      className={requiredStarClass}
                    >
                      Location
                    </Label>
                    <Select value={clientCity} onValueChange={setClientCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dhaka">Dhaka</SelectItem>
                        <SelectItem value="Chattogram">Chattogram</SelectItem>
                        <SelectItem value="Sylhet">Sylhet</SelectItem>
                        <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                        <SelectItem value="Khulna">Khulna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-type">
                    What type of project are you planning?
                  </Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">
                        Residential Building
                      </SelectItem>
                      <SelectItem value="commercial">
                        Commercial Building
                      </SelectItem>
                      <SelectItem value="industrial">
                        Industrial Structure
                      </SelectItem>
                      <SelectItem value="renovation">
                        Renovation/Remodeling
                      </SelectItem>
                      <SelectItem value="infrastructure">
                        Infrastructure
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="client-password"
                      className={requiredStarClass}
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="client-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="client-confirm"
                      className={requiredStarClass}
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="client-confirm"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <Checkbox id="client-terms" className="mt-0.5" />
                  <label
                    htmlFor="client-terms"
                    className="text-sm leading-6 text-slate-600"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-4" />
                      Create Client Account
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
                <h3 className="mb-3 font-semibold text-slate-900">
                  Client Benefits
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-amber-600">✓</span> Access 500+
                    verified civil engineers
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-600">✓</span> Get AI-powered
                    cost estimates instantly
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-600">✓</span> Compare bids and
                    choose the best fit
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-600">✓</span> Secure
                    milestone-based payments
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-slate-500 hover:text-blue-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
