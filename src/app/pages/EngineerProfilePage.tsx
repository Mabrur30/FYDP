import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  Award,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { getAuthToken } from "../utils/auth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

type ProfileProject = {
  id: string;
  title: string;
  location: string;
  year: number;
  status: string;
};

type ProfileReview = {
  id: string;
  client: string;
  project: string;
  rating: number;
  comment: string;
  date: string;
};

type EngineerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  title?: string;
  bio?: string;
  specialties?: string[];
  imageUrl?: string;
  hourlyRate?: string;
  location: string;
  experience_years: number;
  is_verified: boolean;
  rating: number;
  createdAt?: string;
};

type EngineerProfileResponse = {
  engineer: EngineerProfile;
  summary: string;
  stats: {
    totalProjects: number;
    completedProjects: number;
    reviewCount: number;
    averageRating: number;
    successRate: number;
    memberSince: string;
  };
  projects: ProfileProject[];
  reviews: ProfileReview[];
};

function getStoredEngineerId() {
  if (typeof window === "undefined") return null;

  const rawAuthUser = window.localStorage.getItem("authUser");
  if (!rawAuthUser) return null;

  try {
    const authUser = JSON.parse(rawAuthUser) as {
      _id?: string;
      id?: string;
    };
    return authUser._id || authUser.id || null;
  } catch {
    return null;
  }
}

function safeDateLabel(value: string | undefined) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={18}
      className={
        index < Math.round(rating)
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-300"
      }
    />
  ));
}

