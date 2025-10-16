import {
  BookOpen,
  GraduationCap,
  Home,
  Info,
  Library,
  LogIn,
  Newspaper,
  Users,
  Building2,
  UserCheck,
  Monitor,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../components/ui/sidebar";
import Link from "next/link";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    available: true,
  },
  {
    title: "About",
    url: "/about",
    icon: Info,
    available: true,
  },
  {
    title: "Departments",
    url: "#",
    icon: Building2,
    available: false,
  },
  {
    title: "Alumni",
    url: "#",
    icon: UserCheck,
    available: false,
  },
  {
    title: "Prospective Students",
    url: "/prospective-students",
    icon: GraduationCap,
    available: true,
  },
  {
    title: "eLMS",
    url: "#",
    icon: Monitor,
    available: false,
  },
  // {
  //   title: "Student Portal",
  //   url: "/student-portal",
  //   icon: LogIn,
  //   available: true,
  // },
  // {
  //   title: "Electronic Library Resources",
  //   url: "/library-resources",
  //   icon: Library,
  //   available: true,
  // },
  {
    title: "Faculty",
    url: "/faculty",
    icon: Users,
    available: true,
  },
];

export function AppSidebar() {
  return (
    <div className="relative">
      <Sidebar className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Highland College
              </h2>
              <p className="text-sm text-gray-600">of Technology</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={item.available}
                      className={
                        !item.available ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      {item.available ? (
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{item.title}</span>
                          <item.icon />
                          <span className="ml-auto text-xs text-gray-400">
                            (Coming Soon)
                          </span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Always visible trigger button */}
      <div className="absolute top-4 right-4 z-50">
        <SidebarTrigger />
      </div>
    </div>
  );
}
