import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  BookOpen,
  FileText,
  Newspaper,
  Video,
  Headphones,
  Download,
  ExternalLink,
  Clock,
  Users,
  Globe,
  Bookmark,
} from "lucide-react"

export default function LibraryResourcesPage() {
  const databases = [
    {
      name: "IEEE Xplore Digital Library",
      description: "Access to IEEE journals, conference papers, and standards in engineering and technology",
      category: "Engineering",
      access: "Full Access",
    },
    {
      name: "ACM Digital Library",
      description: "Computing and information technology research papers and publications",
      category: "Computer Science",
      access: "Full Access",
    },
    {
      name: "SpringerLink",
      description: "Scientific, technical and medical journals, books and reference works",
      category: "Science & Technology",
      access: "Full Access",
    },
    {
      name: "ScienceDirect",
      description: "Elsevier's platform for scientific and medical research",
      category: "Science & Medicine",
      access: "Limited Access",
    },
    {
      name: "JSTOR",
      description: "Academic journals, books, and primary sources across disciplines",
      category: "Multidisciplinary",
      access: "Full Access",
    },
    {
      name: "ProQuest",
      description: "Dissertations, theses, and scholarly research across all subjects",
      category: "Research",
      access: "Full Access",
    },
  ]

  const resources = [
    {
      icon: BookOpen,
      title: "eBooks",
      count: "50,000+",
      description: "Digital textbooks and reference materials",
    },
    {
      icon: FileText,
      title: "Research Papers",
      count: "2M+",
      description: "Peer-reviewed academic articles and journals",
    },
    {
      icon: Newspaper,
      title: "Magazines & Newspapers",
      count: "500+",
      description: "Current and archived periodicals",
    },
    {
      icon: Video,
      title: "Video Resources",
      count: "10,000+",
      description: "Educational videos and documentaries",
    },
    {
      icon: Headphones,
      title: "Audio Materials",
      count: "5,000+",
      description: "Audiobooks and recorded lectures",
    },
    {
      icon: Globe,
      title: "Online Databases",
      count: "100+",
      description: "Specialized academic databases",
    },
  ]

  const services = [
    {
      title: "Research Assistance",
      description: "Get help from our librarians with your research projects",
      icon: Users,
      available: "Mon-Fri 9AM-5PM",
    },
    {
      title: "Interlibrary Loan",
      description: "Request materials not available in our collection",
      icon: ExternalLink,
      available: "2-5 business days",
    },
    {
      title: "Citation Help",
      description: "Learn proper citation formats (APA, MLA, Chicago, IEEE)",
      icon: FileText,
      available: "Online tutorials available",
    },
    {
      title: "Digital Archives",
      description: "Access historical documents and institutional records",
      icon: Bookmark,
      available: "24/7 online access",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-900 to-orange-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Electronic Library Resources</h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            Access thousands of digital resources including eBooks, journals, databases, and multimedia content
            available 24/7.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {resources.map((resource, index) => (
              <div key={index} className="text-center">
                <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-2">
                  <resource.icon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{resource.count}</div>
                <div className="text-sm text-gray-600">{resource.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="search">Search Resources</TabsTrigger>
              <TabsTrigger value="databases">Databases</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Search Library Resources</h2>
                  <p className="text-gray-600 text-lg">
                    Find books, articles, videos, and more across all our digital collections.
                  </p>
                </div>

                <Card className="p-6 mb-8">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input placeholder="Search for books, articles, journals, videos..." className="text-lg h-12" />
                    </div>
                    <Button size="lg" className="px-8">
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline">Advanced Search</Badge>
                    <Badge variant="outline">Browse by Subject</Badge>
                    <Badge variant="outline">New Acquisitions</Badge>
                    <Badge variant="outline">Popular Resources</Badge>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        Quick Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Course Reserves
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Newspaper className="h-4 w-4 mr-2" />
                        Current Journals
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Video className="h-4 w-4 mr-2" />
                        Video Library
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-green-600" />
                        Popular Databases
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        IEEE Xplore
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        ACM Digital Library
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        SpringerLink
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        Research Help
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        Ask a Librarian
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Research Guides
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Citation Tools
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="databases" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Academic Databases</h2>
                <p className="text-gray-600 text-lg">
                  Access our comprehensive collection of academic databases and research platforms.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {databases.map((database, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{database.name}</CardTitle>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="secondary">{database.category}</Badge>
                            <Badge variant={database.access === "Full Access" ? "default" : "outline"}>
                              {database.access}
                            </Badge>
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">{database.description}</CardDescription>
                      <Button className="w-full">
                        Access Database
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="collections" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Digital Collections</h2>
                <p className="text-gray-600 text-lg">
                  Explore our diverse digital collections organized by format and subject area.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <resource.icon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <div className="text-2xl font-bold text-orange-600">{resource.count}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">{resource.description}</CardDescription>
                      <Button variant="outline" className="w-full">
                        Browse Collection
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Special Collections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Highland College Archives</h4>
                    <p className="text-gray-600 mb-4">
                      Historical documents, photographs, and records documenting the college's history and development.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Thesis & Dissertation Collection</h4>
                    <p className="text-gray-600 mb-4">
                      Complete collection of student research projects, theses, and dissertations from all programs.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Library Services</h2>
                <p className="text-gray-600 text-lg">
                  Take advantage of our comprehensive library services designed to support your academic success.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <service.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">{service.description}</CardDescription>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock className="h-4 w-4" />
                        {service.available}
                      </div>
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-2xl">Need Help Getting Started?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      Our library orientation sessions help you make the most of our digital resources. Learn search
                      strategies, database navigation, and citation management.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button>
                        Schedule Orientation
                        <Calendar className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        Watch Tutorial Videos
                        <Video className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        Download Quick Guide
                        <Download className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
