import { getFolders } from "@/app/admin/actions/folder-actions";
import { getFaculties } from "@/app/admin/actions/faculty-actions";
import { AddFolderForm, FolderCard } from "./components";

export default async function FoldersPage() {
  const [folders, faculties] = await Promise.all([
    getFolders(),
    getFaculties(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Folders</h1>
        <p className="text-gray-600">Manage folders, set visibility, and link to faculties.</p>
      </div>

      <AddFolderForm faculties={faculties} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {folders.map((f: any) => (
          <FolderCard key={f.id} folder={f} faculties={faculties} />
        ))}
      </div>
    </div>
  );
}
