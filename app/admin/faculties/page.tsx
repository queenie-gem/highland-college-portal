import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFaculties } from "@/app/admin/actions/faculty-actions";
import { getLecturers } from "@/app/admin/actions/lecturer-actions";
import { AddFacultyForm, FacultyCard, Lecturer } from "./components";

export default async function FacultiesPage() {
  const [faculties, lecturers]: any = await Promise.all([
    getFaculties(),
    getLecturers("id, name"),
  ]);

  // Client components will handle lecturer name mapping.

  console.log(lecturers);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Faculties</h1>
        <p className="text-gray-600">
          Manage faculty records and assign Heads of Department (HOD).
        </p>
      </div>

      <AddFacultyForm lecturers={lecturers} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faculties.map((fac: any) => (
          <FacultyCard key={fac.id} fac={fac} lecturers={lecturers} />
        ))}
      </div>
    </div>
  );
}
