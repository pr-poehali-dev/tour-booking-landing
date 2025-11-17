import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { getTranslation, Language } from '@/lib/i18n';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  type: 'tour' | 'car' | 'accommodation';
  title: string;
  price: number;
  image: string;
}

const Index = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentData, setPaymentData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const t = getTranslation(language);

  const tours = [
    {
      id: '1',
      title: language === 'en' ? 'Tropical Paradise Tour' : language === 'es' ? 'Tour Paraíso Tropical' : language === 'it' ? 'Tour Paradiso Tropicale' : 'Tour Paradis Tropical',
      price: 299,
      duration: language === 'en' ? '5 days' : language === 'es' ? '5 días' : language === 'it' ? '5 giorni' : '5 jours',
      image: 'https://cdn.poehali.dev/projects/fe462799-d6c5-4fb5-9c99-e66e6172322d/files/8a0edecc-eb74-4306-95a2-ea40347f3a63.jpg',
    },
    {
      id: '2',
      title: language === 'en' ? 'Mountain Adventure' : language === 'es' ? 'Aventura en Montaña' : language === 'it' ? 'Avventura in Montagna' : 'Aventure en Montagne',
      price: 399,
      duration: language === 'en' ? '7 days' : language === 'es' ? '7 días' : language === 'it' ? '7 giorni' : '7 jours',
      image: 'https://cdn.poehali.dev/projects/fe462799-d6c5-4fb5-9c99-e66e6172322d/files/8a0edecc-eb74-4306-95a2-ea40347f3a63.jpg',
    },
  ];

  const cars = [
    {
      id: '3',
      title: language === 'en' ? 'Luxury Convertible' : language === 'es' ? 'Convertible de Lujo' : language === 'it' ? 'Cabriolet di Lusso' : 'Cabriolet de Luxe',
      price: 150,
      image: 'https://cdn.poehali.dev/projects/fe462799-d6c5-4fb5-9c99-e66e6172322d/files/cfb1ab8b-1b23-4648-9f39-ba38b589749c.jpg',
    },
    {
      id: '4',
      title: language === 'en' ? 'SUV 4x4' : language === 'es' ? 'SUV 4x4' : language === 'it' ? 'SUV 4x4' : 'SUV 4x4',
      price: 90,
      image: 'https://cdn.poehali.dev/projects/fe462799-d6c5-4fb5-9c99-e66e6172322d/files/cfb1ab8b-1b23-4648-9f39-ba38b589749c.jpg',
    },
  ];

  const accommodations = [
    {
      id: '5',
      title: language === 'en' ? 'Downtown Apartment' : language === 'es' ? 'Apartamento Centro' : language === 'it' ? 'Appartamento Centro' : 'Appartement Centre-Ville',
      price: 120,
      image: 'https://cdn.poehali.dev/projects/fe462799-d6c5-4fb5-9c99-e66e6172322d/files/d7744341-c1bd-474f-905b-7f73c4c1d4ce.jpg',
    },
    {
      id: '6',
      title: language === 'en' ? 'Beachfront Villa' : language === 'es' ? 'Villa Frente al Mar' : language === 'it' ? 'Villa sul Mare' : 'Villa en Bord de Mer',
      price: 250,
      image: 'https://cdn.poehali.dev/projects/fe462799-d6c5-4fb5-9c99-e66e6172322d/files/d7744341-c1bd-474f-905b-7f73c4c1d4ce.jpg',
    },
  ];

  const addToCart = (item: { id: string; title: string; price: number; image: string }, type: 'tour' | 'car' | 'accommodation') => {
    setCart([...cart, { ...item, type }]);
    toast.success(language === 'en' ? 'Added to cart!' : language === 'es' ? '¡Agregado al carrito!' : language === 'it' ? 'Aggiunto al carrello!' : 'Ajouté au panier!');
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error(t.cart.empty);
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(false);
    setShowConfirmation(true);
  };

  const handlePaymentConfirm = () => {
    toast.success(language === 'en' ? 'Order confirmed! We will contact you shortly.' : language === 'es' ? '¡Pedido confirmado! Te contactaremos pronto.' : language === 'it' ? 'Ordine confermato! Ti contatteremo presto.' : 'Commande confirmée! Nous vous contacterons bientôt.');
    setShowConfirmation(false);
    setCart([]);
    setPaymentData({ name: '', email: '', phone: '', notes: '' });
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Plane" size={28} className="text-primary" />
            <span className="text-2xl font-bold">TravelBook</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className="hover:text-primary transition-colors">{t.nav.home}</a>
            <a href="#tours" className="hover:text-primary transition-colors">{t.nav.tours}</a>
            <a href="#cars" className="hover:text-primary transition-colors">{t.nav.carsharing}</a>
            <a href="#accommodation" className="hover:text-primary transition-colors">{t.nav.accommodation}</a>
            <a href="#faq" className="hover:text-primary transition-colors">{t.nav.faq}</a>
          </div>

          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{t.cart.title}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">{t.cart.empty}</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4 flex gap-3">
                            <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-1">
                              <p className="font-semibold">{item.title}</p>
                              <p className="text-primary font-bold">${item.price}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                              <Icon name="Trash2" size={18} />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between mb-4">
                          <span className="font-bold">{t.cart.total}:</span>
                          <span className="font-bold text-xl text-primary">${totalPrice}</span>
                        </div>
                        <Button onClick={handleCheckout} className="w-full" size="lg">
                          <Icon name="CreditCard" size={20} className="mr-2" />
                          {t.cart.checkout}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${tours[0].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
          </div>
          <div className="relative z-10 text-center px-4 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>
            <Button size="lg" className="text-lg px-8 py-6 hover-scale">
              {t.hero.cta}
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        </section>

        <section id="tours" className="py-20 px-4 container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">{t.tours.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {tours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden hover-scale">
                <img src={tour.image} alt={tour.title} className="w-full h-64 object-cover" />
                <CardHeader>
                  <CardTitle className="text-2xl">{tour.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    {t.tours.duration}: {tour.duration}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t.tours.from}</p>
                    <p className="text-3xl font-bold text-primary">${tour.price}</p>
                  </div>
                  <Button onClick={() => addToCart(tour, 'tour')} size="lg">
                    {t.tours.addToCart}
                    <Icon name="Plus" size={18} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="cars" className="py-20 px-4 container mx-auto bg-muted/30">
          <h2 className="text-4xl font-bold mb-12 text-center">{t.carsharing.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {cars.map((car) => (
              <Card key={car.id} className="overflow-hidden hover-scale">
                <img src={car.image} alt={car.title} className="w-full h-64 object-cover" />
                <CardHeader>
                  <CardTitle className="text-2xl">{car.title}</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary">${car.price}</p>
                    <p className="text-sm text-muted-foreground">{t.carsharing.perDay}</p>
                  </div>
                  <Button onClick={() => addToCart(car, 'car')} size="lg">
                    {t.carsharing.addToCart}
                    <Icon name="Plus" size={18} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="accommodation" className="py-20 px-4 container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">{t.accommodation.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {accommodations.map((acc) => (
              <Card key={acc.id} className="overflow-hidden hover-scale">
                <img src={acc.image} alt={acc.title} className="w-full h-64 object-cover" />
                <CardHeader>
                  <CardTitle className="text-2xl">{acc.title}</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary">${acc.price}</p>
                    <p className="text-sm text-muted-foreground">{t.accommodation.perNight}</p>
                  </div>
                  <Button onClick={() => addToCart(acc, 'accommodation')} size="lg">
                    {t.accommodation.addToCart}
                    <Icon name="Plus" size={18} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="faq" className="py-20 px-4 container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-center">{t.faq.title}</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">{t.faq.q1}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{t.faq.a1}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">{t.faq.q2}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{t.faq.a2}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">{t.faq.q3}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{t.faq.a3}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">{t.faq.q4}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{t.faq.a4}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <footer className="bg-muted/50 py-12 px-4 mt-20">
          <div className="container mx-auto text-center">
            <div className="flex justify-center gap-2 mb-4">
              <Icon name="Plane" size={32} className="text-primary" />
              <span className="text-3xl font-bold">TravelBook</span>
            </div>
            <p className="text-muted-foreground mb-6">{t.hero.subtitle}</p>
            <div className="space-y-2">
              <p className="flex items-center justify-center gap-2">
                <Icon name="Mail" size={18} />
                {t.footer.email}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Icon name="Phone" size={18} />
                {t.footer.phone}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Icon name="MapPin" size={18} />
                {t.footer.address}
              </p>
            </div>
          </div>
        </footer>
      </main>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.payment.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t.payment.name}</Label>
              <Input
                id="name"
                value={paymentData.name}
                onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">{t.payment.email}</Label>
              <Input
                id="email"
                type="email"
                value={paymentData.email}
                onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">{t.payment.phone}</Label>
              <Input
                id="phone"
                type="tel"
                value={paymentData.phone}
                onChange={(e) => setPaymentData({ ...paymentData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">{t.payment.notes}</Label>
              <Textarea
                id="notes"
                value={paymentData.notes}
                onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {t.payment.submit}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.payment.confirmation}</DialogTitle>
            <DialogDescription>{t.payment.confirmMessage}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p><strong>{t.payment.name}:</strong> {paymentData.name}</p>
            <p><strong>{t.payment.email}:</strong> {paymentData.email}</p>
            <p><strong>{t.payment.phone}:</strong> {paymentData.phone}</p>
            <p><strong>{t.cart.total}:</strong> ${totalPrice}</p>
            {paymentData.notes && <p><strong>{t.payment.notes}:</strong> {paymentData.notes}</p>}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
              {t.payment.cancel}
            </Button>
            <Button onClick={handlePaymentConfirm} className="flex-1">
              {t.payment.confirmButton}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="rounded-full w-16 h-16 shadow-lg hover-scale">
          <Icon name="MessageCircle" size={28} />
        </Button>
      </div>
    </div>
  );
};

export default Index;
