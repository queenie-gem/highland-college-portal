"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  utme_reg_no: string;
  preferred_department_id: string;
  phone: string;
  email: string;
  sittings_count: number;
  olevel_results: any[];
  status: string;
  created_at: string;
  updated_at: string;
};

export default function ApplicantDashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [deptName, setDeptName] = useState<string>("");
  const [proofUrls, setProofUrls] = useState<(string | null)[]>([]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // Not logged in; send to applicant login
        window.location.href = "/apply/login";
        return;
      }
      const { data: application } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (application) {
        setApp(application as Application);
        // lookup department name
        const { data: dept } = await supabase
          .from("department")
          .select("name")
          .eq("id", application.preferred_department_id)
          .maybeSingle();
        setDeptName(dept?.name ?? "");

        // Build signed URLs for proof files so links work for private/public buckets
        const urls = await Promise.all(
          (((application as any).olevel_results ?? []) as any[]).map(async (sit: any) => {
            const p: string | undefined = sit?.proof_storage_path;
            if (!p) return null;
            const { data } = await supabase.storage
              .from("applications")
              .createSignedUrl(p, 3600);
            return data?.signedUrl ?? null;
          })
        );
        setProofUrls(urls);
      } else {
        setApp(null);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-4xl mx-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Applicant Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/apply/application">
              <Button>Edit Application</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {!app ? (
          <Card>
            <CardHeader>
              <CardTitle>No Application Found</CardTitle>
              <CardDescription>
                Create your application to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/apply/application">
                <Button size="lg">Start New Application</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {app.first_name} {app.last_name}
              </CardTitle>
              <CardDescription>UTME: {app.utme_reg_no}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                Status:{" "}
                <span className="font-semibold capitalize">{app.status}</span>
              </div>
              <div>
                Preferred Program:{" "}
                <span className="font-semibold">
                  {deptName || app.preferred_department_id}
                </span>
              </div>
              <div>Phone: {app.phone}</div>
              <div>Email: {app.email}</div>
              <div>Sittings: {app.sittings_count}</div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">O’Level Results</h3>
                <div className="space-y-3">
                  {(app.olevel_results ?? []).map((sit: any, idx: number) => (
                    <div key={idx} className="border rounded p-3">
                      <div className="mb-2">
                        Type: {sit.type} | Sitting #{sit.sitting_index}
                      </div>
                      <ul className="list-disc pl-6">
                        {(sit.subjects ?? []).map((s: any, i: number) => (
                          <li key={i}>
                            {s.name}: {s.grade}
                          </li>
                        ))}
                      </ul>
                      {sit.proof_storage_path ? (
                        <div className="mt-2">
                          Proof:{" "}
                          {proofUrls[idx] ? (
                            <a
                              className="text-blue-600 underline"
                              href={proofUrls[idx]!}
                              target="_blank"
                            >
                              view
                            </a>
                          ) : (
                            <span className="text-gray-500">unavailable</span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
