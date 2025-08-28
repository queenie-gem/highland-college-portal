import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Newspaper, Calendar, User, Search, Tag, ArrowRight, Clock, Eye, MessageCircle, TrendingUp } from "lucide-react"

export default function BlogPage() {
  const featuredPosts = [
    {
      id: 1,
      title: "Highland College Launches New AI Research Lab",
      excerpt:
        "Our new state-of-the-art artificial intelligence research laboratory opens its doors, featuring cutting-edge equipment and collaborative spaces for students and faculty.",
      author: "Dr. Sarah Johnson",
      date: "2024-01-15",
      category: "Research",
      readTime: "5 min read",
      views: 1250,
      comments: 23,
      featured: true,
    },
    {
      id: 2,
      title: "Student Startup Wins National Tech Competition",
      excerpt:
        "Highland College students take first place in the National Student Innovation Challenge with their groundbreaking cybersecurity solution.",
      author: "Prof. Michael Chen",
      date: "2024-01-12",
      category: "Student Success",
      readTime: "3 min read",
      views: 890,
      comments: 15,
      featured: true,
    },
    {
      id: 3,
      title: "Industry Partnership Program Expands",
      excerpt:
        "We're excited to announce new partnerships with leading tech companies, providing more internship and job opportunities for our students.",
      author: "Career Services",
      date: "2024-01-10",
      category: "Partnerships",
      readTime: "4 min read",
      views: 675,
      comments: 8,
      featured: true,
    },
  ]

  const recentPosts = [
    {
      id: 4,
      title: "Spring Semester Registration Now Open",
      excerpt:
        "Current students can now register for spring semester courses. New course offerings include Advanced Machine Learning and Blockchain Development.",
      author: "Registrar Office",
      date: "2024-01-08",
      category: "Announcements",
      readTime: "2 min read",
      views: 445,
      comments: 5,
    },
    {
      id: 5,
      title: "Faculty Spotlight: Dr. Emily Rodriguez",
      excerpt:
        "Meet our Software Engineering professor who recently published groundbreaking research on agile development methodologies.",
      author: "Communications Team",
      date: "2024-01-05",
      category: "Faculty",
      readTime: "6 min read",
      views: 320,
      comments: 12,
    },
    {
      id: 6,
      title: "Campus Sustainability Initiative Update",
      excerpt:
        "Learn about our progress toward carbon neutrality and new green technology implementations across campus.",
      author: "Facilities Management",
      date: "2024-01-03",
      category: "Campus Life",
      readTime: "4 min read",
      views: 280,
      comments: 7,
    },
    {
      id: 7,
      title: "Alumni Success Story: Tech Entrepreneur Journey",
      excerpt:
        "Highland College graduate shares insights from building a successful tech startup and gives back to current students.",
      author: "Alumni Relations",
      date: "2023-12-28",
      category: "Alumni",
      readTime: "7 min read",
      views: 520,
      comments: 18,
    },
    {
      id: 8,
      title: "Winter Break Research Projects Showcase",
      excerpt:
        "Students present their independent research projects completed during winter break, showcasing innovation and creativity.",
      author: "Academic Affairs",
      date: "2023-12-20",
      category: "Research",
      readTime: "5 min read",
      views: 380,
      comments: 9,
    },
  ]

  const categories = [
    { name: "All", count: 45 },
    { name: "Research", count: 12 },
    { name: "Student Success", count: 8 },
    { name: "Faculty", count: 6 },
    { name: "Campus Life", count: 10 },
    { name: "Announcements", count: 5 },
    { name: "Alumni", count: 4 },
  ]

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Research: "bg-blue-100 text-blue-800",
      "Student Success": "bg-green-100 text-green-800",
      Faculty: "bg-purple-100 text-purple-800",
      "Campus Life": "bg-orange-100 text-orange-800",
      Announcements: "bg-red-100 text-red-800",
      Alumni: "bg-teal-100 text-teal-800",
      Partnerships: "bg-indigo-100 text-indigo-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-teal-900 to-teal-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Highland College Blog</h1>
          <p className="text-xl text-teal-100 max-w-3xl">
            Stay connected with campus news, student achievements, faculty insights, and the latest developments at
            Highland College of Technology.
          </p>
        </div>
      </section>

      {/* Blog Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">150+</div>
              <div className="text-gray-600">Blog Posts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">25K+</div>
              <div className="text-gray-600">Monthly Readers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Comments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
              <div className="text-gray-600">Contributors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="featured">Featured Posts</TabsTrigger>
              <TabsTrigger value="recent">Recent Posts</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Featured Stories</h2>
                <p className="text-gray-600 text-lg">
                  Discover the most important news and updates from Highland College.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Featured Post */}
                <div className="lg:col-span-2">
                  <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-video bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
                      <Newspaper className="h-16 w-16 text-white" />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(featuredPosts[0].category)}>
                          {featuredPosts[0].category}
                        </Badge>
                        <Badge variant="secondary">Featured</Badge>
                      </div>
                      <CardTitle className="text-2xl">{featuredPosts[0].title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featuredPosts[0].author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(featuredPosts[0].date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredPosts[0].readTime}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">{featuredPosts[0].excerpt}</CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {featuredPosts[0].views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {featuredPosts[0].comments}
                          </div>
                        </div>
                        <Button>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Secondary Featured Posts */}
                {featuredPosts.slice(1).map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-white" />
                    </div>
                    <CardHeader>
                      <Badge className={`${getCategoryColor(post.category)} w-fit`}>{post.category}</Badge>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-3 w-3" />
                        {post.author}
                        <Calendar className="h-3 w-3 ml-2" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm mb-4">{post.excerpt}</CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>{post.readTime}</span>
                          <span>{post.views} views</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="mt-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-4">Recent Posts</h2>
                    <Card className="p-4">
                      <div className="flex gap-4">
                        <Input placeholder="Search blog posts..." className="flex-1" />
                        <Button>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    {recentPosts.map((post) => (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Badge className={`${getCategoryColor(post.category)} mb-2`}>{post.category}</Badge>
                              <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {post.author}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(post.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {post.readTime}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base mb-4">{post.excerpt}</CardDescription>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                {post.comments}
                              </div>
                            </div>
                            <Button variant="outline">
                              Read More
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Button variant="outline" size="lg">
                      Load More Posts
                    </Button>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-80 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Popular Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {featuredPosts.slice(0, 3).map((post, index) => (
                        <div key={post.id} className="flex gap-3">
                          <div className="bg-teal-100 text-teal-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm leading-tight">{post.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{post.views} views</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.name} className="flex items-center justify-between">
                            <Button variant="ghost" className="justify-start p-0 h-auto">
                              {category.name}
                            </Button>
                            <Badge variant="secondary" className="text-xs">
                              {category.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
                <p className="text-gray-600 text-lg">Explore posts organized by topic and interest area.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories
                  .filter((cat) => cat.name !== "All")
                  .map((category) => (
                    <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <Badge variant="secondary">{category.count} posts</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          {category.name === "Research" && "Latest research developments and academic achievements"}
                          {category.name === "Student Success" &&
                            "Celebrating our students' accomplishments and milestones"}
                          {category.name === "Faculty" && "Faculty spotlights, achievements, and insights"}
                          {category.name === "Campus Life" && "Campus events, activities, and community updates"}
                          {category.name === "Announcements" && "Important college announcements and updates"}
                          {category.name === "Alumni" && "Alumni success stories and networking events"}
                        </CardDescription>
                        <Button variant="outline" className="w-full mt-4">
                          View Posts
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-teal-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-teal-100 mb-8">
            Subscribe to our newsletter to receive the latest news and updates from Highland College.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input placeholder="Enter your email address" className="bg-white text-gray-900" />
            <Button className="bg-orange-500 hover:bg-orange-600">Subscribe</Button>
          </div>
          <p className="text-sm text-teal-200 mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  )
}
