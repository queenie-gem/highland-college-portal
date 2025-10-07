"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Menu,
} from "lucide-react";

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
  {
    title: "Student Portal",
    url: "/student-portal",
    icon: LogIn,
    available: true,
  },
  {
    title: "Library",
    url: "/library-resources",
    icon: Library,
    available: true,
  },
  {
    title: "Faculty",
    url: "/faculty",
    icon: Users,
    available: true,
  },
  {
    title: "Blog",
    url: "/blog",
    icon: Newspaper,
    available: true,
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  if (pathname.startsWith("/admin")) {
    return null; // Don't render the navbar on admin pages
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {/* Replace icon box with your logo */}
            <Image
              src="/images/hct-logo.png" // ✅ put logo inside `public/` folder
              alt="Highland College Logo"
              width={70}
              height={70}
              className="rounded-lg"
              priority
            />
            {/* <div className="text-lg font-bold text-gray-900">Highland College</div>
            <div className="text-sm text-gray-600">of Technology</div> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const baseClasses =
                "px-3 py-2 rounded-md text-sm font-medium transition-colors relative";
              let itemClasses = baseClasses;

              if (!item.available) {
                itemClasses += " text-gray-400 cursor-not-allowed";
              } else if (isActive(item.url)) {
                itemClasses += " text-red-800 bg-red-50";
              } else {
                itemClasses +=
                  " text-gray-700 hover:text-red-800 hover:bg-gray-50";
              }

              return (
                <Link
                  key={item.title}
                  href={item.available ? item.url : "#"}
                  className={itemClasses}
                  onClick={(e) => !item.available && e.preventDefault()}
                >
                  {item.title}
                  {!item.available && (
                    <span className="ml-1 text-xs text-gray-400">(Soon)</span>
                  )}
                  {item.available && isActive(item.url) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-800 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        Highland College
                      </div>
                      <div className="text-sm text-gray-600">of Technology</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  {menuItems.map((item) => {
                    const baseClasses =
                      "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors";
                    let itemClasses = baseClasses;

                    if (!item.available) {
                      itemClasses += " text-gray-400 cursor-not-allowed";
                    } else if (isActive(item.url)) {
                      itemClasses += " text-red-800 bg-red-50";
                    } else {
                      itemClasses +=
                        " text-gray-700 hover:text-red-800 hover:bg-gray-50";
                    }

                    return (
                      <Link
                        key={item.title}
                        href={item.available ? item.url : "#"}
                        className={itemClasses}
                        onClick={(e) => {
                          if (!item.available) {
                            e.preventDefault();
                          } else {
                            setIsOpen(false);
                          }
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                        {!item.available && (
                          <span className="ml-auto text-xs text-gray-400">
                            (Coming Soon)
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
