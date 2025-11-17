"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";

type DepartmentRow = { id: string; name: string };
type OLevelResult = {
  type: string;
  sitting_index?: number;
  subjects?: { name: string; grade: string }[];
  proof_storage_path?: string | null;
};

type ApplicationRow = {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  utme_reg_no: string | null;
  preferred_department_id: string | null;
  phone: string | null;
  email: string | null;
  sittings_count: number | null;
  olevel_results: OLevelResult[] | null;
  status: string | null;
  created_at?: string | null;
};

export default function AdminApplicationsPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const user = useUser();

  const [departments, setDepartments] = useState<Record<string, string>>({});
  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean | null>(null);

  // Robust auth guard: wait for localStorage check to avoid premature redirect
  useEffect(() => {
    try {
      const authed =
        localStorage.getItem("adminAuthenticated") === "true" ||
        !!localStorage.getItem("adminUser");
      setIsAdminAuthed(authed);
      if (!authed) router.push("/admin");
    } catch {
      setIsAdminAuthed(false);
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [{ data: deptRows }, { data: appRows }] = await Promise.all([
          supabase.from("department").select("id,name"),
          supabase.from("applications").select("*")
        ]);

        const deptMap: Record<string, string> = {};
        for (const d of (deptRows ?? []) as DepartmentRow[]) {
          if (d.id) deptMap[d.id] = d.name;
        }
        setDepartments(deptMap);
        setApps((appRows ?? []) as ApplicationRow[]);
      } finally {
        setLoading(false);
      }
    }
    if (isAdminAuthed) init();
  }, [supabase, isAdminAuthed]);

  const filtered = apps.filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const name = `${a.first_name ?? ""} ${a.last_name ?? ""}`.toLowerCase();
    return (
      name.includes(q) ||
      (a.email ?? "").toLowerCase().includes(q) ||
      (a.phone ?? "").toLowerCase().includes(q) ||
      (a.utme_reg_no ?? "").toLowerCase().includes(q)
    );
  });

  const getDeptName = (id?: string | null) => (id && departments[id]) || "—";

  const getProofUrl = async (path?: string | null) => {
    if (!path) return null;
    // Try signed URL; if bucket is public, also provide public URL as fallback
    const { data: signed, error } = await supabase.storage
      .from("applications")
      .createSignedUrl(path, 600);
    if (signed?.signedUrl) return signed.signedUrl;
    if (error) {
      const { data: pub } = supabase.storage.from("applications").getPublicUrl(path);
      return pub?.publicUrl ?? null;
    }
    return null;
  };

  if (isAdminAuthed === null) {
    return <div className="p-8">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Prospective Student Applications</CardTitle>
            <CardDescription>View submissions from the application form.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 mb-4">
              <Input
                placeholder="Search by name, email, phone, UTME"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Link href="/admin/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-sm text-gray-600">Loading applications…</div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-gray-600">No applications found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-2">Applicant</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">UTME Reg No</th>
                      <th className="p-2">Preferred Dept</th>
                      <th className="p-2">Sittings</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Proofs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id} className="border-b align-top">
                        <td className="p-2 font-medium">
                          {(a.first_name ?? "") + " " + (a.last_name ?? "")}
                        </td>
                        <td className="p-2">{a.email ?? "—"}</td>
                        <td className="p-2">{a.phone ?? "—"}</td>
                        <td className="p-2">{a.utme_reg_no ?? "—"}</td>
                        <td className="p-2">{getDeptName(a.preferred_department_id)}</td>
                        <td className="p-2">{a.sittings_count ?? "—"}</td>
                        <td className="p-2">
                          <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                            {a.status ?? "—"}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="space-y-1">
                            {(a.olevel_results ?? []).map((r, idx) => (
                              <ProofLink key={idx} label={`Sitting ${idx + 1}`} path={r.proof_storage_path ?? null} getUrl={getProofUrl} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ProofLink({ label, path, getUrl }: { label: string; path: string | null; getUrl: (p: string | null | undefined) => Promise<string | null>; }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await getUrl(path);
      if (mounted) setUrl(u);
    })();
    return () => {
      mounted = false;
    };
  }, [path, getUrl]);

  if (!path) return <div className="text-xs text-gray-500">No file</div>;
  if (!url) return <div className="text-xs text-gray-500">Loading…</div>;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:text-blue-800 underline">
      {label}: View proof
    </a>
  );
}