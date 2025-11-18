import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Heart, Award, Users, BookOpen, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-red-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Highland College of Technology
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6">
            Building Innovators. Shaping Leaders. Transforming Futures.
          </p>
          <p className="text-lg text-blue-100 max-w-4xl mx-auto">
            At Highland College of Technology, we are more than an institution — 
            we are Nigeria’s foremost innovation-driven college committed to raising a 
            new generation of creators, problem-solvers, and industry-ready professionals. 
            Our story is one of vision, passion, and an unshakeable belief that education 
            empowers students with the skills and confidence to change their world.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  To deliver world-class, industry-relevant education that equips students 
                  with practical skills, critical thinking, innovation, and strong ethical values, 
                  preparing them to excel in their careers and impact society.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  To be a leading institution recognized across Africa for Innovation, Excellence in Education, 
                  and Producing exceptional graduates who lead in technology, business, and community development.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-purple-100 p-3 rounded-full w-fit mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Our Core Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Teamwork</Badge>
                  <Badge variant="secondary">Integrity</Badge>
                  <Badge variant="secondary">Innovation</Badge>
                  <Badge variant="secondary">Leadership</Badge>
                  <Badge variant="secondary">Discipline</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Founded in 2007, Highland College of Technology began as a small hub for technical education with a bold dream — 
              to bridge the gap between classroom learning and real industry needs.
            </p>
            <p>
              From just 50 pioneering students, we have grown into a thriving community of over 2,000 learners, powered by 
              a shared passion for excellence.
            </p>
            <p>
              Over the years, we have built a reputation for hands-on training, real-world project experience, leadership 
              and entrepreneurship development, personalized academic support, and a curriculum shaped by both industry experts 
              and seasoned academics.
            </p>
            <p>
              Today, Highland College stands as a dynamic force in technology education, shaping future innovators ready to compete globally.
            </p>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Sets Us Apart</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Industry-Relevant Education</h3>
              <p className="text-gray-600 text-sm">
                Programs designed by experts to reflect the latest trends, technologies, and skills employers value.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Leading Faculty</h3>
              <p className="text-gray-600 text-sm">
                Instructors are seasoned professionals and academics committed to student success.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Modern Learning Environment</h3>
              <p className="text-gray-600 text-sm">
                State-of-the-art laboratories, digital learning tools, and innovation-friendly spaces.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Proven Career Success</h3>
              <p className="text-gray-600 text-sm">
                95% of graduates secure employment or internships within 6 months of graduation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Key Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Accreditation Excellence</h4>
                <p className="text-gray-600">Fully accredited by the National Board for Technical Education (NBTE).</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Industry Partnerships</h4>
                <p className="text-gray-600">Collaborations with 50+ leading technology companies for real-world exposure.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Graduate Success</h4>
                <p className="text-gray-600">95% employment or internship rate within 6 months of graduation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join a community built on excellence, innovation, and integrity. Explore our programs and start your application today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Link href="/prospective-students">
                Explore Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-900"
            >
              <Link href="/faculty">
                Meet Our Faculty
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
