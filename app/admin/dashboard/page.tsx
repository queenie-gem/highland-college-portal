"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LayoutDashboard,
  FolderPlus,
  Upload,
  FileText,
  Users,
  Folder,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/utils/supabase/client";

type Activity = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  metadata: {
    action: "create" | "update" | "delete";
    table: string;
    recordId?: string;
  };
};

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState("");
  const user = useUser();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      router.push("/admin");
      return;
    }

    setAdminUser(user?.email!);
  }, [router, user]);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .order("created_at", { ascending: false })
          .range(0, 9);
        if (error) throw error;
        setActivities(data ?? []);
      } catch (err) {
        console.error("Failed to load activities", err);
      } finally {
        setActivitiesLoading(false);
      }
    }
    if (adminUser) fetchActivities();
  }, [adminUser]);

  // Navbar moved to app/admin/layout.tsx

  const [docCount, setDocCount] = useState<number | null>(null);
  const [folderCount, setFolderCount] = useState<number | null>(null);
  const [storageBytes, setStorageBytes] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  const formatBytes = (bytes?: number | null) => {
    if (!bytes || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"]; 
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    const precision = n < 10 && i > 0 ? 1 : 0;
    return `${n.toFixed(precision)} ${units[i]}`;
  };

  useEffect(() => {
    async function loadStats() {
      if (!adminUser) return;
      setStatsLoading(true);
      try {
        // Counts using HEAD queries
        const [{ count: filesCount, error: filesErr }, { count: foldersCount, error: foldersErr }] = await Promise.all([
          supabase.from("file").select("id", { count: "exact", head: true }),
          supabase.from("folder").select("id", { count: "exact", head: true }),
        ]);
        if (filesErr) throw filesErr;
        if (foldersErr) throw foldersErr;
        setDocCount(filesCount ?? 0);
        setFolderCount(foldersCount ?? 0);

        // Sum sizes in pages to avoid huge payloads
        let total = 0;
        const PAGE = 1000;
        let offset = 0;
        // If we don't know count, page until less than PAGE returned
        while (true) {
          const { data, error } = await supabase
            .from("file")
            .select("size")
            .order("created_at", { ascending: false })
            .range(offset, offset + PAGE - 1);
          if (error) throw error;
          const batch = (data ?? []) as { size: number | null }[];
          for (const row of batch) total += Number(row.size ?? 0);
          if (!batch.length || batch.length < PAGE) break;
          offset += PAGE;
        }
        setStorageBytes(total);
      } catch (err) {
        console.error("Failed to load stats", err);
        setDocCount(0);
        setFolderCount(0);
        setStorageBytes(0);
      } finally {
        setStatsLoading(false);
      }
    }
    loadStats();
  }, [adminUser]);

  const stats = [
    {
      title: "Total Documents",
      value: docCount === null ? "—" : docCount.toLocaleString(),
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Folders",
      value: folderCount === null ? "—" : folderCount.toLocaleString(),
      icon: Folder,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Storage Used",
      value: storageBytes === null ? "—" : formatBytes(storageBytes),
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "View Applications",
      description: "Review prospective student submissions",
      icon: Users,
      href: "/admin/applications",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      title: "Upload Documents",
      description: "Add new documents to existing folders",
      icon: Upload,
      href: "/admin/documents/upload",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Manage Lecturers",
      description: "View and manage all lecturers",
      icon: Users,
      href: "/admin/lecturers",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Manage Faculties",
      description: "View and manage all faculties",
      icon: Users,
      href: "/admin/faculties",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Manage Departments",
      description: "View and manage all departments",
      icon: LayoutDashboard,
      href: "/admin/departments",
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      title: "Manage Courses",
      description: "View and manage all courses",
      icon: TrendingUp,
      href: "/admin/courses",
      color: "bg-pink-600 hover:bg-pink-700",
    },
    {
      title: "Manage Folders",
      description: "View and organize all document folders",
      icon: Folder,
      href: "/admin/folders",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Document Library",
      description: "Browse and manage all uploaded documents",
      icon: FileText,
      href: "/admin/documents",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      title: "View Activities",
      description: "See recent admin actions and logs",
      icon: LayoutDashboard,
      href: "/admin/activities",
      color: "bg-slate-600 hover:bg-slate-700",
    },
  ];

  if (!adminUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link href={action.href}>
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div
                      className={`p-3 rounded-lg w-fit ${action.color} text-white`}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg mb-2">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="mb-4">
                      {action.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest admin activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitiesLoading ? (
                <p className="text-sm text-gray-600">
                  Loading recent activities…
                </p>
              ) : activities.length === 0 ? (
                <p className="text-sm text-gray-600">No recent activities.</p>
              ) : (
                activities.map((item) => {
                  const action = item.metadata?.action;
                  const table = item.metadata?.table;
                  const tableIconMap: Record<string, { icon: any; color: string }> = {
                    folder: { icon: Folder, color: "bg-blue-100 text-blue-600" },
                    lecturer: { icon: Users, color: "bg-indigo-100 text-indigo-600" },
                    faculty: { icon: LayoutDashboard, color: "bg-teal-100 text-teal-600" },
                    department: { icon: LayoutDashboard, color: "bg-indigo-100 text-indigo-600" },
                    course: { icon: TrendingUp, color: "bg-pink-100 text-pink-600" },
                  };
                  const tableMeta = table ? tableIconMap[table] : undefined;
                  let IconComp = tableMeta?.icon || Plus;
                  let colorClasses = tableMeta?.color || "bg-blue-100 text-blue-600";
                  if (!tableMeta) {
                    if (action === "update") {
                      IconComp = Pencil;
                      colorClasses = "bg-purple-100 text-purple-600";
                    } else if (action === "delete") {
                      IconComp = Trash2;
                      colorClasses = "bg-red-100 text-red-600";
                    }
                  }

                  const timeAgo = (() => {
                    const now = Date.now();
                    const then = new Date(item.created_at).getTime();
                    const diffMs = Math.max(0, now - then);
                    const mins = Math.floor(diffMs / 60000);
                    if (mins < 1) return "just now";
                    if (mins < 60)
                      return `${mins} minute${mins === 1 ? "" : "s"} ago`;
                    const hours = Math.floor(mins / 60);
                    if (hours < 24)
                      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
                    const days = Math.floor(hours / 24);
                    return `${days} day${days === 1 ? "" : "s"} ago`;
                  })();

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className={`${colorClasses} p-2 rounded-full`}>
                        <IconComp className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {timeAgo} • {table}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-4">
              <Link href="/admin/activities">
                <Button variant="link" className="p-0">View all activities</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
