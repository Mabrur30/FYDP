import { useState } from "react";
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

export function ProjectPostingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [budget, setBudget] = useState([1000000]);

  const steps = [
    { number: 1, title: "Project Details" },
    { number: 2, title: "Budget & Timeline" },
    { number: 3, title: "Attachments" },
    { number: 4, title: "Review & Post" },
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

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
            className="bg-white rounded-2xl shadow-xl p-8"
          >
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
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Type *</Label>
                  <Select>
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
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Select>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhaka">Dhaka</SelectItem>
                        <SelectItem value="chittagong">Chittagong</SelectItem>
                        <SelectItem value="sylhet">Sylhet</SelectItem>
                        <SelectItem value="rajshahi">Rajshahi</SelectItem>
                        <SelectItem value="khulna">Khulna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Area (Square Feet) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 2500"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Number of Floors</Label>
                  <Select>
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
                  <Select>
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
                    <Input type="date" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Completion</Label>
                    <Input type="date" className="h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Duration (Months)</Label>
                  <Select>
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
                  <Select>
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
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#1E88E5] transition-colors cursor-pointer">
                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-semibold text-[#1A1A1A] mb-2">
                      Drop files here or click to upload
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, JPG, PNG, DWG (Max 10MB each)
                    </p>
                  </div>
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
                    <p className="text-gray-600">
                      5-Story Residential Building in Gulshan
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-bold text-[#1A1A1A] mb-2">
                      Location & Size
                    </h3>
                    <p className="text-gray-600">Dhaka | 2,500 sqft | G+5</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-bold text-[#1A1A1A] mb-2">
                      Budget & Timeline
                    </h3>
                    <p className="text-gray-600">
                      BDT {budget[0].toLocaleString("en-BD")} | 12 Months
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-bold text-[#1A1A1A] mb-2">Documents</h3>
                    <p className="text-gray-600">3 files attached</p>
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
                  <input type="checkbox" id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the Terms of Service and Privacy Policy. I
                    understand that my project will be posted publicly.
                  </label>
                </div>
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
                <Button className="bg-[#FF8F00] hover:bg-[#F57C00] text-white px-12 py-6 text-lg font-bold shadow-xl">
                  POST PROJECT
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
