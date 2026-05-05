import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Calculator,
  CheckCircle,
  FileText,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1667294051432-6c6b5e273080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwRGhha2ElMjBza3lsaW5lfGVufDF8fHx8MTc3Mzk0NzY5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
          {/* Blueprint Pattern Overlay */}
          <div
            className="absolute inset-0 -z-10 opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1721244654392-9c912a6eb236?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBibHVlcHJpbnQlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3Mzk0NzY5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
              backgroundSize: "cover",
              mixBlendMode: "overlay",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            HIRE VERIFIED CIVIL ENGINEERS
            <br />
            <span className="text-[#1E88E5]">GET AI COST ESTIMATES</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-10"
          >
            Bangladesh's leading marketplace for construction projects
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/post-project">
              <Button className="bg-[#FF8F00] hover:bg-[#F57C00] text-white px-10 py-7 text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all">
                POST PROJECT
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/engineers">
              <Button
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#1A1A1A] px-10 py-7 text-lg transition-all"
              >
                BROWSE ENGINEERS
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white"
          >
            <div className="flex items-center space-x-2">
              <Users size={24} className="text-[#1E88E5]" />
              <span className="text-lg font-semibold">500+ Engineers</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp size={24} className="text-[#1E88E5]" />
              <span className="text-lg font-semibold">95% Cost Accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield size={24} className="text-[#1E88E5]" />
              <span className="text-lg font-semibold">1000+ Projects</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3 Feature Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 cursor-pointer"
            >
              <div className="w-16 h-16 bg-[#1E88E5] rounded-xl flex items-center justify-center mb-6">
                <Calculator size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                AI Cost Calculator
              </h3>
              <p className="text-gray-600 mb-6">
                Get instant, accurate cost estimates for your construction
                project powered by AI technology. Save time and plan better.
              </p>
              <Link to="/cost-estimator">
                <Button
                  variant="link"
                  className="text-[#1E88E5] p-0 hover:underline"
                >
                  Try Calculator <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 cursor-pointer"
            >
              <div className="w-16 h-16 bg-[#FF8F00] rounded-xl flex items-center justify-center mb-6">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Verified Engineers
              </h3>
              <p className="text-gray-600 mb-6">
                Browse through 500+ verified civil engineers with proven track
                records. All credentials thoroughly checked.
              </p>
              <Link to="/engineers">
                <Button
                  variant="link"
                  className="text-[#1E88E5] p-0 hover:underline"
                >
                  Find Engineers <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 cursor-pointer"
            >
              <div className="w-16 h-16 bg-[#1E88E5] rounded-xl flex items-center justify-center mb-6">
                <FileText size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Ready Designs
              </h3>
              <p className="text-gray-600 mb-6">
                Access pre-approved building designs and blueprints. Speed up
                your construction planning and approvals.
              </p>
              <Link to="/engineers">
                <Button
                  variant="link"
                  className="text-[#1E88E5] p-0 hover:underline"
                >
                  View Designs <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
              How CivilHub Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to start your construction project
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Post Project",
                desc: "Describe your construction needs and budget",
              },
              {
                step: "02",
                title: "Get Estimates",
                desc: "Receive AI-powered cost estimates instantly",
              },
              {
                step: "03",
                title: "Choose Engineer",
                desc: "Browse proposals from verified professionals",
              },
              {
                step: "04",
                title: "Start Building",
                desc: "Begin your project with confidence",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#1E88E5] to-[#1565C0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1E88E5] to-[#1565C0] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Start Your Project?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-10"
          >
            Join thousands of satisfied clients who found their perfect engineer
            on CivilHub
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/post-project">
              <Button className="bg-[#FF8F00] hover:bg-[#F57C00] text-white px-12 py-7 text-lg shadow-2xl hover:scale-105 transition-all">
                GET STARTED NOW
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
