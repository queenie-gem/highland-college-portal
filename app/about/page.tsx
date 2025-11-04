import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Heart, Award, Users, BookOpen, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-red-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Highland College</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Discover our story, mission, and commitment to academic excellence that has shaped thousands of successful
            careers.
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
                  To provide quality education that empowers students with practical skills, critical thinking, and
                  ethical values needed to excel in their chosen fields and contribute meaningfully to society.
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
                  To be a leading institution of higher learning recognized for innovation, excellence in education, and
                  producing graduates who are leaders in their professions and communities.
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

      {/* History & Achievements */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2007, Highland College of Technology began as a small institution with a big vision: to
                  bridge the gap between academic learning and industry needs. What started with just 50 students has
                  grown into a thriving community of over 2,000 students.
                </p>
                <p>
                  Over the years, we've continuously evolved our programs to meet the changing demands of the technology
                  sector, while maintaining our commitment to personalized education and student success.
                </p>
                <p>
                  Today, Highland College stands as a testament to what's possible when passion meets purpose, and we
                  continue to shape the future through education.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Key Achievements</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Accreditation Excellence</h4>
                    <p className="text-gray-600">Fully accredited by the National Board of Technical Education</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Industry Partnerships</h4>
                    <p className="text-gray-600">Strategic partnerships with 50+ leading technology companies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Graduate Success</h4>
                    <p className="text-gray-600">95% employment rate within 6 months of graduation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Highland */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Highland College?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Quality Education</h3>
              <p className="text-gray-600 text-sm">Industry-relevant curriculum designed by experts</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Expert Faculty</h3>
              <p className="text-gray-600 text-sm">Experienced professionals and academic scholars</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Modern Facilities</h3>
              <p className="text-gray-600 text-sm">State-of-the-art labs and learning environments</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Career Support</h3>
              <p className="text-gray-600 text-sm">Comprehensive career guidance and placement assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Take the first step towards a successful career in technology. Explore our programs and start your
            application today.
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
