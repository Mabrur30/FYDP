import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  MapPin,
  Star,
  Award,
  Briefcase,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

const portfolioProjects = [
  {
    id: 1,
    title: "10-Story Commercial Tower",
    location: "Gulshan, Dhaka",
    year: 2025,
    image:
      "https://images.unsplash.com/photo-1769721209842-e46c60e7fbf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25zdHJ1Y3Rpb24lMjBidWlsZGluZ3xlbnwxfHx8fDE3NzM4NTkzNDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    title: "Residential Complex",
    location: "Banani, Dhaka",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1768321903885-d0a6798485d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBwcm9qZWN0JTIwY29tcGxldGVkfGVufDF8fHx8MTc3Mzg0ODM4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    title: "Bridge Foundation Design",
    location: "Chittagong",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1667294051432-6c6b5e273080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwRGhha2ElMjBza3lsaW5lfGVufDF8fHx8MTc3Mzk0NzY5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 4,
    title: "Industrial Warehouse",
    location: "Gazipur",
    year: 2023,
    image:
      "https://images.unsplash.com/photo-1760009436767-d154e930e55c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0ZWFtJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzkxODMxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 5,
    title: "Luxury Villa",
    location: "Dhanmondi, Dhaka",
    year: 2023,
    image:
      "https://images.unsplash.com/photo-1769721209842-e46c60e7fbf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25zdHJ1Y3Rpb24lMjBidWlsZGluZ3xlbnwxfHx8fDE3NzM4NTkzNDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 6,
    title: "Shopping Complex",
    location: "Mirpur, Dhaka",
    year: 2022,
    image:
      "https://images.unsplash.com/photo-1768321903885-d0a6798485d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBwcm9qZWN0JTIwY29tcGxldGVkfGVufDF8fHx8MTc3Mzg0ODM4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

const reviews = [
  {
    id: 1,
    client: "Rahman Corporation",
    rating: 5,
    date: "Feb 2026",
    text: "Excellent structural design expertise. Ahmed delivered a comprehensive foundation analysis for our high-rise project. Very professional and detail-oriented.",
  },
  {
    id: 2,
    client: "City Developers",
    rating: 5,
    date: "Jan 2026",
    text: "Outstanding work on our commercial tower. The RCC design was flawless and approved without any issues. Highly recommended!",
  },
  {
    id: 3,
    client: "Modern Builders Ltd",
    rating: 4,
    date: "Dec 2025",
    text: "Great communication and timely delivery. Ahmed provided valuable insights for our residential complex project.",
  },
];

export function EngineerProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Cover Photo & Profile Header */}
      <section
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1667294051432-6c6b5e273080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwRGhha2ElMjBza3lsaW5lfGVufDF8fHx8MTc3Mzk0NzY5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpbCUyMGVuZ2luZWVyJTIwcHJvZmVzc2lvbmFsJTIwQmFuZ2xhZGVzaHxlbnwxfHx8fDE3NzM5NDc2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Ahmed Khan"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                />
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <CheckCircle size={20} className="text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">
                      Ahmed Khan
                    </h1>
                    <p className="text-xl text-[#1E88E5] font-semibold mb-3">
                      Structural Engineer
                    </p>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin size={18} className="mr-1" />
                        <span>Dhaka, Bangladesh</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase size={18} className="mr-1" />
                        <span>12 years experience</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className="text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="text-lg font-bold text-[#1A1A1A]">
                        4.8
                      </span>
                      <span className="text-gray-500">(127 reviews)</span>
                    </div>
                  </div>

                  <Button className="bg-[#FF8F00] hover:bg-[#F57C00] text-white px-8 py-6 text-lg font-bold shadow-xl">
                    HIRE NOW
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="text-[#1E88E5]" size={24} />
                </div>
                <p className="text-2xl font-bold text-[#1A1A1A]">143</p>
                <p className="text-gray-600 text-sm">Projects Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="text-yellow-400" size={24} />
                </div>
                <p className="text-2xl font-bold text-[#1A1A1A]">4.8/5</p>
                <p className="text-gray-600 text-sm">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <p className="text-2xl font-bold text-[#1A1A1A]">98%</p>
                <p className="text-gray-600 text-sm">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="text-purple-500" size={24} />
                </div>
                <p className="text-2xl font-bold text-[#1A1A1A]">12 Yrs</p>
                <p className="text-gray-600 text-sm">Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
          <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0 space-x-8">
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#1E88E5] rounded-none pb-4 px-0 text-lg"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#1E88E5] rounded-none pb-4 px-0 text-lg"
            >
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#1E88E5] rounded-none pb-4 px-0 text-lg"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#1E88E5] rounded-none pb-4 px-0 text-lg"
            >
              Contact
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-lg p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                    Professional Bio
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    I am a highly experienced structural engineer with over 12
                    years of expertise in designing and managing complex
                    construction projects across Bangladesh. My specialization
                    includes RCC design, foundation engineering, and high-rise
                    building structures.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Throughout my career, I have successfully completed 143
                    projects ranging from residential buildings to large-scale
                    commercial complexes. I am committed to delivering
                    innovative, cost-effective, and structurally sound solutions
                    that exceed client expectations.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    I hold professional certifications from the Institution of
                    Engineers Bangladesh (IEB) and have extensive experience
                    working with local building codes and regulations.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                    Experience Timeline
                  </h2>
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-10 h-10 bg-[#1E88E5] rounded-full flex items-center justify-center">
                          <Building size={20} className="text-white" />
                        </div>
                        <div className="w-0.5 h-full bg-[#1E88E5] mt-2" />
                      </div>
                      <div className="pb-8">
                        <h3 className="font-bold text-[#1A1A1A]">
                          Senior Structural Engineer
                        </h3>
                        <p className="text-[#1E88E5] text-sm">
                          Rahman Engineering Ltd | 2020 - Present
                        </p>
                        <p className="text-gray-600 mt-2">
                          Leading structural design team for commercial and
                          residential projects. Responsible for RCC design,
                          foundation analysis, and project oversight.
                        </p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-10 h-10 bg-[#1E88E5] rounded-full flex items-center justify-center">
                          <Building size={20} className="text-white" />
                        </div>
                        <div className="w-0.5 h-full bg-[#1E88E5] mt-2" />
                      </div>
                      <div className="pb-8">
                        <h3 className="font-bold text-[#1A1A1A]">
                          Structural Engineer
                        </h3>
                        <p className="text-[#1E88E5] text-sm">
                          City Consultants | 2017 - 2020
                        </p>
                        <p className="text-gray-600 mt-2">
                          Designed structural systems for mid-rise buildings and
                          supervised construction projects.
                        </p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-10 h-10 bg-[#1E88E5] rounded-full flex items-center justify-center">
                          <GraduationCap size={20} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1A1A1A]">
                          Junior Engineer
                        </h3>
                        <p className="text-[#1E88E5] text-sm">
                          Construction Associates | 2014 - 2017
                        </p>
                        <p className="text-gray-600 mt-2">
                          Assisted senior engineers in structural design and
                          site supervision for various projects.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-lg p-6 mb-6"
                >
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "RCC Design",
                      "Foundation",
                      "High-Rise",
                      "Earthquake Analysis",
                      "Steel Structures",
                      "Site Supervision",
                    ].map((specialty) => (
                      <span
                        key={specialty}
                        className="px-4 py-2 bg-[#1E88E5]/10 text-[#1E88E5] rounded-full font-semibold"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 mb-6"
                >
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                    Certifications
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle
                        size={18}
                        className="text-[#1E88E5] mr-2 mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700">
                        Licensed Professional Engineer (IEB)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle
                        size={18}
                        className="text-[#1E88E5] mr-2 mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700">
                        Structural Engineering Certification
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle
                        size={18}
                        className="text-[#1E88E5] mr-2 mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700">
                        Project Management Professional
                      </span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                    Hourly Rate
                  </h3>
                  <p className="text-3xl font-bold text-[#1E88E5] mb-2">
                    BDT 2,500 - 3,500
                  </p>
                  <p className="text-gray-600 text-sm">
                    Varies by project complexity
                  </p>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8">
                Portfolio Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin size={14} className="mr-1" />
                        <span>{project.location}</span>
                      </div>
                      <p className="text-[#1E88E5] font-semibold">
                        {project.year}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[#1A1A1A]">
                  Client Reviews
                </h2>
                <div className="flex items-center space-x-2">
                  <Star size={32} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-4xl font-bold text-[#1A1A1A]">4.8</span>
                  <span className="text-gray-600">(127 reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-[#1A1A1A] text-lg">
                          {review.client}
                        </h3>
                        <p className="text-gray-500 text-sm">{review.date}</p>
                      </div>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className="text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{review.text}"</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8">
                Contact Information
              </h2>

              <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#1E88E5] rounded-full flex items-center justify-center">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold text-[#1A1A1A]">
                      ahmed.khan@civilhub.bd
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#FF8F00] rounded-full flex items-center justify-center">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="font-semibold text-[#1A1A1A]">
                      +880 1700-123456
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Location</p>
                    <p className="font-semibold text-[#1A1A1A]">
                      Banani, Dhaka 1213, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button className="w-full bg-[#FF8F00] hover:bg-[#F57C00] text-white h-14 text-lg font-bold">
                    <Mail className="mr-2" size={20} />
                    SEND MESSAGE
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
