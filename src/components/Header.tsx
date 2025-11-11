import { APP_LOGO, APP_TITLE } from "@/const";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 border-b border-border shadow-md">
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src={APP_LOGO} alt={APP_TITLE} className="h-20 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("produtos")}
            className="text-card-foreground hover:text-accent transition-colors font-medium"
          >
            Produtos
          </button>
          <button
            onClick={() => scrollToSection("sobre")}
            className="text-card-foreground hover:text-accent transition-colors font-medium"
          >
            Sobre
          </button>

          <button
            onClick={() => scrollToSection("contato")}
            className="px-6 py-2 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity font-medium shadow-md"
          >
            Contato
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

        {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container py-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("produtos")}
              className="text-left text-card-foreground hover:text-accent transition-colors font-medium py-2"
            >
              Produtos
            </button>
            <button
              onClick={() => scrollToSection("sobre")}
              className="text-left text-card-foreground hover:text-accent transition-colors font-medium py-2"
            >
              Sobre
            </button>

            <button
              onClick={() => scrollToSection("contato")}
              className="text-left px-6 py-2 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity font-medium shadow-md"
            >
              Contato
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
