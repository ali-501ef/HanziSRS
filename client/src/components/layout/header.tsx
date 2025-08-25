import * as React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const scrollToSection = (sectionId: string) => {
    if (location !== "/") return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold text-xl tracking-tight" data-testid="link-home">
            <span className="text-primary">漢</span>zi SRS
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button 
              onClick={() => scrollToSection("features")} 
              className="hover:text-primary transition-colors"
              data-testid="button-features"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("pricing")} 
              className="hover:text-primary transition-colors"
              data-testid="button-pricing"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection("faq")} 
              className="hover:text-primary transition-colors"
              data-testid="button-faq"
            >
              FAQ
            </button>
            <Link href="/app" className="hover:text-primary transition-colors" data-testid="link-signin">
              Study App
            </Link>
            <Button data-testid="button-start-free">Start free</Button>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <nav className="flex flex-col gap-3">
              <button 
                onClick={() => scrollToSection("features")} 
                className="text-left hover:text-primary transition-colors"
                data-testid="button-features-mobile"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("pricing")} 
                className="text-left hover:text-primary transition-colors"
                data-testid="button-pricing-mobile"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection("faq")} 
                className="text-left hover:text-primary transition-colors"
                data-testid="button-faq-mobile"
              >
                FAQ
              </button>
              <Link href="/app" className="hover:text-primary transition-colors" data-testid="link-signin-mobile">
                Study App
              </Link>
              <Button className="mt-2" data-testid="button-start-free-mobile">Start free</Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
