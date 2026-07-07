import { Link, useLocation } from "wouter";
import { FOOTER_LEGAL, COPYRIGHT_NOTICE } from "@/lib/privacyNotice";
import { BookOpen, Mic, Search, Bookmark, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: BookOpen },
    { href: "/live", label: "Live", icon: Mic },
    { href: "/search", label: "Search", icon: Search },
    { href: "/favorites", label: "Favorites", icon: Bookmark },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <BookOpen className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors" />
            <span className="font-serif text-2xl font-semibold tracking-tight text-primary">Minister.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu" data-testid="nav-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 text-lg font-medium transition-colors hover:text-primary ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="border-t border-border/40 bg-muted/30 py-8 mt-auto">
        <div className="container mx-auto px-4 md:px-8 flex flex-col gap-6 text-center md:text-left">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl mx-auto md:mx-0">
            {FOOTER_LEGAL}
          </p>
          <div className="h-px w-full bg-border/40" />
          <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-4xl mx-auto md:mx-0">
            {COPYRIGHT_NOTICE}
          </p>
        </div>
      </footer>
    </div>
  );
}
