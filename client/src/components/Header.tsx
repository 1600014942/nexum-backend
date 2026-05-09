import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/indices", label: "Indices" },
    { href: "/rfq", label: "Request Quote" },
    { href: "/access", label: "Request Access" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container py-4 flex items-center justify-between">
        <Link href="/">
          <div className="text-2xl font-bold text-accent cursor-pointer" style={{ textShadow: "0 0 10px rgba(0, 255, 0, 0.5)" }}>
            NEXUM
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a className="text-foreground hover:text-accent transition-colors text-sm font-medium">
                {link.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-accent hover:text-primary transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <nav className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className="text-foreground hover:text-accent transition-colors text-sm font-medium block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
