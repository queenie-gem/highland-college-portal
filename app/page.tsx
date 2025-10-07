"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const heroImages = [
  {
    src: "/images/image.png",
    alt: "Students studying in modern library",
    title: "Excellence in Learning",
    subtitle: "State-of-the-art facilities for academic success",
  },
  {
    src: "/images/hero-2.png",
    alt: "Students walking on campus",
    title: "Vibrant Campus Life",
    subtitle: "Join our thriving academic community",
  },
  {
    src: "/images/hero-3.png",
    alt: "University lecture hall",
    title: "Expert Faculty",
    subtitle: "Learn from industry professionals and academics",
  },
  {
    src: "/images/hero-4.png",
    alt: "Computer science lab",
    title: "Cutting-Edge Technology",
    subtitle: "Hands-on experience with latest technology",
  },
  {
    src: "/images/hero-5.png",
    alt: "Graduation ceremony",
    title: "Your Success Story",
    subtitle: "Join our successful graduates making impact worldwide",
  },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
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
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-700/80" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 text-white">
          <div className="mb-4">
            <h2 className="text-lg md:text-xl font-medium text-red-100 mb-2">{heroImages[currentSlide].title}</h2>
            <p className="text-sm md:text-base text-red-200">{heroImages[currentSlide].subtitle}</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Highland College of Technology</h1>
          <p className="text-xl md:text-2xl mb-8 text-red-100">
            Empowering students with knowledge, innovation, and leadership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
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
              <Link href="/student-portal">
                Visit Student Portal
                <LogIn className="ml-2 h-5 w-5" />
              </Link>
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
              <p className="text-gray-600">Academic Program (OND)</p>
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

      {/* Academic Resources Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Academic Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Academic Calendar */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Calendar className="h-6 w-6 text-red-800" />
                  </div>
                  <CardTitle>Academic Calendar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>First Semester</span>
                    <span className="font-medium">Sept - Dec 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Second Semester</span>
                    <span className="font-medium">Jan - May 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration</span>
                    <span className="font-medium">Aug 15 - Sept 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Examinations</span>
                    <span className="font-medium">Nov 20 - Dec 15</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Tuition Schedule */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Tuition Schedule</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>ND1 (First Year)</span>
                    <span className="font-medium">₦180,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ND2 (Second Year)</span>
                    <span className="font-medium">₦170,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee</span>
                    <span className="font-medium">₦15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late Payment Fee</span>
                    <span className="font-medium">₦5,000</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Payment Options
                </Button>
              </CardContent>
            </Card>

            {/* Fact Sheet */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Fact Sheet</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Founded</span>
                    <span className="font-medium">2007</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Student Population</span>
                    <span className="font-medium">2,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Faculty Members</span>
                    <span className="font-medium">45+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Programs Offered</span>
                    <span className="font-medium">6 ND Programs</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Previews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Explore Highland College</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* About */}
            <Card className="hover:shadow-lg transition-shadow">
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
                  Learn more about our mission, vision, values, and what sets Highland College apart as a hub of
                  academic excellence.
                </CardDescription>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/about">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Prospective Students */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Prospective Students</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Thinking of joining us? Explore our admission process, requirements, academic programs, and get access
                  to the Admission Portal.
                </CardDescription>
                <Button asChild className="w-full bg-red-800 hover:bg-red-900">
                  <Link href="/prospective-students">
                    Explore Admission
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Student Portal */}
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
                  For current students — log in to access courses, grades, schedules, and personalized academic tools.
                </CardDescription>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/student-portal">
                    Enter Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Electronic Library Resources */}
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
                  Browse thousands of digital resources, including eBooks, journals, and research papers — available
                  24/7 to all students.
                </CardDescription>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/library-resources">
                    Visit eLibrary
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Faculty */}
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
                  Meet the educators powering Highland College. Browse through departments and connect with experienced
                  faculty members.
                </CardDescription>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/faculty">
                    Meet Our Faculty
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Blog */}
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
                  Stay informed with campus news, student stories, upcoming events, and featured articles from our
                  academic community.
                </CardDescription>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/blog">
                    Read Blog
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
                <span className="text-lg font-bold">Highland College of Technology</span>
              </div>
              <p className="text-red-100 mb-4">
                Empowering students with knowledge, innovation, and leadership since 2007.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-red-100 hover:text-white hover:bg-red-800">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-100 hover:text-white hover:bg-red-800">
                  <Youtube className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-100 hover:text-white hover:bg-red-800">
                  <Instagram className="h-5 w-5" />
                </Button>
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
                  <Link href="/prospective-students" className="text-red-100 hover:text-white">
                    Apply
                  </Link>
                </li>
                <li>
                  <Link href="/library-resources" className="text-red-100 hover:text-white">
                    Library
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-red-100 hover:text-white">
                    Blog
                  </Link>
                </li>
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
            <p>&copy; {new Date().getFullYear()} Highland College of Technology. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
