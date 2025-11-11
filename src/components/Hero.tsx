import { useState } from "react";
import QuoteFormModal from "./QuoteFormModal";

export default function Hero() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-background bg-pattern">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-muted/30 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-accent/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-secondary/40 rounded-full blur-2xl"></div>
      </div>

      <div className="container relative z-10 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="text-center md:text-left space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-accent leading-tight">
              Doces que Aquecem o Coração
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Brownies, cookies e biscoitos artesanais feitos com carinho e os melhores ingredientes. 
              Cada pedaço é uma experiência de puro prazer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center pt-4">
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="px-8 py-4 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity font-medium text-lg shadow-md hover:shadow-lg"
              >
                Solicite seu Orçamento!
              </button>
              <button
                onClick={() => scrollToSection("contato")}
                className="px-8 py-4 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity font-medium text-lg shadow-md hover:shadow-lg"
              >
                Fale Conosco
              </button>
            </div>
            <QuoteFormModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
          </div>
          <div className="w-full max-w-md mx-auto md:max-w-none">
            <img 
              src="/hero-brownies.jpg" 
              alt="Brownies Bibbidi Brownie" 
              className="rounded-2xl w-full h-auto object-cover border-4 md:border-8 border-accent shadow-[0_15px_40px_rgba(0,0,0,0.4)] md:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:hover:shadow-[0_25px_70px_rgba(0,0,0,0.6)] transition-shadow duration-300"
            />
          </div>
        </div>
      </div>


    </section>
  );
}
