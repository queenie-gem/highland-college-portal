import { getCourses } from "@/app/admin/actions/course-actions";
import { getLecturers } from "@/app/admin/actions/lecturer-actions";
import { getDepartments } from "@/app/admin/actions/department-actions";
import { AddCourseForm, CourseCard } from "./components";

export default async function CoursesPage() {
  const [courses, lecturers, departments]: any = await Promise.all([
    getCourses(),
    getLecturers(),
    getDepartments(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-gray-600">
          Manage courses, assign lecturers, and link to departments.
        </p>
      </div>

      <AddCourseForm lecturers={lecturers} departments={departments} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((c: any) => (
          <CourseCard
            key={c.id}
            course={c}
            lecturers={lecturers}
            departments={departments}
          />
        ))}
      </div>
    </div>
  );
}
