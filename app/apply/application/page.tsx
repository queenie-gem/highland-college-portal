"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type DepartmentRow = { id: string; name: string };

type Subject = { name: string; grade: string };
type Sitting = {
  type: "WAEC" | "NECO" | "NABTEB" | "";
  subjects: Subject[];
  proofFile?: File | null;
};

export default function ApplicationFormPage() {
  const supabase = useMemo(() => createClient(), []);
  const [departments, setDepartments] = useState<DepartmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  // core fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [utmeRegNo, setUtmeRegNo] = useState("");
  const [preferredDepartmentId, setPreferredDepartmentId] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // sittings
  const [sittingsCountChoice, setSittingsCountChoice] = useState<"one" | "two" | "more">("one");
  const [sittingsCountMore, setSittingsCountMore] = useState<number>(3);
  const [sittings, setSittings] = useState<Sitting[]>([{ type: "", subjects: [], proofFile: null }]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/apply/login";
        return;
      }
      setEmail(user.email ?? "");

      const { data: deptRows, error } = await supabase
        .from("department")
        .select("id,name")
        .order("name", { ascending: true });
      if (error) {
        toast.error(error.message);
      }
      setDepartments(deptRows ?? []);

      // Load existing application to edit
      const { data: existing } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        setFirstName(existing.first_name ?? "");
        setLastName(existing.last_name ?? "");
        setUtmeRegNo(existing.utme_reg_no ?? "");
        setPreferredDepartmentId(existing.preferred_department_id ?? "");
        setPhone(existing.phone ?? "");
        const count = existing.sittings_count ?? 1;
        setSittingsCountChoice(count === 1 ? "one" : count === 2 ? "two" : "more");
        setSittingsCountMore(count > 2 ? count : 3);
        setSittings(
          (existing.olevel_results ?? []).map((sit: any) => ({
            type: sit.type ?? "",
            subjects: (sit.subjects ?? []).map((s: any) => ({ name: s.name ?? "", grade: s.grade ?? "" })),
            proofFile: null, // we don't have the file in memory; keep null
          })) || [{ type: "", subjects: [], proofFile: null }]
        );
      }
      setLoading(false);
    }
    init();
  }, [supabase]);

  // adjust sittings array length based on choice/more
  useEffect(() => {
    const desired =
      sittingsCountChoice === "one" ? 1 : sittingsCountChoice === "two" ? 2 : Math.max(3, sittingsCountMore);
    setSittings((prev) => {
      const copy = [...prev];
      if (copy.length < desired) {
        while (copy.length < desired) copy.push({ type: "", subjects: [], proofFile: null });
      } else if (copy.length > desired) {
        copy.length = desired;
      }
      return copy;
    });
  }, [sittingsCountChoice, sittingsCountMore]);

  const setSittingType = (index: number, val: Sitting["type"]) => {
    setSittings((prev) => prev.map((s, i) => (i === index ? { ...s, type: val } : s)));
  };

  const addSubject = (index: number) => {
    setSittings((prev) =>
      prev.map((s, i) => (i === index ? { ...s, subjects: [...s.subjects, { name: "", grade: "" }] } : s))
    );
  };

  const setSubject = (sittingIndex: number, subjectIndex: number, field: keyof Subject, value: string) => {
    setSittings((prev) =>
      prev.map((s, i) =>
        i === sittingIndex
          ? { ...s, subjects: s.subjects.map((subj, j) => (j === subjectIndex ? { ...subj, [field]: value } : subj)) }
          : s
      )
    );
  };

  const setProofFile = (index: number, file: File | null) => {
    setSittings((prev) => prev.map((s, i) => (i === index ? { ...s, proofFile: file } : s)));
  };

  const submit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login to submit application.");
      return;
    }

    if (!firstName || !lastName || !utmeRegNo || !preferredDepartmentId || !phone || !email) {
      toast.error("Please fill all required fields.");
      return;
    }

    const desiredCount =
      sittingsCountChoice === "one" ? 1 : sittingsCountChoice === "two" ? 2 : Math.max(3, sittingsCountMore);

    // Upload proof files for sittings
    const uploadedSittings = [];
    for (let i = 0; i < sittings.length; i++) {
      const s = sittings[i];
      let proofPath: string | null = null;
      if (s.proofFile) {
        const ext = s.proofFile.name.split(".").pop();
        const filename = `proof_${Date.now()}_${i}.${ext}`;
        const path = `${user.id}/${filename}`;
        const { error: upErr } = await supabase.storage.from("applications").upload(path, s.proofFile, {
          cacheControl: "3600",
          upsert: true,
        });
        if (upErr) {
          toast.error(`Failed to upload proof for sitting ${i + 1}: ${upErr.message}`);
          return;
        }
        proofPath = path;
      }
      uploadedSittings.push({
        type: s.type,
        sitting_index: i + 1,
        subjects: s.subjects,
        proof_storage_path: proofPath,
      });
    }

    // Upsert application
    const payload = {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      utme_reg_no: utmeRegNo,
      preferred_department_id: preferredDepartmentId,
      phone,
      email,
      sittings_count: desiredCount,
      olevel_results: uploadedSittings,
      status: "submitted",
    };

    const { error } = await supabase
      .from("applications")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Application saved successfully");
    window.location.href = "/apply/dashboard";
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-4xl mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>Fill all required information accurately.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first">First Name</Label>
                <Input id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last">Last Name</Label>
                <Input id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="utme">UTME Registration Number</Label>
                <Input id="utme" value={utmeRegNo} onChange={(e) => setUtmeRegNo(e.target.value)} placeholder="Enter UTME registration number" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Preferred Choice of Course of Study</Label>
              <Select value={preferredDepartmentId} onValueChange={(v) => setPreferredDepartmentId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (prefilled)</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" disabled />
              </div>
            </div>

            <div className="space-y-4">
              <Label>O’Level Number of Sittings</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={sittingsCountChoice === "one"} onChange={() => setSittingsCountChoice("one")} />
                  One
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={sittingsCountChoice === "two"} onChange={() => setSittingsCountChoice("two")} />
                  Two
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={sittingsCountChoice === "more"} onChange={() => setSittingsCountChoice("more")} />
                  More
                </label>
                {sittingsCountChoice === "more" && (
                  <div className="flex items-center gap-2">
                    <Input type="number" min={3} value={sittingsCountMore} onChange={(e) => setSittingsCountMore(parseInt(e.target.value || "3", 10))} className="w-24" />
                    <span className="text-sm text-gray-600">Specify count</span>
                  </div>
                )}
              </div>

              {sittings.map((sit, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">Sitting #{idx + 1}</CardTitle>
                    <CardDescription>Select result type and enter subjects.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Result Type</Label>
                      <Select value={sit.type} onValueChange={(v) => setSittingType(idx, v as Sitting["type"])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select result type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WAEC">WAEC</SelectItem>
                          <SelectItem value="NECO">NECO</SelectItem>
                          <SelectItem value="NABTEB">NABTEB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Subjects & Grades</Label>
                        <Button variant="outline" size="sm" onClick={() => addSubject(idx)}>Add Subject</Button>
                      </div>
                      {sit.subjects.length === 0 && <div className="text-sm text-gray-500">No subjects added yet.</div>}
                      {sit.subjects.map((subj, sIdx) => (
                        <div key={sIdx} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Input placeholder="Subject name" value={subj.name} onChange={(e) => setSubject(idx, sIdx, "name", e.target.value)} />
                          <Input placeholder="Grade (e.g., A1, B3, C6)" value={subj.grade} onChange={(e) => setSubject(idx, sIdx, "grade", e.target.value)} />
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-2">
                      <Label>Upload Proof (PDF/JPG/PNG)</Label>
                      <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setProofFile(idx, e.target.files?.[0] ?? null)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => (window.location.href = "/apply/dashboard")}>Cancel</Button>
              <Button onClick={submit}>Submit Application</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}