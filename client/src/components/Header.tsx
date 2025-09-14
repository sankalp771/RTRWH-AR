import { Droplets, Menu, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="hover-elevate">
            <div className="flex items-center gap-2" data-testid="link-home">
              <div className="p-2 bg-primary rounded-md">
                <Droplets className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">RTRWH/AR</h1>
                <p className="text-xs text-muted-foreground">Rainwater Assistant</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/">
                <Button
                  variant={location === '/' ? 'default' : 'ghost'}
                  size="sm"
                  data-testid="button-home"
                >
                  Home
                </Button>
              </Link>
              <Link href="/calculator">
                <Button
                  variant={location.startsWith('/calculator') ? 'default' : 'ghost'}
                  size="sm"
                  data-testid="button-calculator"
                >
                  Calculator
                </Button>
              </Link>
            </nav>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              data-testid="button-menu"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}