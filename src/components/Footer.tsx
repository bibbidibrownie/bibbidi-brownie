import { APP_TITLE } from "@/const";
import { Instagram, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-border bg-pattern">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold">{APP_TITLE}</h3>
            <p className="text-primary-foreground/80">
              Doces artesanais feitos com carinho e os melhores ingredientes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Produtos
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href="https://wa.me/5521995942928"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="mailto:bibbidibrownie@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/bibbidibrownie"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/80">
          <p>&copy; {currentYear} {APP_TITLE}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
