"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  LayoutDashboard,
  Users,
  Folder,
  TrendingUp,
} from "lucide-react";

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

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      setLoading(true);
      try {
        const { data, count, error } = await supabase
          .from("activities")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
        if (error) throw error;
        setActivities(data ?? []);
        setTotalCount(count ?? 0);
      } catch (e) {
        console.error("Failed to fetch activities", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
          <CardDescription>
            Recent actions across the admin areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-600">Loading activities…</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-gray-600">No activities to show.</p>
          ) : (
            <div className="space-y-3">
              {activities.map((item) => {
                const action = item.metadata?.action;
                const table = item.metadata?.table;
                const tableIconMap: Record<
                  string,
                  { icon: any; color: string }
                > = {
                  folder: { icon: Folder, color: "bg-blue-100 text-blue-600" },
                  lecturer: {
                    icon: Users,
                    color: "bg-indigo-100 text-indigo-600",
                  },
                  faculty: {
                    icon: LayoutDashboard,
                    color: "bg-teal-100 text-teal-600",
                  },
                  department: {
                    icon: LayoutDashboard,
                    color: "bg-indigo-100 text-indigo-600",
                  },
                  course: {
                    icon: TrendingUp,
                    color: "bg-pink-100 text-pink-600",
                  },
                };
                const tableMeta = table ? tableIconMap[table] : undefined;
                let IconComp = tableMeta?.icon || Plus;
                let color = tableMeta?.color || "bg-blue-100 text-blue-600";
                if (!tableMeta) {
                  if (action === "update") {
                    IconComp = Pencil;
                    color = "bg-purple-100 text-purple-600";
                  } else if (action === "delete") {
                    IconComp = Trash2;
                    color = "bg-red-100 text-red-600";
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
                    <div className={`${color} p-2 rounded-full`}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        {item.description || ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        {timeAgo} • {item.metadata?.table}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-500">
                  Page {page + 1} of{" "}
                  {Math.max(1, Math.ceil((totalCount || 0) / PAGE_SIZE))}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={loading || page === 0}
                  >
                    Previous
                  </Button>
                  {(() => {
                    const totalPages = Math.max(
                      1,
                      Math.ceil((totalCount || 0) / PAGE_SIZE)
                    );
                    const current = page + 1;
                    const pages = new Set<number>();
                    const middle = Math.max(1, Math.floor(totalPages / 2));
                    // Always include first two and last two pages
                    pages.add(1);
                    if (totalPages >= 2) pages.add(2);
                    if (totalPages >= 2) pages.add(totalPages);
                    if (totalPages >= 3) pages.add(totalPages - 1);
                    // Include middle page to allow quick jump
                    if (totalPages > 6) pages.add(middle);
                    // Include neighbors around current
                    [current - 1, current, current + 1].forEach((n) => {
                      if (n >= 1 && n <= totalPages) pages.add(n);
                    });
                    const arr = Array.from(pages).sort((a, b) => a - b);
                    const items: Array<
                      | { type: "page"; value: number }
                      | { type: "ellipsis"; key: string }
                    > = [];
                    for (let i = 0; i < arr.length; i++) {
                      const val = arr[i];
                      const prev = arr[i - 1];
                      if (i > 0 && prev !== undefined && val - prev > 1) {
                        items.push({
                          type: "ellipsis",
                          key: `e-${prev}-${val}`,
                        });
                      }
                      items.push({ type: "page", value: val });
                    }
                    return (
                      <div className="flex items-center gap-1">
                        {items.map((item) =>
                          item.type === "page" ? (
                            <Button
                              key={`p-${item.value}`}
                              variant={
                                item.value === current ? "default" : "outline"
                              }
                              size="sm"
                              disabled={loading || item.value === current}
                              onClick={() => setPage(item.value - 1)}
                            >
                              {item.value}
                            </Button>
                          ) : (
                            <span key={item.key} className="px-2 text-gray-500">
                              …
                            </span>
                          )
                        )}
                      </div>
                    );
                  })()}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={
                      loading || (page + 1) * PAGE_SIZE >= (totalCount || 0)
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
