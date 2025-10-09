"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  const router = useRouter();
  const supabase = createClient();

  const adminUser = user?.email ?? "";

  const handleLogout = async () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link
                href="/admin"
                className="text-sm text-red-600 font-medium hover:text-red-800"
              >
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
