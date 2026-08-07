import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BrainCircuit,
  Briefcase,
  Compass,
  FileText,
  FolderKanban,
  GaugeCircle,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Map,
  Menu,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/pathora/ui-bits";
import { ThemeToggle } from "@/components/pathora/theme-toggle";
import { XpBar } from "@/components/pathora/xp-bar";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/advisor", label: "Career Advisor", icon: Compass },
  { to: "/roadmap", label: "Smart Roadmap", icon: Map },
  { to: "/skills", label: "Skills Gap", icon: GaugeCircle },
  { to: "/learn", label: "Learning Hub", icon: LibraryBig },
  { to: "/opportunities", label: "Opportunities", icon: Briefcase },
  { to: "/portfolio", label: "Portfolio", icon: FolderKanban },
  { to: "/cv", label: "CV Builder", icon: FileText },
  { to: "/ai-twin", label: "AI Twin", icon: BrainCircuit },
  { to: "/achievements", label: "Achievements", icon: Award },
] as const;

function NavLinks({
  onNavigate,
  isAdmin,
}: {
  onNavigate?: (() => void) | undefined;
  isAdmin?: boolean | undefined;
}) {

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = isAdmin
    ? [...NAV, { to: "/admin", label: "Admin Panel", icon: Shield } as const]
    : NAV;

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "gradient-surface shadow-glow"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  name,
  email,
  xp,
  isAdmin,
  onSignOut,
}: {
  name: string;
  email: string;
  xp: number;
  isAdmin?: boolean;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const initials = (name || email).slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar p-4 lg:flex">
        <Link to="/dashboard" className="px-1 py-2">
          <Logo />
        </Link>
        <div className="mt-6 flex-1 overflow-y-auto">
          <NavLinks isAdmin={isAdmin} />
        </div>
        <div className="space-y-3 pt-4">
          <XpBar xp={xp} compact />
          <div className="flex items-center gap-2 rounded-xl border bg-card p-2">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{name || "Student"}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onSignOut} aria-label="Sign out">
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Logo />
              <div className="mt-6">
                <NavLinks isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
              </div>
              <div className="mt-6">
                <XpBar xp={xp} compact />
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/dashboard" className="lg:hidden">
            <Logo showText={false} />
          </Link>
          <p className="hidden text-sm text-muted-foreground lg:block">
            From Student to Professional
          </p>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={onSignOut} className="lg:hidden">
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
