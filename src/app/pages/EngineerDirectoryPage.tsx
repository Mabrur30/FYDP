import { useState } from "react";
import { motion } from "motion/react";
import { Search, MapPin, Star, MessageSquare, Filter } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Link } from "react-router-dom";

const engineers = [
  {
    id: 1,
    name: "Ahmed Khan",
    title: "Structural Engineer",
    rating: 4.8,
    reviews: 127,
    experience: 12,
    location: "Dhaka",
    specialties: ["RCC Design", "Foundation", "High-Rise"],
    image:
      "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyRate: "2,500-3,500",
  },
  {
    id: 2,
    name: "Fatima Rahman",
    title: "Geotechnical Engineer",
    rating: 4.9,
    reviews: 94,
    experience: 10,
    location: "Chittagong",
    specialties: ["Soil Testing", "Foundation Design", "Site Investigation"],
    image:
      "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyRate: "2,000-2,800",
  },
  {
    id: 3,
    name: "Rashed Hasan",
    title: "Project Manager",
    rating: 4.7,
    reviews: 156,
    experience: 15,
    location: "Dhaka",
    specialties: ["Project Planning", "Cost Estimation", "Quality Control"],
    image:
      "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyRate: "3,000-4,000",
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    title: "Architectural Engineer",
    rating: 4.8,
    reviews: 88,
    experience: 8,
    location: "Sylhet",
    specialties: ["Building Design", "Interior Planning", "3D Modeling"],
    image:
      "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyRate: "2,200-3,000",
  },
  {
    id: 5,
    name: "Kamal Uddin",
    title: "Structural Consultant",
    rating: 4.9,
    reviews: 203,
    experience: 18,
    location: "Dhaka",
    specialties: ["Earthquake Analysis", "Steel Structures", "Bridge Design"],
    image:
      "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyRate: "3,500-5,000",
  },
  {
    id: 6,
    name: "Sabrina Akter",
    title: "Construction Manager",
    rating: 4.6,
    reviews: 72,
    experience: 9,
    location: "Khulna",
    specialties: ["Site Management", "Safety Planning", "Resource Allocation"],
    image:
      "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyRate: "2,000-2,500",
  },
];

export function EngineerDirectoryPage() {
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              FIND PERFECT CIVIL ENGINEER
            </h1>
            <p className="text-xl text-white/90">
              Browse 500+ verified professionals ready to work on your project
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center">
              <Search size={24} className="text-gray-400 mr-3" />
              <Input
                type="text"
                placeholder="Search by name, specialization, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 text-lg"
              />
              <Button className="bg-[#FF8F00] hover:bg-[#F57C00] text-white px-8">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-80 space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Filter size={20} className="text-[#1E88E5] mr-2" />
                  <h3 className="text-xl font-bold text-[#1A1A1A]">Filters</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-[#1A1A1A] mb-2 block">
                      Location
                    </label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="dhaka">Dhaka</SelectItem>
                        <SelectItem value="chittagong">Chittagong</SelectItem>
                        <SelectItem value="sylhet">Sylhet</SelectItem>
                        <SelectItem value="rajshahi">Rajshahi</SelectItem>
                        <SelectItem value="khulna">Khulna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#1A1A1A] mb-2 block">
                      Specialization
                    </label>
                    <Select
                      value={specialization}
                      onValueChange={setSpecialization}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Specializations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specializations</SelectItem>
                        <SelectItem value="structural">
                          Structural Engineering
                        </SelectItem>
                        <SelectItem value="geotechnical">
                          Geotechnical
                        </SelectItem>
                        <SelectItem value="project-management">
                          Project Management
                        </SelectItem>
                        <SelectItem value="architectural">
                          Architectural
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#1A1A1A] mb-2 block">
                      Experience
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Experience</SelectItem>
                        <SelectItem value="0-5">0-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#1A1A1A] mb-2 block">
                      Hourly Rate (BDT)
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any Rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Rate</SelectItem>
                        <SelectItem value="0-2000">Below 2,000</SelectItem>
                        <SelectItem value="2000-3000">2,000 - 3,000</SelectItem>
                        <SelectItem value="3000+">3,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Engineer Cards Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[#1A1A1A]">
                  Showing {engineers.length} engineers
                </p>
                <Select defaultValue="rating">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="price-low">Lowest Rate</SelectItem>
                    <SelectItem value="price-high">Highest Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {engineers.map((engineer, index) => (
                  <motion.div
                    key={engineer.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={engineer.image}
                        alt={engineer.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">
                        {engineer.name}
                      </h3>
                      <p className="text-[#1E88E5] font-semibold mb-3">
                        {engineer.title}
                      </p>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          <Star
                            size={18}
                            className="text-yellow-400 fill-yellow-400"
                          />
                          <span className="ml-1 font-bold text-[#1A1A1A]">
                            {engineer.rating}
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm ml-2">
                          ({engineer.reviews} reviews)
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin size={16} className="mr-1" />
                        <span>
                          {engineer.experience} yrs exp | {engineer.location}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">
                          Specialties:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {engineer.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="px-2 py-1 bg-[#1E88E5]/10 text-[#1E88E5] rounded-full text-xs font-semibold"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4 mb-4">
                        <p className="text-sm text-gray-500">Hourly Rate</p>
                        <p className="text-lg font-bold text-[#1A1A1A]">
                          BDT {engineer.hourlyRate}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/engineer/${engineer.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full bg-[#1E88E5] hover:bg-[#1565C0] text-white">
                            VIEW PROFILE
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="border-[#FF8F00] text-[#FF8F00] hover:bg-[#FF8F00] hover:text-white"
                        >
                          <MessageSquare size={18} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
