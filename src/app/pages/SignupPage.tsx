import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
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

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("engineer");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="auth-background-pattern absolute inset-0 opacity-5" />

      <div className="relative max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-[#1E88E5] rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">CH</span>
            </div>
            <span className="text-3xl font-bold text-[#1A1A1A]">CivilHub</span>
          </Link>
          <p className="mt-4 text-gray-600">Create your account</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* User Type Tabs */}
          <Tabs value={userType} onValueChange={setUserType} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="engineer"
                className="data-[state=active]:bg-[#1E88E5] data-[state=active]:text-white"
              >
                I'm an Engineer
              </TabsTrigger>
              <TabsTrigger
                value="client"
                className="data-[state=active]:bg-[#1E88E5] data-[state=active]:text-white"
              >
                I'm a Client
              </TabsTrigger>
            </TabsList>

            {/* Engineer Signup Form */}
            <TabsContent value="engineer" className="mt-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="engineer-name">Full Name *</Label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="engineer-name"
                        name="name"
                        type="text"
                        placeholder="Ahmed Khan"
                        className="pl-10 h-11 border-2 focus:border-[#1E88E5]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="engineer-email">Email Address *</Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="engineer-email"
                        name="email"
                        type="email"
                        placeholder="ahmed@example.com"
                        className="pl-10 h-11 border-2 focus:border-[#1E88E5]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="engineer-phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="engineer-phone"
                        name="phone"
                        type="tel"
                        placeholder="+880 1700-000000"
                        className="pl-10 h-11 border-2 focus:border-[#1E88E5]"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="engineer-location">Location *</Label>
                    <Select
                      value={engineerCity}
                      onValueChange={setEngineerCity}
                    >
                      <SelectTrigger className="h-11 border-2">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Specialization */}
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Select
                      value={specialization}
                      onValueChange={setSpecialization}
                    >
                      <SelectTrigger className="h-11 border-2">
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

                  {/* Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger className="h-11 border-2">
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

                {/* Professional Summary */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Summary</Label>
                  <Textarea
                    id="bio"
                    placeholder="Brief description of your expertise and experience..."
                    className="min-h-24 border-2 focus:border-[#1E88E5]"
                  />
                </div>

                {/* License Number */}
                <div className="space-y-2">
                  <Label htmlFor="license">
                    Professional License Number (IEB)
                  </Label>
                  <div className="relative">
                    <Briefcase
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="license"
                      type="text"
                      placeholder="IEB License Number (Optional)"
                      className="pl-10 h-11 border-2 focus:border-[#1E88E5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="engineer-password">Password *</Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="engineer-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        className="pl-10 pr-10 h-11 border-2 focus:border-[#1E88E5]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="engineer-confirm">Confirm Password *</Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="engineer-confirm"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="pl-10 pr-10 h-11 border-2 focus:border-[#1E88E5]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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

                {/* Terms */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="engineer-terms"
                    className="mt-1 w-4 h-4 text-[#1E88E5] rounded"
                  />
                  <label
                    htmlFor="engineer-terms"
                    className="text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-[#1E88E5] hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-[#1E88E5] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1E88E5] hover:bg-[#1565C0] text-white h-12 text-lg font-bold disabled:opacity-60"
                >
                  <CheckCircle className="mr-2" size={20} />
                  {isSubmitting
                    ? "Creating Account..."
                    : "Create Engineer Account"}
                </Button>
              </form>

              {/* Benefits */}
              <div className="mt-6 p-4 bg-[#1E88E5]/10 rounded-lg">
                <h3 className="font-bold text-[#1A1A1A] mb-2">
                  Engineer Benefits:
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Get project opportunities from verified clients</li>
                  <li>✓ Showcase your portfolio and expertise</li>
                  <li>✓ Secure payment processing</li>
                  <li>✓ Build your professional reputation</li>
                </ul>
              </div>
            </TabsContent>

            {/* Client Signup Form */}
            <TabsContent value="client" className="mt-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="client-name">
                      Full Name / Company Name *
                    </Label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="client-name"
                        name="name"
                        type="text"
                        placeholder="Your name or company"
                        className="pl-10 h-11 border-2 focus:border-[#1E88E5]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email Address *</Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="client-email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10 h-11 border-2 focus:border-[#1E88E5]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="client-phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="client-phone"
                        name="phone"
                        type="tel"
                        placeholder="+880 1700-000000"
                        className="pl-10 h-11 border-2 focus:border-[#1E88E5]"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="client-location">Location *</Label>
                    <Select value={clientCity} onValueChange={setClientCity}>
                      <SelectTrigger className="h-11 border-2">
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

                {/* Project Interest */}
                <div className="space-y-2">
                  <Label htmlFor="project-type">
                    What type of project are you planning?
                  </Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="h-11 border-2">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="client-password">Password *</Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="client-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        className="pl-10 pr-10 h-11 border-2 focus:border-[#1E88E5]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="client-confirm">Confirm Password *</Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="client-confirm"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="pl-10 pr-10 h-11 border-2 focus:border-[#1E88E5]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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

                {/* Terms */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="client-terms"
                    className="mt-1 w-4 h-4 text-[#1E88E5] rounded"
                  />
                  <label
                    htmlFor="client-terms"
                    className="text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-[#1E88E5] hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-[#1E88E5] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF8F00] hover:bg-[#F57C00] text-white h-12 text-lg font-bold disabled:opacity-60"
                >
                  <CheckCircle className="mr-2" size={20} />
                  {isSubmitting
                    ? "Creating Account..."
                    : "Create Client Account"}
                </Button>
              </form>

              {/* Benefits */}
              <div className="mt-6 p-4 bg-[#FF8F00]/10 rounded-lg">
                <h3 className="font-bold text-[#1A1A1A] mb-2">
                  Client Benefits:
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Access 500+ verified civil engineers</li>
                  <li>✓ Get AI-powered cost estimates instantly</li>
                  <li>✓ Compare bids and choose the best fit</li>
                  <li>✓ Secure milestone-based payments</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          {/* Login Link */}
          <div className="mt-6 text-center pt-6 border-t">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#1E88E5] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-[#1E88E5]">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
