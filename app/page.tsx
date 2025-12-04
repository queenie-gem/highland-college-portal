"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  Library,
  LogIn,
  Newspaper,
  Users,
  ArrowRight,
  Award,
  Globe,
  Facebook,
  Youtube,
  Instagram,
  Calendar,
  DollarSign,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useScrollReveal from "@/hooks/useScrollReveal";

const heroImages = [
  {
    src: "/images/image.png",
    alt: "Students studying in modern library",
    title: "Excellence in Learning",
    subtitle: "State-of-the-art facilities for academic success",
  },
  {
    src: "/images/matric23.8.jpg",
    alt: "Students walking on campus",
    title: "Vibrant Campus Life",
    subtitle: "Join our thriving academic community",
  },
  {
    src: "/images/hd lab.jpg",
    alt: "University lecture hall",
    title: "Expert Faculty",
    subtitle: "Learn from industry professionals and academics",
  },
  {
    src: "/images/higland.jpg",
    alt: "Computer science lab",
    title: "Cutting-Edge Technology",
    subtitle: "Hands-on experience with latest technology",
  },
  {
    src: "/images/IMG_20250721_152806.jpg",
    alt: "Graduation ceremony",
    title: "Your Success Story",
    subtitle: "Join our successful graduates making impact worldwide",
  },
  {
    src: "/images/IMG_20250721_152742.jpg",
    alt: "Graduation ceremony",
    title: "Your Success Story",
    subtitle: "Join our successful graduates making impact worldwide",
  },
];

