import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface ProductSelection {
  name: string;
  quantity: string;
  flavor?: string;
  packageSize?: string; // Para biscoitos amanteigados
}

interface QuoteFormModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function QuoteFormModal({ trigger, open: controlledOpen, onOpenChange }: QuoteFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
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
    deliveryAddress: "",
    deliveryCep: "",
    deliveryNumber: "",
    deliveryComplement: "",
    deliveryNeighborhood: "",
    deliveryCity: "",
    deliveryDateTime: "",

    // Seção 5: Informações Adicionais
    observations: "",
    howDidYouKnow: "",
    howDidYouKnowOther: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcular data mínima (48h a partir de agora)
  const getMinDate = () => {
    const date = new Date();
    date.setHours(date.getHours() + 48);
    return date.toISOString().split('T')[0];
  };

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

  // Sabores específicos por produto
  const getFlavorOptions = (product: string) => {
    if (product.includes("Cookie")) {
      return [
        "Chocolate Chip",
        "Macadamia",
        "Duplo Chocolate com Macadamia"
      ];
    } else if (product.includes("Snack")) {
      return ["Tradicional"];
    } else if (product.includes("Brownies") || product.includes("Cake")) {
      return [
        "Tradicional",
        "Café",
        "Meio-Amargo",
        "Recheado - Doce de Leite",
        "Recheado - Nutella",
        "Recheado - Brigadeiro",
        "Outros (especificar nas observações)"
      ];
    }
    return [];
  };

  const handleProductToggle = (product: string) => {
    const newSelected = formData.selectedProducts.includes(product)
      ? formData.selectedProducts.filter(p => p !== product)
      : [...formData.selectedProducts, product];
    
    setFormData({ ...formData, selectedProducts: newSelected });
  };

  const handleProductDetailChange = (product: string, field: keyof ProductSelection, value: string) => {
    setFormData({
      ...formData,
      productDetails: {
        ...formData.productDetails,
        [product]: {
          ...formData.productDetails[product],
          name: product,
          [field]: value
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.fullName || !formData.email || !formData.phone || !formData.eventDate) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (formData.selectedProducts.length === 0) {
      toast.error("Por favor, selecione pelo menos um produto!");
      return;
    }

    setIsSubmitting(true);

    // Montar mensagem do pedido
    let message = `📋 NOVA SOLICITAÇÃO DE ORÇAMENTO\n\n`;
    message += `👤 CLIENTE:\n`;
    message += `Nome: ${formData.fullName}\n`;
    message += `Email: ${formData.email}\n`;
    message += `Telefone: ${formData.phone}\n`;
    message += `Data do Evento: ${formData.eventDate}\n`;
    
    message += `\n🍫 PRODUTOS SOLICITADOS:\n`;
    formData.selectedProducts.forEach(product => {
      if (product === "Outros" && formData.otherProduct) {
        message += `• ${formData.otherProduct}\n`;
      } else {
        message += `• ${product}\n`;
        const details = formData.productDetails[product];
        if (details) {
          if (details.quantity) message += `  Quantidade: ${details.quantity}\n`;
          if (details.flavor) message += `  Sabor: ${details.flavor}\n`;
          if (details.packageSize) message += `  Embalagem: ${details.packageSize}\n`;
        }
      }
    });

    if (formData.wantsCustomization === "yes") {
      message += `\n🎨 PERSONALIZAÇÃO:\n`;
      if (formData.customizationType) message += `Tipo: ${formData.customizationType}\n`;
      if (formData.customizationDescription) message += `Descrição: ${formData.customizationDescription}\n`;
    }

    message += `\n🚚 ENTREGA:\n`;
    message += `Método: ${formData.deliveryMethod === "pickup" ? "Retirada no local" : "Entrega"}\n`;
    if (formData.deliveryMethod === "delivery") {
      message += `Endereço: ${formData.deliveryAddress}\n`;
      message += `CEP: ${formData.deliveryCep}\n`;
      message += `Número: ${formData.deliveryNumber}\n`;
      if (formData.deliveryComplement) message += `Complemento: ${formData.deliveryComplement}\n`;
      message += `Bairro: ${formData.deliveryNeighborhood}\n`;
      message += `Cidade: ${formData.deliveryCity}\n`;
    }
    if (formData.deliveryDateTime) message += `Data/Horário: ${formData.deliveryDateTime}\n`;

    if (formData.observations || formData.howDidYouKnow) {
      message += `\n📝 INFORMAÇÕES ADICIONAIS:\n`;
      if (formData.observations) message += `Observações: ${formData.observations}\n`;
      if (formData.howDidYouKnow) {
        const howKnow = formData.howDidYouKnow === "outros" && formData.howDidYouKnowOther 
          ? formData.howDidYouKnowOther 
          : formData.howDidYouKnow;
        message += `Como conheceu: ${howKnow}\n`;
      }
    }

    // Enviar para WhatsApp
    const whatsappNumber = "5548988229812";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Google Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quote_form_submit', {
        event_category: 'forms',
        event_label: 'Quote Request',
        value: 1
      });
    }

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');

    toast.success("Orçamento enviado! Você será redirecionado para o WhatsApp.");
    
    setIsSubmitting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!controlledOpen && (
        <DialogTrigger asChild>
          {trigger || (
            <Button size="lg" className="text-lg px-8 py-6">
              Solicite seu Orçamento!
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-3xl font-bold text-accent">
            Solicite seu Orçamento
          </DialogTitle>
          <DialogDescription className="text-base">
            Preencha o formulário abaixo e receba uma cotação personalizada!
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] px-6">
          <form onSubmit={handleSubmit} className="space-y-6 pb-6">
            {/* Seção 1: Informações do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">1. Informações do Cliente</CardTitle>
                <CardDescription>Dados para contato e confirmação do pedido</CardDescription>
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
                      placeholder="(48) 98822-9812"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="eventDate">Data do Evento *</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    min={getMinDate()}
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Pedidos devem ser feitos com no mínimo 48 horas de antecedência
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Seção 2: Detalhes do Pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">2. Detalhes do Pedido</CardTitle>
                <CardDescription>Selecione os produtos e quantidades desejadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={product}
                          checked={formData.selectedProducts.includes(product)}
                          onCheckedChange={() => handleProductToggle(product)}
                        />
                        <Label htmlFor={product} className="text-sm font-medium cursor-pointer">
                          {product}
                        </Label>
                      </div>
                      
                      {formData.selectedProducts.includes(product) && product === "Outros" && (
                        <div className="ml-6 space-y-2">
                          <div>
                            <Label htmlFor="otherProduct" className="text-sm">Descreva o produto desejado</Label>
                            <Textarea
                              id="otherProduct"
                              value={formData.otherProduct}
                              onChange={(e) => setFormData({ ...formData, otherProduct: e.target.value })}
                              placeholder="Ex: Bolo de brownie de 3 andares, Cupcakes de brownie, etc."
                              rows={2}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      )}
                      
                      {formData.selectedProducts.includes(product) && product !== "Outros" && (
                        <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`${product}-quantity`} className="text-sm">Quantidade</Label>
                            <Input
                              id={`${product}-quantity`}
                              type="number"
                              min="1"
                              value={formData.productDetails[product]?.quantity || ""}
                              onChange={(e) => handleProductDetailChange(product, "quantity", e.target.value)}
                              placeholder="Ex: 50"
                              className="text-sm"
                            />
                          </div>
                          
                          {product === "Biscoitos Amanteigados" ? (
                            <div>
                              <Label htmlFor={`${product}-package`} className="text-sm">Embalagem</Label>
                              <Select
                                value={formData.productDetails[product]?.packageSize || ""}
                                onValueChange={(value) => handleProductDetailChange(product, "packageSize", value)}
                              >
                                <SelectTrigger id={`${product}-package`} className="text-sm">
                                  <SelectValue placeholder="Selecione a embalagem" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Saquinho com 6" className="text-sm">Saquinho com 6</SelectItem>
                                  <SelectItem value="Saquinho com 8" className="text-sm">Saquinho com 8</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <div>
                              <Label htmlFor={`${product}-flavor`} className="text-sm">Sabor/Recheio</Label>
                              <Select
                                value={formData.productDetails[product]?.flavor || ""}
                                onValueChange={(value) => handleProductDetailChange(product, "flavor", value)}
                              >
                                <SelectTrigger id={`${product}-flavor`} className="text-sm">
                                  <SelectValue placeholder="Selecione o sabor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getFlavorOptions(product).map((flavor) => (
                                    <SelectItem key={flavor} value={flavor} className="text-sm">
                                      {flavor}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
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
                <CardTitle className="text-xl">3. Personalização</CardTitle>
                <CardDescription>Deseja alguma personalização especial?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={formData.wantsCustomization}
                  onValueChange={(value) => setFormData({ ...formData, wantsCustomization: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="custom-no" />
                    <Label htmlFor="custom-no" className="text-sm">Não</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="custom-yes" />
                    <Label htmlFor="custom-yes" className="text-sm">Sim</Label>
                  </div>
                </RadioGroup>

                {formData.wantsCustomization === "yes" && (
                  <div className="space-y-3 mt-3">
                    <div>
                      <Label htmlFor="customizationType" className="text-sm">Tipo de Personalização</Label>
                      <Input
                        id="customizationType"
                        value={formData.customizationType}
                        onChange={(e) => setFormData({ ...formData, customizationType: e.target.value })}
                        placeholder="Ex: Embalagem personalizada, Tags com nome"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customizationDescription" className="text-sm">Descrição da Personalização</Label>
                      <Textarea
                        id="customizationDescription"
                        value={formData.customizationDescription}
                        onChange={(e) => setFormData({ ...formData, customizationDescription: e.target.value })}
                        placeholder="Descreva em detalhes como você imagina a personalização..."
                        rows={3}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seção 4: Entrega */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">4. Entrega</CardTitle>
                <CardDescription>Como você prefere receber seu pedido?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={formData.deliveryMethod}
                  onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="delivery-pickup" />
                    <Label htmlFor="delivery-pickup" className="text-sm">Retirada no local</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery-delivery" />
                    <Label htmlFor="delivery-delivery" className="text-sm">Entrega</Label>
                  </div>
                </RadioGroup>

                {formData.deliveryMethod === "delivery" && (
                  <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <Label htmlFor="deliveryAddress" className="text-sm">Endereço</Label>
                        <Input
                          id="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                          placeholder="Rua, Avenida..."
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryCep" className="text-sm">CEP</Label>
                        <Input
                          id="deliveryCep"
                          value={formData.deliveryCep}
                          onChange={(e) => setFormData({ ...formData, deliveryCep: e.target.value })}
                          placeholder="88000-000"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="deliveryNumber" className="text-sm">Número</Label>
                        <Input
                          id="deliveryNumber"
                          value={formData.deliveryNumber}
                          onChange={(e) => setFormData({ ...formData, deliveryNumber: e.target.value })}
                          placeholder="123"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryComplement" className="text-sm">Complemento</Label>
                        <Input
                          id="deliveryComplement"
                          value={formData.deliveryComplement}
                          onChange={(e) => setFormData({ ...formData, deliveryComplement: e.target.value })}
                          placeholder="Apto, Bloco..."
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryNeighborhood" className="text-sm">Bairro</Label>
                        <Input
                          id="deliveryNeighborhood"
                          value={formData.deliveryNeighborhood}
                          onChange={(e) => setFormData({ ...formData, deliveryNeighborhood: e.target.value })}
                          placeholder="Centro"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="deliveryCity" className="text-sm">Cidade</Label>
                      <Input
                        id="deliveryCity"
                        value={formData.deliveryCity}
                        onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                        placeholder="Florianópolis"
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="deliveryDateTime" className="text-sm">Data e Horário Preferencial</Label>
                  <Input
                    id="deliveryDateTime"
                    type="datetime-local"
                    value={formData.deliveryDateTime}
                    onChange={(e) => setFormData({ ...formData, deliveryDateTime: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seção 5: Informações Adicionais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">5. Informações Adicionais</CardTitle>
                <CardDescription>Ajude-nos a preparar o melhor orçamento para você</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="observations" className="text-sm">Observações / Pedidos Especiais</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Alguma informação adicional que devemos saber?"
                    rows={3}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="howDidYouKnow" className="text-sm">Como conheceu a Bibbidi Brownie?</Label>
                  <Select
                    value={formData.howDidYouKnow}
                    onValueChange={(value) => setFormData({ ...formData, howDidYouKnow: value, howDidYouKnowOther: "" })}
                  >
                    <SelectTrigger id="howDidYouKnow" className="text-sm">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram" className="text-sm">Instagram</SelectItem>
                      <SelectItem value="Indicação de amigo" className="text-sm">Indicação de amigo</SelectItem>
                      <SelectItem value="Google" className="text-sm">Google</SelectItem>
                      <SelectItem value="Evento" className="text-sm">Evento</SelectItem>
                      <SelectItem value="outros" className="text-sm">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.howDidYouKnow === "outros" && (
                  <div>
                    <Label htmlFor="howDidYouKnowOther" className="text-sm">Como você conheceu?</Label>
                    <Input
                      id="howDidYouKnowOther"
                      value={formData.howDidYouKnowOther}
                      onChange={(e) => setFormData({ ...formData, howDidYouKnowOther: e.target.value })}
                      placeholder="Descreva como conheceu a Bibbidi Brownie"
                      className="text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botão de Envio */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="text-lg px-12 py-6"
              >
                {isSubmitting ? "Enviando..." : "Solicitar Orçamento"}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              * Campos obrigatórios. Ao enviar, você será redirecionado para o WhatsApp com todas as informações preenchidas.
            </p>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
