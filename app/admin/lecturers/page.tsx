import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLecturers } from "@/app/admin/actions/lecturer-actions";
import { AddLecturerForm, LecturerCard } from "./components";

export default async function LecturersPage() {
  const lecturers = await getLecturers();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Lecturers</h1>
        <p className="text-gray-600">
          Manage lecturer records. Add multiple values with chips (specialization, contacts, achievements, education).
        </p>
      </div>

      <AddLecturerForm />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lecturers.map((lec: any) => (
          <LecturerCard key={lec.id} lec={lec} />
        ))}
      </div>
    </div>
  );
}
