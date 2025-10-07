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
  LogOut,
  Folder,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

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

  const handleLogout = async () => {
    // Clear authentication state
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUser");
    toast.success("user logged out successfully");
    router.push("/admin");
  };

  const stats = [
    {
      title: "Total Documents",
      value: "1,247",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Folders",
      value: "23",
      icon: Folder,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Storage Used",
      value: "2.4 GB",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Active Users",
      value: "156",
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Create Folder",
      description: "Organize documents by creating new folders",
      icon: FolderPlus,
      href: "/admin/folders/create",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Upload Documents",
      description: "Add new documents to existing folders",
      icon: Upload,
      href: "/admin/documents/upload",
      color: "bg-green-600 hover:bg-green-700",
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
  ];

  if (!adminUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Highland College of Technology
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {adminUser}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <CardTitle className="text-lg mb-2">{action.title}</CardTitle>
                  <CardDescription className="mb-4">
                    {action.description}
                  </CardDescription>
                  <Button asChild className={action.color}>
                    <Link href={action.href}>Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest document management activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Upload className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    Academic Calendar 2024.pdf uploaded
                  </p>
                  <p className="text-sm text-gray-600">
                    2 hours ago • Academic Resources folder
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FolderPlus className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    New folder "Student Handbooks" created
                  </p>
                  <p className="text-sm text-gray-600">
                    5 hours ago • Documents section
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    Admission Requirements.pdf updated
                  </p>
                  <p className="text-sm text-gray-600">
                    1 day ago • Admissions folder
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
