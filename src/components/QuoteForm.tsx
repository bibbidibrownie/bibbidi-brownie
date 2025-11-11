import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface ProductSelection {
  name: string;
  items: Array<{
    quantity: string;
    flavor?: string;
    packageSize?: string;
  }>;
}

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    // Seção 1: Informações do Cliente
    fullName: "",
    email: "",
    phone: "",
    eventDate: "",

    // Seção 2: Detalhes do Pedido
    selectedProducts: [] as string[],
    productDetails: {} as Record<string, ProductSelection>,
    otherProduct: "",

    // Seção 3: Personalização
    wantsCustomization: "no",
    customizationType: "",
    customizationDescription: "",

    // Seção 4: Entrega
    deliveryMethod: "pickup",
    deliveryCep: "",
    deliveryAddress: "",
    deliveryNumber: "",
    deliveryComplement: "",
    deliveryNeighborhood: "",
    deliveryCity: "",
    deliveryDateTime: "",

    // Seção 5: Informações Adicionais
    observations: "",
    howDidYouKnow: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const products = [
    "Brownies Mini (3,5x3,5 cm)",
    "Brownies Médio (4x4 cm)",
    "Brownies Grande (6x6 cm)",
    "Cake Pequeno (20 cm)",
    "Cake Grande (24 cm)",
    "Snack (latinhas)",
    "Cookie Grande",
    "Cookie Mini",
    "Biscoitos Amanteigados",
    "Outros"
  ];

  const getFlavorsByProduct = (product: string): string[] => {
    if (product.includes("Brownie") || product.includes("Cake")) {
      return ["Tradicional", "Café", "Meio Amargo", "Nutella", "Doce de Leite", "Caramelo Salgado", "Café com Caramelo"];
    } else if (product.includes("Snack")) {
      return ["Tradicional"];
    } else if (product.includes("Cookie")) {
      return ["Gotas de Chocolate", "Macadamia", "Macadamia Duplo Chocolate"];
    }
    return [];
  };

  const handleProductToggle = (product: string) => {
    const newSelected = formData.selectedProducts.includes(product)
      ? formData.selectedProducts.filter(p => p !== product)
      : [...formData.selectedProducts, product];
    
    // Inicializar com um item vazio quando selecionar
    if (!formData.selectedProducts.includes(product)) {
      setFormData({
        ...formData,
        selectedProducts: newSelected,
        productDetails: {
          ...formData.productDetails,
          [product]: {
            name: product,
            items: [{ quantity: "", flavor: "", packageSize: "" }]
          }
        }
      });
    } else {
      setFormData({ ...formData, selectedProducts: newSelected });
    }
  };

  const handleAddProductItem = (product: string) => {
    const currentDetails = formData.productDetails[product] || { name: product, items: [] };
    setFormData({
      ...formData,
      productDetails: {
        ...formData.productDetails,
        [product]: {
          ...currentDetails,
          items: [...currentDetails.items, { quantity: "", flavor: "", packageSize: "" }]
        }
      }
    });
  };

  const handleProductItemChange = (product: string, index: number, field: string, value: string) => {
    const currentDetails = formData.productDetails[product];
    const newItems = [...currentDetails.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    setFormData({
      ...formData,
      productDetails: {
        ...formData.productDetails,
        [product]: {
          ...currentDetails,
          items: newItems
        }
      }
    });
  };

  const handleRemoveProductItem = (product: string, index: number) => {
    const currentDetails = formData.productDetails[product];
    const newItems = currentDetails.items.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      productDetails: {
        ...formData.productDetails,
        [product]: {
          ...currentDetails,
          items: newItems
        }
      }
    });
  };

  const handleCepChange = async (cep: string) => {
    setFormData({ ...formData, deliveryCep: cep });
    
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            deliveryAddress: data.logradouro || "",
            deliveryNeighborhood: data.bairro || "",
            deliveryCity: data.localidade || ""
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  // Calcular data mínima (depois de amanhã)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (formData.selectedProducts.length === 0) {
      toast.error("Por favor, selecione pelo menos um produto!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados formatados para o email
      const productsFormatted = formData.selectedProducts.map(product => {
        if (product === "Outros" && formData.otherProduct) {
          return formData.otherProduct;
        }
        const details = formData.productDetails[product];
        if (details && details.items) {
          return details.items.map((item, idx) => {
            let info = `${product} #${idx + 1}`;
            if (item.quantity) info += ` - Qtd: ${item.quantity}`;
            if (item.flavor) info += ` - Sabor: ${item.flavor}`;
            if (item.packageSize) info += ` - Tamanho: ${item.packageSize}`;
            return info;
          }).join("; ");
        }
        return product;
      }).join("; ");

      const emailData = {
        // Informações do Cliente
        "Nome Completo": formData.fullName,
        "Email": formData.email,
        "Telefone": formData.phone,
        "Data do Evento": formData.eventDate || "Não informado",
        
        // Produtos Solicitados
        "Produtos": productsFormatted,
        
        // Personalização
        "Deseja Personalização": formData.wantsCustomization === "yes" ? "Sim" : "Não",
        "Tipo de Personalização": formData.customizationType || "N/A",
        "Descrição da Personalização": formData.customizationDescription || "N/A",
        
        // Entrega
        "Método de Entrega": formData.deliveryMethod === "pickup" ? "Retirada no local" : "Entrega",
        "CEP": formData.deliveryCep || "N/A",
        "Endereço de Entrega": formData.deliveryAddress || "N/A",
        "Número": formData.deliveryNumber || "N/A",
        "Complemento": formData.deliveryComplement || "N/A",
        "Bairro": formData.deliveryNeighborhood || "N/A",
        "Cidade": formData.deliveryCity || "N/A",
        "Data/Horário de Entrega": formData.deliveryDateTime || "Não informado",
        
        // Informações Adicionais
        "Observações": formData.observations || "Nenhuma",
        "Como Conheceu": formData.howDidYouKnow || "Não informado",
        
        // Campo especial para o assunto do email
        "_subject": `🍫 Novo Orçamento - ${formData.fullName}`,
      };

      // Enviar para Formspree
      const response = await fetch("https://formspree.io/f/mkgknvry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar orçamento");
      }

      // Google Analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'quote_form_submit', {
          event_category: 'forms',
          event_label: 'Quote Request',
          value: 1
        });
      }

      toast.success("Orçamento enviado com sucesso! Entraremos em contato em breve.");
      
      // Limpar formulário após sucesso
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        eventDate: "",
        selectedProducts: [],
        productDetails: {},
        otherProduct: "",
        wantsCustomization: "no",
        customizationType: "",
        customizationDescription: "",
        deliveryMethod: "pickup",
        deliveryCep: "",
        deliveryAddress: "",
        deliveryNumber: "",
        deliveryComplement: "",
        deliveryNeighborhood: "",
        deliveryCity: "",
        deliveryDateTime: "",
        observations: "",
        howDidYouKnow: ""
      });
      
    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
      toast.error("Erro ao enviar orçamento. Por favor, tente novamente ou entre em contato pelo WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-120px)]">
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">1. Informações do Cliente</CardTitle>
              <CardDescription className="text-accent">Dados para contato e confirmação do pedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(21) 99594-2928"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="eventDate">Data do Evento</Label>
                <Input
                  id="eventDate"
                  type="date"
                  min={getMinDate()}
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seção 2: Detalhes do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">2. Detalhes do Pedido</CardTitle>
              <CardDescription className="text-accent">Selecione os produtos e quantidades desejadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={product}
                        checked={formData.selectedProducts.includes(product)}
                        onCheckedChange={() => handleProductToggle(product)}
                      />
                      <Label htmlFor={product} className="text-base font-medium cursor-pointer">
                        {product}
                      </Label>
                    </div>
                    
                    {formData.selectedProducts.includes(product) && product === "Outros" && (
                      <div className="ml-6 space-y-3">
                        <div>
                          <Label htmlFor="otherProduct">Descreva o produto desejado</Label>
                          <Textarea
                            id="otherProduct"
                            value={formData.otherProduct}
                            onChange={(e) => setFormData({ ...formData, otherProduct: e.target.value })}
                            placeholder="Ex: Bolo de brownie de 3 andares, Cupcakes de brownie, etc."
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                    
                    {formData.selectedProducts.includes(product) && product !== "Outros" && (
                      <div className="ml-6 space-y-3">
                        {formData.productDetails[product]?.items.map((item, index) => (
                          <div key={index} className="border-l-2 border-accent pl-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-accent">Item {index + 1}</span>
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveProductItem(product, index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remover
                                </Button>
                              )}
                            </div>
                            
                            {product === "Biscoitos Amanteigados" ? (
                              <div>
                                <Label>Tamanho do Pacotinho</Label>
                                <Select
                                  value={item.packageSize || ""}
                                  onValueChange={(value) => handleProductItemChange(product, index, "packageSize", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tamanho" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="6 unidades">6 unidades</SelectItem>
                                    <SelectItem value="8 unidades">8 unidades</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label>Quantidade</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity || ""}
                                    onChange={(e) => handleProductItemChange(product, index, "quantity", e.target.value)}
                                    placeholder="Ex: 50"
                                  />
                                </div>
                                <div>
                                  <Label>Sabor/Recheio</Label>
                                  <Select
                                    value={item.flavor || ""}
                                    onValueChange={(value) => handleProductItemChange(product, index, "flavor", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o sabor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getFlavorsByProduct(product).map((flavor) => (
                                        <SelectItem key={flavor} value={flavor}>
                                          {flavor}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddProductItem(product)}
                          className="w-full"
                        >
                          + Adicionar outro sabor/quantidade
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Seção 3: Personalização */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">3. Personalização</CardTitle>
              <CardDescription className="text-accent">Deseja alguma personalização especial?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.wantsCustomization}
                onValueChange={(value) => setFormData({ ...formData, wantsCustomization: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="custom-no" />
                  <Label htmlFor="custom-no">Não</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="custom-yes" />
                  <Label htmlFor="custom-yes">Sim</Label>
                </div>
              </RadioGroup>

              {formData.wantsCustomization === "yes" && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="customizationType">Tipo de Personalização</Label>
                    <Input
                      id="customizationType"
                      value={formData.customizationType}
                      onChange={(e) => setFormData({ ...formData, customizationType: e.target.value })}
                      placeholder="Ex: Embalagem personalizada, Tags com nome, Cores específicas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customizationDescription">Descrição da Personalização</Label>
                    <Textarea
                      id="customizationDescription"
                      value={formData.customizationDescription}
                      onChange={(e) => setFormData({ ...formData, customizationDescription: e.target.value })}
                      placeholder="Descreva em detalhes como você gostaria da personalização"
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seção 4: Entrega */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">4. Entrega</CardTitle>
              <CardDescription className="text-accent">Como você prefere receber seu pedido?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.deliveryMethod}
                onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="delivery-pickup" />
                  <Label htmlFor="delivery-pickup">Retirada no local</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery-delivery" />
                  <Label htmlFor="delivery-delivery">Entrega</Label>
                </div>
              </RadioGroup>

              {formData.deliveryMethod === "delivery" && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="deliveryCep">CEP *</Label>
                    <Input
                      id="deliveryCep"
                      value={formData.deliveryCep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="deliveryAddress">Endereço</Label>
                      <Input
                        id="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        placeholder="Rua, Avenida..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryNumber">Número</Label>
                      <Input
                        id="deliveryNumber"
                        value={formData.deliveryNumber}
                        onChange={(e) => setFormData({ ...formData, deliveryNumber: e.target.value })}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deliveryComplement">Complemento</Label>
                      <Input
                        id="deliveryComplement"
                        value={formData.deliveryComplement}
                        onChange={(e) => setFormData({ ...formData, deliveryComplement: e.target.value })}
                        placeholder="Apto, Bloco..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryNeighborhood">Bairro</Label>
                      <Input
                        id="deliveryNeighborhood"
                        value={formData.deliveryNeighborhood}
                        onChange={(e) => setFormData({ ...formData, deliveryNeighborhood: e.target.value })}
                        placeholder="Centro"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deliveryCity">Cidade</Label>
                    <Input
                      id="deliveryCity"
                      value={formData.deliveryCity}
                      onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                      placeholder="Rio de Janeiro"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="deliveryDateTime">Data e Horário Preferencial</Label>
                <Input
                  id="deliveryDateTime"
                  type="datetime-local"
                  value={formData.deliveryDateTime}
                  onChange={(e) => setFormData({ ...formData, deliveryDateTime: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seção 5: Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">5. Informações Adicionais</CardTitle>
              <CardDescription className="text-accent">Ajude-nos a preparar o melhor orçamento para você</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="observations">Observações / Pedidos Especiais</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Alguma informação adicional que devemos saber?"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="howDidYouKnow">Como conheceu a Bibbidi Brownie?</Label>
                <Select
                  value={formData.howDidYouKnow}
                  onValueChange={(value) => setFormData({ ...formData, howDidYouKnow: value })}
                >
                  <SelectTrigger id="howDidYouKnow">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="indicacao">Indicação de amigo</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Envio */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="text-lg px-12 py-6"
            >
              {isSubmitting ? "Enviando..." : "Solicitar Orçamento"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            * Campos obrigatórios. Ao enviar, você receberá uma confirmação por email.
          </p>
      </form>
    </div>
  );
}
