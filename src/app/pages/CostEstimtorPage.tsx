import { useState } from "react";
import { motion } from "motion/react";
import { Calculator, Download, FileText } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Progress } from "../components/ui/progress";
import { Link } from "react-router-dom";

export function CostEstimatorPage() {
  const [projectType, setProjectType] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState([2000]);
  const [quality, setQuality] = useState("");
  const [floors, setFloors] = useState("");
  const [duration, setDuration] = useState([12]);
  const [showResults, setShowResults] = useState(false);

  const calculateCost = () => {
    setShowResults(true);
  };

  // Calculate estimated cost based on inputs
  const baseRate =
    quality === "economy" ? 1200 : quality === "standard" ? 1600 : 2200;
  const estimatedCost = (area[0] * baseRate).toLocaleString("en-BD");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1721244654392-9c912a6eb236?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBibHVlcHJpbnQlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3Mzk0NzY5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        }}
      >
        <div className="absolute inset-0 bg-[#1E88E5]/90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Calculator size={64} className="mx-auto text-white mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              GET INSTANT AI COST ESTIMATE
            </h1>
            <p className="text-xl text-white/90">
              Professional construction cost calculator powered by AI technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8 text-center">
              Project Details
            </h2>

            <div className="space-y-6">
              {/* Project Type */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-[#1A1A1A]">
                  Project Type
                </Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger className="w-full h-12 border-2">
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
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-[#1A1A1A]">
                  Location
                </Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full h-12 border-2">
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

              {/* Area Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-[#1A1A1A]">
                    Area (Square Feet)
                  </Label>
                  <span className="text-2xl font-bold text-[#1E88E5]">
                    {area[0]} sqft
                  </span>
                </div>
                <Slider
                  value={area}
                  onValueChange={setArea}
                  min={500}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>500 sqft</span>
                  <span>10,000 sqft</span>
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-[#1A1A1A]">
                  Quality
                </Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger className="w-full h-12 border-2">
                    <SelectValue placeholder="Select quality level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">
                      Economy (BDT 1,200/sqft)
                    </SelectItem>
                    <SelectItem value="standard">
                      Standard (BDT 1,600/sqft)
                    </SelectItem>
                    <SelectItem value="premium">
                      Premium (BDT 2,200/sqft)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Floors */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-[#1A1A1A]">
                  Number of Floors
                </Label>
                <Select value={floors} onValueChange={setFloors}>
                  <SelectTrigger className="w-full h-12 border-2">
                    <SelectValue placeholder="Select floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g0">G+0 (Ground Only)</SelectItem>
                    <SelectItem value="g1">G+1 (2 Floors)</SelectItem>
                    <SelectItem value="g2">G+2 (3 Floors)</SelectItem>
                    <SelectItem value="g3">G+3 (4 Floors)</SelectItem>
                    <SelectItem value="g4">G+4 (5 Floors)</SelectItem>
                    <SelectItem value="g5">G+5 (6 Floors)</SelectItem>
                    <SelectItem value="g10">G+10 (11 Floors)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-[#1A1A1A]">
                    Project Duration (Months)
                  </Label>
                  <span className="text-2xl font-bold text-[#1E88E5]">
                    {duration[0]} months
                  </span>
                </div>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  min={3}
                  max={24}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>3 months</span>
                  <span>24 months</span>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={calculateCost}
                className="w-full bg-[#FF8F00] hover:bg-[#F57C00] text-white h-14 text-lg font-bold shadow-xl hover:scale-105 transition-all mt-8"
              >
                <Calculator className="mr-2" size={24} />
                GENERATE ESTIMATE
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {showResults && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-16 bg-white"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#1E88E5] to-[#1565C0] rounded-2xl shadow-2xl p-8 md:p-12 text-white">
              <h2 className="text-4xl font-bold mb-8 text-center">
                Your Estimated Cost
              </h2>

              <div className="text-center mb-10">
                <div className="text-6xl md:text-7xl font-bold mb-2">
                  BDT {estimatedCost}
                </div>
                <div className="text-xl text-white/80">
                  ±10% variation possible
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold mb-6">Phase Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Foundation</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} className="h-3 bg-white/20" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Structure</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-3 bg-white/20" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Finishing</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} className="h-3 bg-white/20" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">
                        Utilities & Plumbing
                      </span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-3 bg-white/20" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Contingency</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-3 bg-white/20" />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold mb-4">
                  Material BOQ (Bill of Quantities)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Cement</span>
                    <span className="font-bold">420 bags</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Steel (TMT)</span>
                    <span className="font-bold">3.5 tons</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Bricks</span>
                    <span className="font-bold">18,500 pcs</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Sand</span>
                    <span className="font-bold">65 CFT</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-white text-[#1E88E5] hover:bg-gray-100 h-14 text-lg font-bold">
                  <Download className="mr-2" size={20} />
                  DOWNLOAD PDF
                </Button>
                <Link to="/post-project" className="flex-1">
                  <Button className="w-full bg-[#FF8F00] hover:bg-[#F57C00] text-white h-14 text-lg font-bold">
                    <FileText className="mr-2" size={20} />
                    POST PROJECT
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      <Footer />
    </div>
  );
}
