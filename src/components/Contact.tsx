import { Mail, MessageCircle, Instagram } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const contactInfo = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Entre em contato para fazer seu pedido",
    value: "(21) 99594-2928",
    link: "https://wa.me/5521995942928",
    color: "text-green-700",
    bgColor: "bg-green-100"
  },
  {
    icon: Mail,
    title: "E-mail",
    description: "Envie sua mensagem ou orçamento",
    value: "bibbidibrownie@gmail.com",
    link: "mailto:bibbidibrownie@gmail.com",
    color: "text-accent",
    bgColor: "bg-accent/30"
  },
  {
    icon: Instagram,
    title: "Instagram",
    description: "Siga para ver nossas delícias",
    value: "@bibbidibrownie",
    link: "https://instagram.com/bibbidibrownie",
    color: "text-pink-700",
    bgColor: "bg-pink-100"
  }
];

export default function Contact() {
  const handleContactClick = (contactType: string) => {
    // Google Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'contact_click', {
        event_category: 'engagement',
        event_label: contactType,
        value: 1
      });
    }
  };

  return (
    <section id="contato" className="py-20 bg-muted bg-pattern">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-accent mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Ficou com água na boca? Entre em contato para fazer seu pedido ou tirar dúvidas. 
            Estamos prontos para adoçar o seu dia!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contactInfo.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <a
                key={index}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleContactClick(contact.title)}
                className="block transition-transform hover:scale-105"
              >
                <Card className="h-full hover:shadow-xl transition-shadow bg-card border-border">
                  <CardHeader className="text-center">
                    <div className={`mx-auto mb-4 p-5 ${contact.bgColor} rounded-full w-fit shadow-md`}>
                      <Icon className={`w-10 h-10 ${contact.color}`} />
                    </div>
                    <CardTitle className="text-2xl text-card-foreground font-bold">{contact.title}</CardTitle>
                    <CardDescription className="text-card-foreground/70">
                      {contact.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="font-bold text-lg text-accent hover:text-primary transition-colors">
                      {contact.value}
                    </p>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-foreground/80 text-lg">
            Para entrar em contato, basta clicar em qualquer meio de comunicação acima e será automaticamente direcionado.
          </p>
        </div>
      </div>
    </section>
  );
}
