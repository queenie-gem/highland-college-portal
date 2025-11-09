"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  FileText,
  CheckCircle,
  ExternalLink,
  Clock,
  Users,
  Award,
  ArrowRight,
  X,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type DepartmentRow = { id: string; name: string };
type Program = { name: string; duration: string; degree: string; description: string };

export default function ProspectiveStudentsPage() {
  const [newApplicationOpen, setNewApplicationOpen] = useState(false);
  const [returningApplicationOpen, setReturningApplicationOpen] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const [programs, setPrograms] = useState<Program[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Require applicant login before accessing Prospective Students
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/apply/login");
      }
    });

    async function loadPrograms() {
      try {
        const { data: deptRows, error } = await supabase
          .from("department")
          .select("id,name")
          .order("name", { ascending: true });
        if (error) throw error;

        const mapped: Program[] = (deptRows ?? []).map((d: DepartmentRow) => ({
          name: d.name,
          duration: "2 years",
          degree: "National Diploma",
          description: `Explore the ${d.name} program at Highland College.`,
        }));
        setPrograms(mapped);
      } catch (e) {
        console.error("Failed to load programs", e);
        setPrograms([]);
      }
    }
    loadPrograms();
  }, [supabase]);

  const requirements = [
    "5 credits in your O'level or JAMB cut off mark of 160",
  ];

  const documents = [
    "WAEC/NECO results",
    "JAMB admission letter",
    "Completed school application form (would be given physically or electronically)",
    "Must be proficient in English",
  ];

  // Custom Modal Component
  const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-900 to-green-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Prospective Students
          </h1>
          <p className="text-xl text-green-100 max-w-3xl">
            Start your journey towards a successful career in technology.
            Explore our programs, admission requirements, and application
            process.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Employment Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-gray-600">Academic Programs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                15:1
              </div>
              <div className="text-gray-600">Student-Faculty Ratio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold">Start Your Application</h2>
              <p className="text-gray-600">Create an account or log in to continue</p>
            </div>
            <div className="flex gap-3">
              <a href="/apply/signup" className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">Create Account</a>
              <a href="/apply/login" className="inline-flex items-center rounded-md border border-purple-600 px-4 py-2 text-purple-700 hover:bg-purple-50">Login</a>
            </div>
          </div>
          <Tabs defaultValue="programs" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="admission">Admission</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="apply">Apply Now</TabsTrigger>
            </TabsList>

            <TabsContent value="programs" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Academic Programs</h2>
                <p className="text-gray-600 text-lg">
                  Choose from our comprehensive range of National Diploma
                  programs designed to meet industry demands.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="default">{program.degree}</Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {program.duration}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{program.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {program.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="admission" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Admission Process</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          1. Submit Application
                        </h3>
                        <p className="text-gray-600">
                          Complete and submit your online application with all
                          required documents.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          2. Review Process
                        </h3>
                        <p className="text-gray-600">
                          Our admissions committee reviews your application and
                          supporting materials.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <Award className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          3. Decision & Enrollment
                        </h3>
                        <p className="text-gray-600">
                          Receive your admission decision and complete
                          enrollment if accepted.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Admission Requirements
                  </h2>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        General Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Required Documents
                  </h3>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Document Checklist
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {documents.map((doc, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="apply" className="mt-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Apply?</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Take the next step in your educational journey. Our admission
                  portal makes it easy to submit your application and track your
                  progress.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6">
                    <div className="text-center">
                      <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        New Students
                      </h3>
                      <p className="text-gray-600 mb-4">
                        First time applying to Highland College? Start your
                        application here.
                      </p>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setNewApplicationOpen(true)}
                      >
                        Start New Application
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="text-center">
                      <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        Returning Applicants
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Already have an account? Continue your application or
                        check status.
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => setReturningApplicationOpen(true)}
                      >
                        Continue Application
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Need Help?</h4>
                  <p className="text-gray-600 mb-4">
                    Our admissions team is here to help you through the
                    application process.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" asChild>
                      <a href="mailto:segun@highlandtech.edu.ng">📧 Email Admissions</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="tel:+2347059628866">📞 Call (+234) 7059628866</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="https://wa.me/2347059628866" target="_blank" rel="noopener noreferrer">💬 Live Chat</a>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* New Student Application Modal */}
      <Modal
        isOpen={newApplicationOpen}
        onClose={() => setNewApplicationOpen(false)}
        title="New Student Application"
        description="Please fill in your details to start your application process."
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter first name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter last name" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="surname">Surname</Label>
            <Input id="surname" placeholder="Enter surname" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter email address" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="Enter phone number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="jamb">JAMB Registration Number</Label>
            <Input id="jamb" placeholder="Enter JAMB registration number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="program">Preferred Program</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Home Address</Label>
            <Textarea id="address" placeholder="Enter home address" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="examResult">Upload WAEC/NECO/GCE Result</Label>
            <Input id="examResult" type="file" accept=".pdf,.jpg,.jpeg,.png" />
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setNewApplicationOpen(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1">Submit Application</Button>
          </div>
        </div>
      </Modal>

      {/* Returning Student Modal */}
      <Modal
        isOpen={returningApplicationOpen}
        onClose={() => setReturningApplicationOpen(false)}
        title="Returning Student Login"
        description="Enter your details to access your application."
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="matricNumber">Matric Number</Label>
            <Input id="matricNumber" placeholder="Enter your matric number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="level">Level</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nd1">ND1</SelectItem>
                <SelectItem value="nd2">ND2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computer-science">
                  Computer Science
                </SelectItem>
                <SelectItem value="information-technology">
                  Information Technology
                </SelectItem>
                <SelectItem value="software-engineering">
                  Software Engineering
                </SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                <SelectItem value="web-development">Web Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setReturningApplicationOpen(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1">Access Application</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