export default function HomePage() {
  useScrollReveal();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-0 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* <div className="absolute inset-0 bg-gradient-to-r from-red-800/80 to-red-100/80" /> */}
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 text-white">
          <div className="mb-4">
            <h2 className="text-lg md:text-xl font-medium text-red-100 mb-2">
              {heroImages[currentSlide].title}
            </h2>
            <p className="text-sm md:text-base text-red-200">
              {heroImages[currentSlide].subtitle}
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Highland College of Technology
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-red-100">
            Empowering students with knowledge, innovation, and leadership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Link href="/prospective-students#admission">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-red-900 bg-transparent"
            >
              {/* <Link href="/student-portal">
                Visit Student Portal
                <LogIn className="ml-2 h-5 w-5" />
              </Link> */}
            </Button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <Award className="h-8 w-8 text-red-800" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Graduates</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">20+</h3>
              <p className="text-gray-600">Academic Program</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">17+</h3>
              <p className="text-gray-600">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rector’s Message Section */}
      <section className="py-16 bg-gray-50">
        <div className="reveal reveal-right max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          {/* Rector Image */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-red-500 p-6 rounded-2xl shadow">
            <img
              src="/images/rector.jpg"
              alt="Rector of Highland College"
              className="w-full h-auto object-cover transition-transform duration-700 ease-in-out hover:scale-105"
            />
          </div>

          {/* Rector Speech */}
          <div
            className="translate-x-10 transition-all duration-1000 ease-out"
            data-animate="slide-in"
          >
            <h2 className="text-2xl font-bold  text-red-500  mb-4">
              Message from the Rector
            </h2>
            <p className="text-gray-900 leading-relaxed">
              Welcome to Highland College of Technology, a place where
              innovation meets purpose and where students are empowered to build
              the future. At Highland College, we pride ourselves on offering a
              learning environment that blends technical excellence, hands-on
              training, and real-world problem-solving. Our mission is to
              nurture creative thinkers, skilled innovators, and confident
              professionals who are prepared to excel in the global technology
              landscape. Every program we offer is designed with industry
              relevance in mind—ensuring that our students graduate with the
              knowledge, character, and practical experience needed to succeed.
              Whether you are beginning your academic journey or advancing your
              skills, you will find a vibrant community of passionate learners,
              experienced educators, and supportive staff ready to guide your
              growth. I invite you to explore our campus, engage with our
              resources, and take advantage of the opportunities available.
              Together, let us shape a future defined by brilliance, resilience,
              and technological advancement. Welcome to Highland College of
              Technology — where your journey to greatness begins.
            </p>
            <p className="text-2xl font-semibold text-black-600">
              — Rector, Dr Catherine Olayinka Fatoki
            </p>
          </div>
        </div>
      </section>
      {/* Chairman’s Message Section */}
      <section className="py-16 bg-white">
        <div className="reveal reveal-left max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          {/* Chairman Speech */}
          <div
            className="-translate-x-10 transition-all duration-1000 ease-out md:ml-0 ml-10"
            data-animate="slide-in"
          >
            <h2 className="text-3xl font-bold text-red-500 mb-4">
              Message from the Chairman
            </h2>
            <p className=" text-gray-900 mb-4">
              On behalf of the Governing Council, it is my pleasure to welcome
              you to Highland College of Technology—a leading institution
              committed to academic excellence, innovation, and the holistic
              development of every student. Our vision at Highland College is
              clear: to provide high-quality, industry-driven education that
              equips learners with the skills, mindset, and confidence needed to
              thrive in today’s rapidly evolving world. As an institution built
              on integrity and purpose, we remain dedicated to ensuring that
              every student receives the support, mentorship, and opportunities
              required to excel. We believe strongly in the power of technology
              to transform lives and societies. This is why we continuously
              invest in modern facilities, qualified instructors, and
              cutting-edge educational resources. Our goal is to create a
              dynamic environment where students are inspired to innovate,
              collaborate, and lead. As you begin your journey with us, we
              encourage you to dream boldly, work diligently, and embrace every
              learning experience. You are now part of a community that believes
              in your potential and is committed to your success. Welcome to
              Highland College of Technology — where leaders are shaped and
              futures are built.
            </p>
            <p className="text-2xl font-semibold text-black-900">
              — Chairman, Eng. Segun Fatoki 
            </p>
          </div>

          {/* Chairman Image */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-red-500 p-6 rounded-2xl shadow">
            <img
              src="/images/chairman.jpg"
              alt="Chairman of Highland College"
              className="w-full h-auto object-cover transition-transform duration-700 ease-in-out hover:scale-105"
            />
          </div>
        </div>
      </section>

   

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Explore Highland College
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* About */}
            <Card className="reveal reveal-up transition-all duration-500 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-2 hover:bg-red-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <BookOpen className="h-6 w-6 text-red-800" />
                  </div>
                  <CardTitle>About</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Learn more about our mission, vision, values, and what sets
                  Highland College apart as a hub of academic excellence.
                </CardDescription>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/about">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Prospective Students */}
            <Card className="reveal reveal-up transition-all duration-500 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-2 hover:bg-red-50">
              <CardHeader>
                <div className="flex items-center gap-3 transition-transform duration-200 hover:scale-105">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Prospective Students</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Thinking of joining us? Explore our admission process,
                  requirements, academic programs, and get access to the
                  Admission Portal.
                </CardDescription>
                <Button asChild className="w-full bg-red-800 hover:bg-red-900">
                  <Link href="/prospective-students">
                    Explore Admission
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Faculty */}
            <Card className="reveal reveal-up transition-all duration-500 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-2 hover:bg-red-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Faculty</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Meet the educators powering Highland College. Browse through
                  departments and connect with experienced faculty members.
                </CardDescription>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/faculty">
                    Meet Our Faculty
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            {/* </div>
  </div>
</section> */}

            {/* Student Portal
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <LogIn className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Student Portal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  For current students — log in to access courses, grades,
                  schedules, and personalized academic tools.
                </CardDescription>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/student-portal">
                    Enter Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card> */}

            {/* Electronic Library Resources
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Library className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Electronic Library</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Browse thousands of digital resources, including eBooks,
                  journals, and research papers — available 24/7 to all
                  students.
                </CardDescription>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/library-resources">
                    Visit eLibrary
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card> */}

            {/* Faculty
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Faculty</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Meet the educators powering Highland College. Browse through
                  departments and connect with experienced faculty members.
                </CardDescription>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/faculty">
                    Meet Our Faculty
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card> */}

            {/* Blog
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <Newspaper className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>Blog</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Stay informed with campus news, student stories, upcoming
                  events, and featured articles from our academic community.
                </CardDescription>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/blog">
                    Read Blog
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-red-900 to-red-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">
                  Highland College of Technology
                </span>
              </div>
              <p className="text-red-100 mb-4">
                Empowering students with knowledge, innovation, and leadership
                since 2007.
              </p>
              <div className="flex space-x-4">
                  <a href="https://www.facebook.com/HighlandCollegeofTechnology" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-100 hover:text-white hover:bg-red-800"
                    >
                      <Facebook className="h-5 w-5" />
                    </Button>
                  </a>
                  <a href="https://www.youtube.com/@highlandcollegeoftechnolog2181" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-100 hover:text-white hover:bg-red-800"
                    >
                  <Youtube className="h-5 w-5" />
                </Button>
                  </a>
                  <a href="https://www.instagram.com/hctibadanng" target="_blank" rel="noopener noreferrer">
                    <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-100 hover:text-white hover:bg-red-800"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                  </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-red-100 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prospective-students"
                    className="text-red-100 hover:text-white"
                  >
                    Apply
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/library-resources"
                    className="text-red-100 hover:text-white"
                  >
                    Library
                  </Link>
                </li> */}
                {/* <li>
                  <Link href="/blog" className="text-red-100 hover:text-white">
                    Blog
                  </Link>
                </li> */}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="text-red-100 space-y-2 text-sm">
                <p className="font-medium">Highland College of Technology</p>
                <p>Adjacent Dominican Community</p>
                <p>Off UI/Sango Road</p>
                <p>Education Zone, Samonda</p>
                <div className="mt-3 space-y-1">
                  <p>📞 (+234) 708 514 2576</p>
                  <p>📞 (+234) 805 350 7454</p>
                  <p>📞 (+234) 708 007 3489</p>
                  <p>📧 segun@highlandtech.edu.ng</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-red-800 mt-8 pt-8 text-center text-red-100">
            <p>
              &copy; {new Date().getFullYear()} Highland College of Technology.
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
