"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LogIn,
  BookOpen,
  Calendar,
  GraduationCap,
  FileText,
  CreditCard,
  MessageSquare,
  Settings,
  HelpCircle,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react"
import { useState } from "react"

export default function StudentPortalPage() {
  const [showPassword, setShowPassword] = useState(false)

  const portalFeatures = [
    {
      icon: BookOpen,
      title: "Course Materials",
      description: "Access lecture notes, assignments, and reading materials",
    },
    {
      icon: GraduationCap,
      title: "Grades & Transcripts",
      description: "View your academic progress and download transcripts",
    },
    {
      icon: Calendar,
      title: "Class Schedule",
      description: "Check your timetable and upcoming classes",
    },
    {
      icon: FileText,
      title: "Assignments",
      description: "Submit assignments and track deadlines",
    },
    {
      icon: CreditCard,
      title: "Financial Information",
      description: "View tuition fees, payments, and financial aid",
    },
    {
      icon: MessageSquare,
      title: "Communication",
      description: "Message professors and classmates",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-900 to-purple-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Student Portal</h1>
          <p className="text-xl text-purple-100 max-w-3xl">
            Access your courses, grades, schedules, and all the tools you need for academic success.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="features">Portal Features</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <Card className="w-full max-w-md mx-auto">
                    <CardHeader className="text-center">
                      <div className="mx-auto bg-purple-100 p-3 rounded-full w-fit mb-4">
                        <LogIn className="h-8 w-8 text-purple-600" />
                      </div>
                      <CardTitle className="text-2xl">Student Login</CardTitle>
                      <CardDescription>Enter your credentials to access the student portal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="student-id">Student ID</Label>
                        <Input id="student-id" placeholder="Enter your student ID" type="text" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <Button className="w-full" size="lg">
                        Sign In
                        <LogIn className="ml-2 h-4 w-4" />
                      </Button>
                      <div className="text-center space-y-2">
                        <Button variant="link" className="text-sm">
                          Forgot your password?
                        </Button>
                        <div className="text-sm text-gray-600">
                          Need help? Contact IT Support:
                          <Button variant="link" className="p-0 ml-1 text-sm">
                            support@highlandcollege.edu
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">First Time Login?</h3>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Shield className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Your Student ID</h4>
                            <p className="text-gray-600 text-sm">
                              Your student ID was provided during enrollment. Check your admission letter or contact the
                              registrar's office.
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Settings className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Default Password</h4>
                            <p className="text-gray-600 text-sm">
                              Your initial password is your date of birth (MMDDYYYY). You'll be prompted to change it on
                              first login.
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
                    <p className="text-yellow-700 text-sm">
                      For security reasons, the portal will automatically log you out after 30 minutes of inactivity.
                      Always log out when using shared computers.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Portal Features</h2>
                <p className="text-gray-600 text-lg">
                  Discover all the tools and resources available through your student portal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portalFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <feature.icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Mobile Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="text-gray-600 mb-4">
                      Access your student portal on the go with our mobile-optimized interface. All features are
                      available on your smartphone or tablet.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Responsive design for all devices
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Push notifications for important updates
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Offline access to downloaded materials
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="font-semibold">Download Our App</p>
                      <p className="text-sm text-gray-600">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="support" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-blue-600" />
                          Frequently Asked Questions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold">How do I reset my password?</h4>
                          <p className="text-gray-600 text-sm">
                            Click "Forgot your password?" on the login page or contact IT support.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Why can't I see my grades?</h4>
                          <p className="text-gray-600 text-sm">
                            Grades are typically posted within 48 hours after submission by your instructor.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">How do I download my transcript?</h4>
                          <p className="text-gray-600 text-sm">
                            Go to Academic Records section and click "Request Transcript".
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6">Contact Support</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 className="font-semibold">IT Support</h4>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>📧 support@highlandcollege.edu</p>
                          <p>📞 (555) 123-4567 ext. 100</p>
                          <p>🕒 Mon-Fri: 8:00 AM - 6:00 PM</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <GraduationCap className="h-5 w-5 text-green-600" />
                          </div>
                          <h4 className="font-semibold">Academic Support</h4>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>📧 academic@highlandcollege.edu</p>
                          <p>📞 (555) 123-4567 ext. 200</p>
                          <p>🕒 Mon-Fri: 9:00 AM - 5:00 PM</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <CreditCard className="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 className="font-semibold">Financial Aid</h4>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>📧 finaid@highlandcollege.edu</p>
                          <p>📞 (555) 123-4567 ext. 300</p>
                          <p>🕒 Mon-Fri: 8:30 AM - 4:30 PM</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
