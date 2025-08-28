import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Mail, Phone, MapPin, Award, Search, GraduationCap, Building2, Star } from "lucide-react"

export default function FacultyPage() {
  const departments = [
    {
      name: "Computer Science",
      head: "Dr. Sarah Johnson",
      faculty: 12,
      description: "Leading research in AI, machine learning, and software engineering",
    },
    {
      name: "Information Technology",
      head: "Prof. Michael Chen",
      faculty: 8,
      description: "Specializing in cybersecurity, network administration, and IT management",
    },
    {
      name: "Software Engineering",
      head: "Dr. Emily Rodriguez",
      faculty: 10,
      description: "Focus on software development methodologies and project management",
    },
    {
      name: "Data Science",
      head: "Dr. James Wilson",
      faculty: 6,
      description: "Expertise in big data analytics, statistics, and business intelligence",
    },
  ]

  const featuredFaculty = [
    {
      name: "Dr. Sarah Johnson",
      title: "Professor & Department Head",
      department: "Computer Science",
      education: "Ph.D. Computer Science, MIT",
      specialization: "Artificial Intelligence, Machine Learning",
      experience: "15 years",
      email: "s.johnson@highlandcollege.edu",
      phone: "(555) 123-4567",
      office: "CS Building, Room 301",
      achievements: ["IEEE Fellow", "Best Teacher Award 2023", "Published 50+ papers"],
      courses: ["Advanced AI", "Machine Learning", "Research Methods"],
    },
    {
      name: "Prof. Michael Chen",
      title: "Associate Professor",
      department: "Information Technology",
      education: "M.S. Information Systems, Stanford",
      specialization: "Cybersecurity, Network Security",
      experience: "12 years",
      email: "m.chen@highlandcollege.edu",
      phone: "(555) 123-4568",
      office: "IT Building, Room 205",
      achievements: ["CISSP Certified", "Industry Partnership Award", "Security Research Grant"],
      courses: ["Network Security", "Ethical Hacking", "IT Management"],
    },
    {
      name: "Dr. Emily Rodriguez",
      title: "Assistant Professor",
      department: "Software Engineering",
      education: "Ph.D. Software Engineering, Carnegie Mellon",
      specialization: "Agile Development, DevOps",
      experience: "8 years",
      email: "e.rodriguez@highlandcollege.edu",
      phone: "(555) 123-4569",
      office: "SE Building, Room 102",
      achievements: ["Agile Certified", "Young Researcher Award", "Open Source Contributor"],
      courses: ["Software Project Management", "Agile Methods", "DevOps Practices"],
    },
    {
      name: "Dr. James Wilson",
      title: "Professor",
      department: "Data Science",
      education: "Ph.D. Statistics, Harvard",
      specialization: "Big Data Analytics, Statistical Modeling",
      experience: "18 years",
      email: "j.wilson@highlandcollege.edu",
      phone: "(555) 123-4570",
      office: "DS Building, Room 401",
      achievements: ["Data Science Excellence Award", "Industry Consultant", "40+ Publications"],
      courses: ["Advanced Statistics", "Big Data Analytics", "Business Intelligence"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Faculty</h1>
          <p className="text-xl text-red-100 max-w-3xl">
            Meet our distinguished faculty members who bring expertise, innovation, and passion to Highland College of
            Technology.
          </p>
        </div>
      </section>

      {/* Faculty Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">45+</div>
              <div className="text-gray-600">Faculty Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Hold Ph.D. Degrees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">12:1</div>
              <div className="text-gray-600">Student-Faculty Ratio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
              <div className="text-gray-600">Research Publications</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="featured">Featured Faculty</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="directory">Faculty Directory</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Featured Faculty Members</h2>
                <p className="text-gray-600 text-lg">
                  Get to know some of our outstanding faculty members who are leaders in their fields.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredFaculty.map((faculty, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-3 rounded-full">
                          <Users className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{faculty.name}</CardTitle>
                          <p className="text-gray-600 font-medium">{faculty.title}</p>
                          <Badge variant="secondary" className="mt-2">
                            {faculty.department}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Education & Experience</h4>
                        <p className="text-gray-600 text-sm">{faculty.education}</p>
                        <p className="text-gray-600 text-sm">{faculty.experience} of teaching experience</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Specialization</h4>
                        <p className="text-gray-600 text-sm">{faculty.specialization}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Contact Information</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {faculty.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {faculty.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {faculty.office}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Achievements</h4>
                        <div className="flex flex-wrap gap-1">
                          {faculty.achievements.map((achievement, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Courses Taught</h4>
                        <div className="flex flex-wrap gap-1">
                          {faculty.courses.map((course, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="departments" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Academic Departments</h2>
                <p className="text-gray-600 text-lg">
                  Explore our academic departments and meet the faculty who lead them.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.map((dept, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{dept.name}</CardTitle>
                          <p className="text-gray-600">Department Head: {dept.head}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">{dept.description}</CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          {dept.faculty} Faculty Members
                        </div>
                        <Button variant="outline" size="sm">
                          View Faculty
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Faculty Excellence</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-3">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Research Excellence</h4>
                    <p className="text-gray-600 text-sm">
                      Our faculty actively contribute to cutting-edge research in their fields
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-3">
                      <GraduationCap className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Industry Experience</h4>
                    <p className="text-gray-600 text-sm">
                      Real-world experience brings practical insights to the classroom
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-3">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Student-Centered</h4>
                    <p className="text-gray-600 text-sm">
                      Dedicated to student success and personalized learning experiences
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="directory" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Faculty Directory</h2>
                <p className="text-gray-600 text-lg mb-6">Search and browse our complete faculty directory.</p>

                <Card className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input placeholder="Search by name, department, or specialization..." className="h-10" />
                    </div>
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample faculty cards - in a real app, this would be populated from a database */}
                {[...Array(12)].map((_, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">Dr. Faculty Member {index + 1}</h4>
                          <p className="text-sm text-gray-600">Associate Professor</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            Computer Science
                          </Badge>
                          <div className="mt-2 space-y-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              faculty{index + 1}@highlandcollege.edu
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              Building A, Room {100 + index}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline">Load More Faculty</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
