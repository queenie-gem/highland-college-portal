import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getDepartments } from "@/app/admin/actions/department-actions";
import { getFaculties } from "@/app/admin/actions/faculty-actions";
import { getLecturers } from "@/app/admin/actions/lecturer-actions";
import { AddDepartmentForm, DepartmentCard } from "./components";

export default async function DepartmentsPage() {
  const [departments, faculties, lecturers]: any = await Promise.all([
    getDepartments(),
    getFaculties(),
    getLecturers(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Departments</h1>
        <p className="text-gray-600">
          Manage departments, assign HODs, and link to faculties.
        </p>
      </div>

      <AddDepartmentForm lecturers={lecturers} faculties={faculties} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dep: any) => (
          <DepartmentCard
            key={dep.id}
            dep={dep}
            lecturers={lecturers}
            faculties={faculties}
          />
        ))}
      </div>
    </div>
  );
}
