import { useEffect, useMemo, useState } from "react";
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

type DirectoryEngineer = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  experience: number;
  location: string;
  specialties: string[];
  image: string;
  hourlyRate: string;
};

function parseRate(value: string) {
  const numeric = Number(String(value || "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

export function EngineerDirectoryPage() {
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [engineers, setEngineers] = useState<DirectoryEngineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadEngineers() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/engineers");
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        if (!response.ok) {
          throw new Error(data?.message || "Unable to load engineers");
        }

        const items = (Array.isArray(data) ? data : []).map(
          (engineer: any): DirectoryEngineer => ({
            id: String(engineer.id || engineer._id || ""),
            name: engineer.name || "Engineer",
            title:
              engineer.title ||
              (engineer.specialization
                ? `${engineer.specialization} Engineer`
                : "Civil Engineer"),
            rating: Number(engineer.rating || 0),
            reviews: Number(engineer.reviews || 0),
            experience: Number(engineer.experience_years || 0),
            location: engineer.location || "",
            specialties: Array.isArray(engineer.specialties)
              ? engineer.specialties
              : engineer.specialization
                ? [engineer.specialization]
                : [],
            image:
              engineer.imageUrl ||
              "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            hourlyRate: String(engineer.hourlyRate || "N/A"),
          }),
        );

        if (isMounted) {
          setEngineers(items);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load engineers",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEngineers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEngineers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return engineers.filter((engineer) => {
      const matchesQuery =
        !query ||
        engineer.name.toLowerCase().includes(query) ||
        engineer.title.toLowerCase().includes(query) ||
        engineer.location.toLowerCase().includes(query) ||
        engineer.specialties.some((item) => item.toLowerCase().includes(query));

      const matchesLocation =
        !location ||
        location === "all" ||
        engineer.location.toLowerCase() === location.toLowerCase();

      const matchesSpecialization =
        !specialization ||
        specialization === "all" ||
        engineer.title.toLowerCase().includes(specialization.toLowerCase()) ||
        engineer.specialties.some((item) =>
          item.toLowerCase().includes(specialization.toLowerCase()),
        );

      return matchesQuery && matchesLocation && matchesSpecialization;
    });
  }, [engineers, location, searchQuery, specialization]);

  const sortedEngineers = useMemo(() => {
    const items = [...filteredEngineers];

    if (sortBy === "experience") {
      items.sort((a, b) => b.experience - a.experience);
    } else if (sortBy === "price-low") {
      items.sort((a, b) => parseRate(a.hourlyRate) - parseRate(b.hourlyRate));
    } else if (sortBy === "price-high") {
      items.sort((a, b) => parseRate(b.hourlyRate) - parseRate(a.hourlyRate));
    } else {
      items.sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [filteredEngineers, sortBy]);

  function handleSearch() {
    setSearchQuery(searchInput.trim());
  }

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
                className="flex-1 border-0 focus-visible:ring-0 text-lg"
              />
              <Button
                type="button"
                onClick={handleSearch}
                className="bg-[#FF8F00] hover:bg-[#F57C00] text-white px-8"
              >
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
                        <SelectItem value="Dhaka">Dhaka</SelectItem>
                        <SelectItem value="Chattogram">Chattogram</SelectItem>
                        <SelectItem value="Sylhet">Sylhet</SelectItem>
                        <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                        <SelectItem value="Khulna">Khulna</SelectItem>
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
                  Showing {sortedEngineers.length} engineers
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
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

              {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                  Loading engineers...
                </div>
              ) : error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
                  {error}
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedEngineers.map((engineer, index) => (
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

              {!loading && !error && sortedEngineers.length === 0 ? (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                  No engineers found for the selected filters.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
