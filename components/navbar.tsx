"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Code,
  BarChart3,
  List,
  Menu,
  X,
  Moon,
  Sun,
  User,
  LogOut,
  Book,
} from "lucide-react";
import { clearToken } from "@/lib/token-manager";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Problems", href: "/problems", icon: List },
  { name: "Cheatsheets", href: "/cheatsheets", icon: Book },
  { name: "Profile", href: "/profile", icon: User },
];

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true);

  // On mount, check localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("dark-mode");
    if (savedMode === "true") {
      document.body.classList.add("dark");
      setThemeColor("#0a0a0a");
      setIsDark(true);
    } else {
      document.body.classList.remove("dark");
      setThemeColor("#ffffff");
      setIsDark(false);
      if (savedMode === null) {
        // default to dark mode off
        localStorage.setItem("dark-mode", "true");
      }
    }
  }, []);

  function setThemeColor(color: string) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", color);
    else {
      const m = document.createElement("meta");
      m.setAttribute("name", "theme-color");
      m.setAttribute("content", color);
      document.head.appendChild(m);
    }
  }

  const toggleDarkMode = () => {
    if (isDark) {
      document.body.classList.remove("dark");
      localStorage.setItem("dark-mode", "false");
      setThemeColor("#ffffff");
      setIsDark(false);
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("dark-mode", "true");
      setThemeColor("#0a0a0a");
      setIsDark(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      aria-label="Toggle Dark Mode"
      className="cursor-pointer"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/signin" || pathname === "/signup") {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">LeetCode Tracker</span>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">LeetCode Tracker</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  asChild
                  className="flex items-center space-x-2"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              );
            })}

            {/* Logout button (direct redirect) */}
            <Button
              variant="ghost"
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => {
                clearToken();
                router.push("/signin");
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>

            <DarkModeToggle />
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                asChild
                className="w-full justify-start flex items-center space-x-2"
                onClick={() => setMobileOpen(false)}
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </Button>
            );
          })}

          {/* Mobile Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              setMobileOpen(false);
              clearToken();
              router.push("/signin");
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </nav>
  );
}
