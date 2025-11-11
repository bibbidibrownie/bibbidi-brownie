import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappNumber = "5521995942928";
  const message = encodeURIComponent("Olá! Gostaria de fazer um pedido na Bibbidi Brownie 🤎");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  const handleClick = () => {
    // Google Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: 'floating_button',
        value: 1
      });
    }
  };

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group animate-bounce-slow"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      
      {/* Tooltip */}
      <span className="absolute right-20 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium">
        Faça seu pedido!
      </span>

      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-75"></span>
    </a>
  );
}
