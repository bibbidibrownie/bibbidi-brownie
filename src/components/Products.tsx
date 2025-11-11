import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

interface ProductItem {
  name: string;
  description?: string;
  price: string;
  image?: string;
}

interface ProductCategory {
  title: string;
  items: ProductItem[];
}

const brownies: ProductCategory = {
  title: "Brownies",
  items: [
    {
      name: "Mini (3,5x3,5 cm)",
      description: "Mínimo 50 unidades - Tradicional, Café, Meio-Amargo, Recheados",
      price: "A partir de R$ 3,00"
    },
    {
      name: "Médio (4x4 cm)",
      description: "Mínimo 25 unidades - Tradicional, Café, Meio-Amargo, Recheados",
      price: "A partir de R$ 5,50"
    },
    {
      name: "Grande (6x6 cm)",
      description: "Mínimo 15 unidades - Tradicional, Café, Meio-Amargo, Recheados",
      price: "A partir de R$ 7,50"
    },
    {
      name: "Cake - Pequeno (20 cm)",
      description: "Serve de 8 a 10 pessoas - Tradicional, Café, Meio-Amargo, Recheados",
      price: "A partir de R$ 50,00"
    },
    {
      name: "Cake - Grande (24 cm)",
      description: "Serve de 10 a 15 pessoas - Tradicional, Café, Meio-Amargo, Recheados",
      price: "A partir de R$ 90,00"
    },
    {
      name: "Snack",
      description: "Latinha com as disputadas lascas de brownie tradicional",
      price: "R$ 20,00",
      image: "/snack-latinhas.jpg"
    }
  ]
};

const cookies: ProductCategory = {
  title: "Cookies",
  items: [
    {
      name: "Cookie Grande",
      description: "Chocolate Belga, Chocolate Belga e Macadâmia, Macadâmia Duplo Chocolate",
      price: "A partir de R$ 9,00"
    },
    {
      name: "Cookie Mini",
      description: "Chocolate Belga, Chocolate Belga e Macadâmia, Macadâmia Duplo Chocolate",
      price: "A partir de R$ 5,00"
    }
  ]
};

const biscoitos: ProductCategory = {
  title: "Biscoitos Amanteigados",
  items: [
    {
      name: "Pacotinho com 6 unidades",
      description: "Biscoitinhos amanteigados deliciosos",
      price: "R$ 7,50"
    },
    {
      name: "Pacotinho com 8 unidades",
      description: "Biscoitinhos amanteigados deliciosos",
      price: "R$ 9,50"
    },
    {
      name: "Personalizados",
      description: "Formatos e temas personalizados - consulte-nos!",
      price: "Sob consulta"
    }
  ]
};

function ProductCard({ category }: { category: ProductCategory }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleProductClick = (productName: string, categoryTitle: string) => {
    // Google Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'product_view', {
        event_category: 'products',
        event_label: `${categoryTitle} - ${productName}`,
        value: 1
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-4xl font-bold text-accent text-center mb-8">{category.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.items.map((item, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow bg-card border-border cursor-pointer relative overflow-hidden group"
            onClick={() => handleProductClick(item.name, category.title)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <CardHeader>
              <CardTitle className="text-2xl text-card-foreground font-bold">{item.name}</CardTitle>
              {item.description && (
                <CardDescription className="text-card-foreground/80">
                  {item.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{item.price}</p>
              
              {/* Imagem que aparece no hover */}
              {item.image && (
                <div 
                  className={`mt-4 transition-all duration-300 ${
                    hoveredIndex === index ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
                  }`}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Google Analytics event para clique na imagem
                          if (typeof window !== 'undefined' && (window as any).gtag) {
                            (window as any).gtag('event', 'product_image_click', {
                              event_category: 'products',
                              event_label: `${category.title} - ${item.name}`,
                              value: 1
                            });
                          }
                        }}
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <VisuallyHidden>
                        <DialogTitle>{item.name}</DialogTitle>
                      </VisuallyHidden>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-auto rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <section id="produtos" className="py-20 bg-muted bg-pattern">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-accent mb-4">
            Nossos Produtos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cada doce é feito com ingredientes selecionados e muito carinho. 
            Descubra o sabor que vai conquistar seu coração.
          </p>
        </div>

        <div className="space-y-20">
          <ProductCard category={brownies} />
          <ProductCard category={cookies} />
          <ProductCard category={biscoitos} />
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            * Os valores dos brownies quadrados já incluem embalagens personalizadas.
          </p>
        </div>
      </div>
    </section>
  );
}
