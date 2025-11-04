"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Mail, Phone, MapPin, Award, Search, GraduationCap, Building2, Star } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

type DepartmentRow = { id: string; name: string; hod: string | null; faculty: string | null }
type FacultyRow = { id: string; name: string }
type LecturerRow = {
  id: string
  name: string | null
  specialization: string[] | null
  contact: string[] | null
  achievement: string[] | null
  education: string[] | null
}
type CourseRow = { id: string; title: string; lecturer: string | null; department: string | null }

export default function FacultyPage() {
  const supabase = useMemo(() => createClient(), [])

  const [departments, setDepartments] = useState<{
    name: string
    head: string
    faculty: number
    description: string
  }[]>([])

  const [featuredFaculty, setFeaturedFaculty] = useState<{
    name: string
    title: string
    department: string
    education: string[]
    specialization: string[]
    experience: string
    contact: string[]
    achievements: string[]
    courses: string[]
  }[]>([])

  const [directoryLecturers, setDirectoryLecturers] = useState<{
    name: string
    title: string
    department: string
    faculty: string
    contacts: string[]
  }[]>([])
  const [stats, setStats] = useState<{ members: number; phdPercent: number }>({
    members: 0,
    phdPercent: 0,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [
          { data: deptRows, error: deptErr },
          { data: lecturerRows, error: lectErr },
          { data: courseRows, error: courseErr },
          { data: facultyRows, error: facultyErr },
        ] = await Promise.all([
          supabase.from("department").select("id,name,hod,faculty").order("name", { ascending: true }),
          supabase.from("lecturer").select("id,name,specialization,contact,achievement,education").order("created_at", { ascending: false }),
          supabase.from("course").select("id,title,lecturer,department").order("created_at", { ascending: false }),
          supabase.from("faculty").select("id,name").order("name", { ascending: true }),
        ])
        if (deptErr) throw deptErr
        if (lectErr) throw lectErr
        if (courseErr) throw courseErr
        if (facultyErr) throw facultyErr

        const lecturersById = new Map<string, LecturerRow>()
        for (const l of (lecturerRows ?? []) as LecturerRow[]) lecturersById.set(l.id, l)

        // Build department faculty counts using distinct lecturers that teach courses in the department
        const deptFacultyCount = new Map<string, number>()
        const deptNameById = new Map<string, string>()
        const deptFacultyNameByDeptId = new Map<string, string>()
        const facultyNameById = new Map<string, string>()
        for (const f of (facultyRows ?? []) as FacultyRow[]) facultyNameById.set(f.id, f.name)
        for (const d of (deptRows ?? []) as DepartmentRow[]) {
          deptNameById.set(d.id, d.name)
          deptFacultyCount.set(d.id, 0)
          if (d.faculty) {
            const fname = facultyNameById.get(d.faculty) ?? "—"
            deptFacultyNameByDeptId.set(d.id, fname)
          }
        }
        const lecturerSetByDept = new Map<string, Set<string>>()
        for (const c of (courseRows ?? []) as CourseRow[]) {
          const deptId = c.department ?? undefined
          const lectId = c.lecturer ?? undefined
          if (!deptId || !lectId) continue
          if (!lecturerSetByDept.has(deptId)) lecturerSetByDept.set(deptId, new Set<string>())
          lecturerSetByDept.get(deptId)!.add(lectId)
        }
        for (const [deptId, set] of lecturerSetByDept.entries()) {
          deptFacultyCount.set(deptId, set.size)
        }

        // Map departments to UI shape
        const deptUI = ((deptRows ?? []) as DepartmentRow[]).map((d) => {
          const hodName = d.hod ? lecturersById.get(d.hod)?.name ?? "—" : "—"
          return {
            name: d.name,
            head: hodName || "—",
            faculty: deptFacultyCount.get(d.id) ?? 0,
            description: "Description not available.",
          }
        })
        setDepartments(deptUI)

        // Featured faculty: take latest 4 lecturers
        const featured = ((lecturerRows ?? []) as LecturerRow[]).slice(0, 4).map((l) => {
          // Determine department label: HOD dept or first course dept name
          let deptLabel = "—"
          for (const d of (deptRows ?? []) as DepartmentRow[]) {
            if (d.hod === l.id) {
              deptLabel = d.name
              break
            }
          }
          if (deptLabel === "—") {
            const course = ((courseRows ?? []) as CourseRow[]).find((c) => c.lecturer === l.id && c.department)
            if (course?.department) deptLabel = deptNameById.get(course.department) ?? "—"
          }

          const courses = ((courseRows ?? []) as CourseRow[])
            .filter((c) => c.lecturer === l.id)
            .map((c) => c.title)
            .slice(0, 3)

          const isHod = ((deptRows ?? []) as DepartmentRow[]).some((d) => d.hod === l.id)
          const title = isHod ? "Professor & Department Head" : "Lecturer"

          return {
            name: l.name ?? "Unnamed Lecturer",
            title,
            department: deptLabel,
            education: l.education ?? [],
            specialization: l.specialization ?? [],
            experience: "",
            contact: l.contact ?? [],
            achievements: l.achievement ?? [],
            courses,
          }
        })
        setFeaturedFaculty(featured)

        // Directory: first 12 lecturers
        const lecturerList = ((lecturerRows ?? []) as LecturerRow[])
        const directory = lecturerList.slice(0, 12).map((l) => {
          let deptLabel = "—"
          let facultyLabel = "—"
          const course = ((courseRows ?? []) as CourseRow[]).find((c) => c.lecturer === l.id && c.department)
          if (course?.department) {
            deptLabel = deptNameById.get(course.department) ?? "—"
            facultyLabel = deptFacultyNameByDeptId.get(course.department) ?? "—"
          }
          return {
            name: l.name ?? "Unnamed Lecturer",
            title: "Associate Professor",
            department: deptLabel,
            faculty: facultyLabel,
            contacts: l.contact ?? [],
          }
        })
        setDirectoryLecturers(directory)

        // Compute Faculty Stats (simplified)
        const totalLecturers = lecturerList.length
        const phdCount = lecturerList.reduce((acc, l) => {
          const edu = l.education ?? []
          const hasPhD = edu.some((e) => /ph\.?d|doctor|dphil/i.test((e ?? "") as string))
          return acc + (hasPhD ? 1 : 0)
        }, 0)
        const phdPercent = totalLecturers ? Math.round((phdCount / totalLecturers) * 100) : 0
        setStats({ members: totalLecturers, phdPercent })
      } catch (err) {
        console.error("Failed to load faculty page data", err)
        setDepartments([])
        setFeaturedFaculty([])
        setDirectoryLecturers([])
      }
    }
    loadData()
  }, [supabase])

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.members}</div>
              <div className="text-gray-600">Faculty Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.phdPercent}%</div>
              <div className="text-gray-600">Hold Ph.D. Degrees</div>
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
                        <div className="space-y-1">
                          {faculty.education.length > 0 ? (
                            faculty.education.map((item, i) => (
                              <p key={i} className="text-gray-600 text-sm">{item}</p>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No education info</p>
                          )}
                          {faculty.experience && (
                            <p className="text-gray-600 text-sm">{faculty.experience} of teaching experience</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Specialization</h4>
                        <div className="space-y-1">
                          {faculty.specialization.length > 0 ? (
                            faculty.specialization.map((sp, i) => (
                              <p key={i} className="text-gray-600 text-sm">{sp}</p>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No specialization info</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Contact Information</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {faculty.contact.length > 0 ? (
                            faculty.contact.map((line, i) => {
                              const lower = (line || "").toLowerCase()
                              const isEmail = lower.includes("@") || lower.includes("email")
                              const isPhone = lower.includes("phone") || /\b\+?\d[\d\s\-()]{5,}\b/.test(line)
                              const isAddress = lower.includes("office") || lower.includes("room") || lower.includes("building") || lower.includes("address") || lower.includes("street")
                              return (
                                <div key={i} className="flex items-center gap-2">
                                  {isEmail ? (
                                    <Mail className="h-4 w-4" />
                                  ) : isPhone ? (
                                    <Phone className="h-4 w-4" />
                                  ) : isAddress ? (
                                    <MapPin className="h-4 w-4" />
                                  ) : (
                                    <Users className="h-4 w-4" />
                                  )}
                                  <span>{line}</span>
                                </div>
                              )
                            })
                          ) : (
                            <p className="text-gray-500">No contact info</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Achievements</h4>
                        <div className="space-y-1 text-sm text-gray-700">
                          {faculty.achievements.length > 0 ? (
                            faculty.achievements.map((ach, i) => (
                              <div key={i}>• {ach}</div>
                            ))
                          ) : (
                            <p className="text-gray-500">No achievements listed</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Courses Taught</h4>
                        <div className="space-y-1 text-sm text-gray-700">
                          {faculty.courses.length > 0 ? (
                            faculty.courses.map((course, i) => (
                              <div key={i}>• {course}</div>
                            ))
                          ) : (
                            <p className="text-gray-500">No courses listed</p>
                          )}
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
                {directoryLecturers.map((lec, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{lec.name}</h4>
                          <p className="text-sm text-gray-600">{lec.title}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {lec.department || "—"}
                            {lec.faculty && lec.faculty !== "—" ? ` • ${lec.faculty}` : ""}
                          </Badge>
                          <div className="mt-2 space-y-1 text-xs text-gray-500">
                            {(lec.contacts || []).slice(0, 2).map((line, i) => {
                              const lower = (line || "").toLowerCase()
                              const isEmail = lower.includes("@") || lower.includes("email")
                              const isPhone = lower.includes("phone") || /\b\+?\d[\d\s\-()]{5,}\b/.test(line)
                              const isAddress = lower.includes("office") || lower.includes("room") || lower.includes("building") || lower.includes("address") || lower.includes("street")
                              return (
                                <div key={i} className="flex items-center gap-1">
                                  {isEmail ? (
                                    <Mail className="h-3 w-3" />
                                  ) : isPhone ? (
                                    <Phone className="h-3 w-3" />
                                  ) : isAddress ? (
                                    <MapPin className="h-3 w-3" />
                                  ) : (
                                    <Users className="h-3 w-3" />
                                  )}
                                  <span>{line}</span>
                                </div>
                              )
                            })}
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
