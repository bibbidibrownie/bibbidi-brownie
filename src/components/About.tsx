import { Heart, Sparkles, Users } from "lucide-react";

export default function About() {
  return (
    <section id="sobre" className="py-20 bg-background bg-pattern">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-accent text-center mb-8">
            Sobre a Bibbidi Brownie
          </h2>
          
          <div className="text-center mb-16">
            <p className="text-xl md:text-2xl text-foreground leading-relaxed italic">
              "Onde cada pedaço conta uma história de amor, carinho e sabor"
            </p>
          </div>

          {/* Nossa História */}
          <div className="mb-16 bg-card p-8 md:p-12 rounded-2xl border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-accent" />
              <h3 className="text-3xl md:text-4xl font-bold text-accent">Nossa História</h3>
            </div>
            <div className="space-y-6 text-lg text-card-foreground leading-relaxed">
              <p>
                A <span className="font-bold text-accent">Bibbidi Brownie</span> nasceu em 2020, durante a pandemia. Tudo começou quando 
                decidimos ajudar amigos que tinham um Hostel em Botafogo e estavam enfrentando dificuldades. Eles começaram a vender 
                hambúrgueres por delivery e precisavam de uma sobremesa para completar o cardápio.
              </p>
              <p>
                Foi aí que entramos com os brownies. Começamos a produzir em casa, testando receitas na nossa própria cozinha. Logo percebemos 
                que tínhamos algo especial nas mãos. O que era para ser apenas uma ajuda a amigos virou nossa paixão — e nosso negócio.
              </p>
              <p className="font-semibold text-accent text-xl">
                Nossa missão é trazer felicidade ao paladar para o maior número de pessoas do Brasil.
              </p>
              <p>
                O nosso diferencial está nos sabores. Enquanto a maioria faz brownies de um sabor só e varia os recheios, nós criamos 
                <span className="font-semibold text-accent"> uma receita única e específica para cada sabor</span>. Cada brownie tem sua própria 
                identidade, desenvolvida do zero para entregar uma experiência diferente. Além dos brownies, que são nosso carro-chefe, 
                fazemos Cookies, Banoffe, Biscoitos e outras delícias sazonais.
              </p>
              <p>
                Nossa produção fica na Tijuca e atendemos todo o Brasil. Cada doce que sai daqui 
                leva um pouco da nossa história — e a gente espera fazer parte da sua também.
              </p>
            </div>
          </div>

          {/* Nossos Valores */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-md text-center hover:shadow-xl transition-shadow">
              <div className="mx-auto mb-6 p-4 bg-accent/20 rounded-full w-fit">
                <Heart className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-accent mb-4">Feito com Amor</h3>
              <p className="text-card-foreground leading-relaxed">
                Cada doce é preparado artesanalmente, com ingredientes selecionados e muito carinho. 
                Acreditamos que o amor é o ingrediente secreto que faz toda a diferença.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-md text-center hover:shadow-xl transition-shadow">
              <div className="mx-auto mb-6 p-4 bg-accent/20 rounded-full w-fit">
                <Sparkles className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-accent mb-4">Qualidade Premium</h3>
              <p className="text-card-foreground leading-relaxed">
                Não abrimos mão da qualidade. Do chocolate belga às macadâmias crocantes, 
                cada ingrediente é escolhido para proporcionar uma experiência única.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-md text-center hover:shadow-xl transition-shadow">
              <div className="mx-auto mb-6 p-4 bg-accent/20 rounded-full w-fit">
                <Users className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-accent mb-4">Personalização</h3>
              <p className="text-card-foreground leading-relaxed">
                Cada cliente é único, e seus pedidos também devem ser. Oferecemos personalização 
                completa para tornar seu momento ainda mais especial.
              </p>
            </div>
          </div>

          {/* O Que Nos Move */}
          <div className="bg-gradient-to-br from-accent/10 to-secondary/20 p-8 md:p-12 rounded-2xl border border-accent/30 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-accent mb-6">O Que Nos Move</h3>
            <p className="text-lg md:text-xl text-foreground leading-relaxed max-w-3xl mx-auto mb-6">
              Nossa maior recompensa é saber que nossos doces fazem parte dos seus momentos felizes: 
              aniversários, comemorações, presentes especiais ou simplesmente aquele momento de pausa 
              para se presentear com algo delicioso.
            </p>
            <p className="text-2xl md:text-3xl font-bold text-accent italic">
              Feito com carinho, pensado para você. 🤎
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