export function EngineerProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("about");
  const [profile, setProfile] = useState<EngineerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const profileId = id || getStoredEngineerId();
  const token = getAuthToken();

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!profileId) {
        if (isMounted) {
          setError("No engineer profile id was found.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/engineers/${profileId}/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load engineer profile");
        }

        if (isMounted) {
          setProfile(data as EngineerProfileResponse);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load engineer profile",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [profileId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-lg">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E88E5]" />
            <p className="text-lg font-semibold text-slate-800">
              Loading engineer profile...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl rounded-2xl border border-red-200 bg-white px-8 py-10 text-center shadow-lg">
            <p className="text-2xl font-bold text-slate-900">
              Profile unavailable
            </p>
            <p className="mt-3 text-slate-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const engineer = profile.engineer;
  const specialties =
    engineer.specialties && engineer.specialties.length > 0
      ? engineer.specialties
      : [engineer.specialization];
  const avatarText = initialsFromName(engineer.name);
  const averageRating = profile.stats.averageRating.toFixed(1);
  const memberSince = safeDateLabel(profile.stats.memberSince);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(30,136,229,0.35),_transparent_38%),radial-gradient(circle_at_right,_rgba(255,143,0,0.20),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[auto,1fr] lg:items-center">
            <div className="flex items-start gap-5">
              <div className="relative">
                {engineer.imageUrl ? (
                  <img
                    src={engineer.imageUrl}
                    alt={engineer.name}
                    className="h-32 w-32 rounded-3xl border-4 border-white/20 object-cover shadow-2xl"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1E88E5] to-[#0F4C81] text-4xl font-bold shadow-2xl">
                    {avatarText || "CH"}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-full border-4 border-slate-950 bg-emerald-500">
                  <CheckCircle size={20} className="text-white" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {engineer.name}
                  </h1>
                  {engineer.is_verified ? (
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">
                      Verified
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xl text-slate-200">
                  {engineer.title || engineer.specialization}
                </p>
                <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-sky-300" />
                    <span>{engineer.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} className="text-sky-300" />
                    <span>{engineer.experience_years}+ years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-sky-300" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(profile.stats.averageRating)}
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {averageRating}
                  </span>
                  <span className="text-slate-300">
                    ({profile.stats.reviewCount} reviews)
                  </span>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${engineer.email}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#1E88E5] px-5 py-3 font-semibold text-white shadow-lg shadow-sky-900/30 transition hover:bg-[#1565C0]"
                  >
                    <Mail size={18} className="mr-2" />
                    Email Engineer
                  </a>
                  <a
                    href={`tel:${engineer.phone}`}
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    <Phone size={18} className="mr-2" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Completed Projects</p>
                  <Award className="text-sky-300" size={22} />
                </div>
                <p className="mt-3 text-3xl font-bold text-white">
                  {profile.stats.completedProjects}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {profile.stats.totalProjects} total tracked
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Average Rating</p>
                  <Star className="text-yellow-300" size={22} />
                </div>
                <p className="mt-3 text-3xl font-bold text-white">
                  {averageRating}/5
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {profile.stats.reviewCount} verified reviews
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Success Rate</p>
                  <CheckCircle className="text-emerald-300" size={22} />
                </div>
                <p className="mt-3 text-3xl font-bold text-white">
                  {profile.stats.successRate}%
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Based on completed projects
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Experience</p>
                  <Calendar className="text-violet-300" size={22} />
                </div>
                <p className="mt-3 text-3xl font-bold text-white">
                  {engineer.experience_years}+ yrs
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Active in {engineer.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
          <TabsList className="h-auto w-full justify-start space-x-8 border-b bg-transparent p-0">
            <TabsTrigger
              value="about"
              className="rounded-none px-0 pb-4 text-lg data-[state=active]:border-b-2 data-[state=active]:border-[#1E88E5] data-[state=active]:bg-transparent"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="rounded-none px-0 pb-4 text-lg data-[state=active]:border-b-2 data-[state=active]:border-[#1E88E5] data-[state=active]:bg-transparent"
            >
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none px-0 pb-4 text-lg data-[state=active]:border-b-2 data-[state=active]:border-[#1E88E5] data-[state=active]:bg-transparent"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="rounded-none px-0 pb-4 text-lg data-[state=active]:border-b-2 data-[state=active]:border-[#1E88E5] data-[state=active]:bg-transparent"
            >
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl bg-white p-8 shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-slate-900">
                    Profile Summary
                  </h2>
                  <p className="mt-4 leading-8 text-slate-700">
                    {profile.summary}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-3xl bg-white p-8 shadow-lg"
                >
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Recent Work
                    </h2>
                    <span className="text-sm text-slate-500">
                      {profile.projects.length} projects loaded from the
                      database
                    </span>
                  </div>

                  {profile.projects.length > 0 ? (
                    <div className="space-y-5">
                      {profile.projects.slice(0, 3).map((project) => (
                        <div
                          key={project.id}
                          className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5"
                        >
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                            <Building size={24} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {project.title}
                              </h3>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {project.status.replaceAll("_", " ")}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                              {project.location} • {project.year}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                      No project records are linked to this engineer yet.
                    </div>
                  )}
                </motion.section>
              </div>

              <div className="space-y-6">
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl bg-white p-6 shadow-lg"
                >
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    Professional Details
                  </h3>
                  <div className="space-y-4 text-sm text-slate-700">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-[#1E88E5]" size={18} />
                      <span>{engineer.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-[#1E88E5]" size={18} />
                      <span>{engineer.experience_years}+ years experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="text-[#1E88E5]" size={18} />
                      <span>{engineer.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-[#1E88E5]" size={18} />
                      <span>{engineer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="text-[#1E88E5]" size={18} />
                      <span>Member since {memberSince}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-emerald-500" size={18} />
                      <span>
                        {engineer.is_verified
                          ? "Verified profile"
                          : "Verification pending"}
                      </span>
                    </div>
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-3xl bg-white p-6 shadow-lg"
                >
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full bg-[#1E88E5]/10 px-4 py-2 text-sm font-semibold text-[#1E88E5]"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-3xl bg-white p-6 shadow-lg"
                >
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    Live Rating
                  </h3>
                  <p className="text-4xl font-bold text-[#1E88E5]">
                    {averageRating}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Calculated from {profile.stats.reviewCount} stored reviews.
                  </p>
                </motion.section>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <h2 className="text-3xl font-bold text-slate-900">
                  Portfolio Projects
                </h2>
                <span className="text-sm text-slate-500">
                  Showing the latest {Math.min(profile.projects.length, 6)}{" "}
                  records
                </span>
              </div>

              {profile.projects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {profile.projects.map((project, index) => (
                    <motion.article
                      key={project.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.06 }}
                      className="overflow-hidden rounded-3xl bg-white shadow-lg"
                    >
                      <div className="flex h-36 items-center justify-between bg-gradient-to-br from-sky-600 to-slate-900 px-6 text-white">
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                            Project
                          </p>
                          <h3 className="mt-2 text-xl font-bold">
                            {project.title}
                          </h3>
                        </div>
                        <Building size={34} className="text-white/80" />
                      </div>
                      <div className="space-y-3 p-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={14} />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar size={14} />
                          <span>{project.year}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle size={14} />
                          <span>{project.status.replaceAll("_", " ")}</span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                  No portfolio records are available for this engineer.
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl font-bold text-slate-900">
                  Client Reviews
                </h2>
                <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                  <Star size={24} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-3xl font-bold text-slate-900">
                    {averageRating}
                  </span>
                  <span className="text-slate-500">
                    ({profile.stats.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {profile.reviews.length > 0 ? (
                <div className="space-y-5">
                  {profile.reviews.map((review, index) => (
                    <motion.article
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="rounded-3xl bg-white p-6 shadow-lg"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {review.client}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {review.project} • {safeDateLabel(review.date)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="mt-4 italic leading-7 text-slate-700">
                        “{review.comment}”
                      </p>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                  No review records are linked to this engineer yet.
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="contact" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h2 className="mb-8 text-3xl font-bold text-slate-900">
                Contact Information
              </h2>

              <div className="space-y-5 rounded-3xl bg-white p-8 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-[#1E88E5]">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-semibold text-slate-900">
                      {engineer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-[#FF8F00]">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-semibold text-slate-900">
                      {engineer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-semibold text-slate-900">
                      {engineer.location}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 pt-5 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Specialization</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {engineer.title || engineer.specialization}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Member Since</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {memberSince}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Experience</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {engineer.experience_years}+ years
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Profile Status</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {engineer.is_verified
                        ? "Verified"
                        : "Pending verification"}
                    </p>
                  </div>
                </div>

                <div className="pt-3">
                  <Button
                    type="button"
                    className="h-14 w-full bg-[#1E88E5] text-lg font-bold text-white hover:bg-[#1565C0]"
                    onClick={() =>
                      window.location.assign(`mailto:${engineer.email}`)
                    }
                  >
                    <Mail className="mr-2" size={18} />
                    Send Email
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
