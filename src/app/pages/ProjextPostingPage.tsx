import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { getAuthToken, getAuthUser } from "../utils/auth";

type UploadedFile = {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
};

async function readApiPayload(response: Response) {
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
  const looksLikeHtml =
    contentType.includes("text/html") ||
    text.trimStart().toLowerCase().startsWith("<!doctype") ||
    text.trimStart().toLowerCase().startsWith("<html");

  if (looksLikeHtml) {
    throw new Error(
      "Server returned HTML instead of JSON. Ensure backend is running on port 5000 and Vite proxy is active.",
    );
  }

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned an invalid JSON response.");
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProjectPostingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [budget, setBudget] = useState([1000000]);
  const [projectType, setProjectType] = useState("");
  const [location, setLocation] = useState("");
  const [floors, setFloors] = useState("");
  const [flexibility, setFlexibility] = useState("");
  const [duration, setDuration] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const token = getAuthToken();
  const authUser = getAuthUser();
  const submitLockRef = useRef(false);

  const userId = authUser?._id || authUser?.id || "";
  const canSubmit = useMemo(
    () =>
      Boolean(
        title.trim() &&
        description.trim() &&
        projectType &&
        location &&
        area &&
        agreeToTerms &&
        userId,
      ),
    [agreeToTerms, area, description, location, projectType, title, userId],
  );

  const steps = [
    { number: 1, title: "Project Details" },
    { number: 2, title: "Budget & Timeline" },
    { number: 3, title: "Attachments" },
    { number: 4, title: "Review & Post" },
  ];

  const nextStep = () => {
    setError("");
    if (
      currentStep === 1 &&
      (!title.trim() ||
        !projectType ||
        !description.trim() ||
        !location ||
        !area)
    ) {
      setError("Please complete all required fields in Project Details.");
      return;
    }

    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError("");
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    event.target.value = "";
  }

  function removeFile(fileName: string) {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  }

  async function uploadAttachments() {
    if (!files.length) return [] as UploadedFile[];

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/uploads", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    const data = await readApiPayload(response);
    if (!response.ok) {
      throw new Error(data?.message || "Failed to upload attachments");
    }

    return ((data?.files || []) as UploadedFile[]).map((file) => ({
      filename: file.filename,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      url: file.url,
    }));
  }

  async function handlePostProject() {
    if (submitLockRef.current) return;
    submitLockRef.current = true;

    setError("");
    setSuccessMessage("");

    if (!canSubmit) {
      setError(
        "Please fill required fields and agree to terms before posting.",
      );
      submitLockRef.current = false;
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionKey =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const uploadedFiles = await uploadAttachments();

      const payload = {
        ownerId: userId,
        client_id: userId,
        title: title.trim(),
        type: projectType,
        description: description.trim(),
        location,
        area,
        floors,
        budget: budget[0],
        budgetFlexibility: flexibility,
        duration,
        startDate,
        endDate,
        paymentTerms,
        additionalRequirements: additionalRequirements.trim(),
        attachments: uploadedFiles,
        status: "open",
        submissionKey,
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": submissionKey,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await readApiPayload(response);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to post project");
      }

      setSuccessMessage("Project posted successfully. Engineers can now bid.");
      setCurrentStep(4);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to post project",
      );
    } finally {
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FileText size={64} className="mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              START YOUR PROJECT
            </h1>
            <p className="text-xl text-white/90">
              Get competitive bids from verified civil engineers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      currentStep >= step.number
                        ? "bg-[#1E88E5] text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle size={24} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-semibold ${
                      currentStep >= step.number
                        ? "text-[#1E88E5]"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      currentStep > step.number ? "bg-[#1E88E5]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 relative z-10"
          >
            {error ? (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            {/* Step 1: Project Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">
                  Project Details
                </h2>

                <div className="space-y-2">
                  <Label>Project Title *</Label>
                  <Input
                    type="text"
                    placeholder="e.g., 5-Story Residential Building in Gulshan"
                    className="h-12"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Type *</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="h-12">
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

                <div className="space-y-2">
                  <Label>Project Description *</Label>
                  <Textarea
                    placeholder="Describe your project in detail. Include specifics about design requirements, materials, and any special considerations..."
                    className="min-h-32"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select location" />
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

                  <div className="space-y-2">
                    <Label>Area (Square Feet) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 2500"
                      className="h-12"
                      value={area}
                      onChange={(event) => setArea(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Number of Floors</Label>
                  <Select value={floors} onValueChange={setFloors}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g0">G+0 (Ground Only)</SelectItem>
                      <SelectItem value="g1">G+1 (2 Floors)</SelectItem>
                      <SelectItem value="g2">G+2 (3 Floors)</SelectItem>
                      <SelectItem value="g3">G+3 (4 Floors)</SelectItem>
                      <SelectItem value="g5">G+5 (6 Floors)</SelectItem>
                      <SelectItem value="g10">G+10 (11 Floors)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Budget & Timeline */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">
                  Budget & Timeline
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Project Budget (BDT)</Label>
                    <span className="text-2xl font-bold text-[#1E88E5]">
                      BDT {budget[0].toLocaleString("en-BD")}
                    </span>
                  </div>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    min={100000}
                    max={50000000}
                    step={100000}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 Lakh</span>
                    <span>5 Crore</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Budget Flexibility</Label>
                  <Select value={flexibility} onValueChange={setFlexibility}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select flexibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Budget</SelectItem>
                      <SelectItem value="negotiable">
                        Negotiable (±10%)
                      </SelectItem>
                      <SelectItem value="flexible">Flexible (±20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      className="h-12"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Completion</Label>
                    <Input
                      type="date"
                      className="h-12"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Duration (Months)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                      <SelectItem value="18">18 Months</SelectItem>
                      <SelectItem value="24">24 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="milestone">Milestone-based</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="upfront">Upfront + Final</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Attachments */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">
                  Attachments
                </h2>

                <div className="space-y-2">
                  <Label>Upload Documents (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload any relevant documents, drawings, site photos, or
                    blueprints
                  </p>
                  <label className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#1E88E5] transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-semibold text-[#1A1A1A] mb-2">
                      Drop files here or click to upload
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, JPG, PNG, DWG (Max 10MB each)
                    </p>
                  </label>

                  {files.length ? (
                    <div className="mt-4 space-y-2">
                      {files.map((file) => (
                        <div
                          key={`${file.name}-${file.size}`}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-medium text-[#1A1A1A]">
                              {file.name}
                            </p>
                            <p className="text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(file.name)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>Site Photos</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#1E88E5] transition-colors cursor-pointer"
                      >
                        <Upload size={32} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Requirements</Label>
                  <Textarea
                    placeholder="Any specific requirements, preferences, or additional information..."
                    className="min-h-24"
                    value={additionalRequirements}
                    onChange={(event) =>
                      setAdditionalRequirements(event.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Post */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">
                  Review & Post
                </h2>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-2">
                      Project Summary
                    </h3>
                    <p className="text-gray-600">{title || "-"}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-bold text-[#1A1A1A] mb-2">
                      Location & Size
                    </h3>
                    <p className="text-gray-600">
                      {location || "-"} | {area || "-"} sqft | {floors || "-"}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-bold text-[#1A1A1A] mb-2">
                      Budget & Timeline
                    </h3>
                    <p className="text-gray-600">
                      BDT {budget[0].toLocaleString("en-BD")} |{" "}
                      {duration || "-"} Months
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-bold text-[#1A1A1A] mb-2">Documents</h3>
                    <p className="text-gray-600">
                      {files.length} file(s) attached
                    </p>
                  </div>
                </div>

                <div className="bg-[#1E88E5]/10 border-l-4 border-[#1E88E5] p-4 rounded">
                  <p className="text-sm text-[#1A1A1A]">
                    <strong>Note:</strong> Your project will be visible to all
                    verified engineers. You'll start receiving bids within 24
                    hours.
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1"
                    checked={agreeToTerms}
                    onChange={(event) => setAgreeToTerms(event.target.checked)}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the Terms of Service and Privacy Policy. I
                    understand that my project will be posted publicly.
                  </label>
                </div>

                {!userId ? (
                  <p className="text-sm text-rose-600">
                    You must be logged in to post a project.
                  </p>
                ) : null}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={currentStep === 1}
                className="px-8 py-6 disabled:opacity-50"
              >
                <ArrowLeft className="mr-2" size={20} />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  className="bg-[#1E88E5] hover:bg-[#1565C0] text-white px-8 py-6"
                >
                  Next
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              ) : (
                <Button
                  onClick={handlePostProject}
                  disabled={isSubmitting || !canSubmit}
                  className="bg-[#FF8F00] hover:bg-[#F57C00] text-white px-12 py-6 text-lg font-bold shadow-xl disabled:opacity-60"
                >
                  {isSubmitting ? "POSTING..." : "POST PROJECT"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
