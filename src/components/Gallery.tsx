export default function Gallery() {
  const images = [
    {
      src: "/produtos/slide_2.jpg",
      alt: "Sabores de Brownies Bibbidi",
      title: "Nossos Sabores"
    },
    {
      src: "/produtos/slide_3.jpg",
      alt: "Variedade de Produtos",
      title: "Nossas Delícias"
    }
  ];

  return (
    <section id="galeria" className="py-20 bg-muted/30 bg-pattern">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-accent mb-4">
            Galeria de Delícias
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Confira nossos produtos artesanais feitos com amor e dedicação
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {images.map((image, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <h3 className="text-3xl font-bold text-accent">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
