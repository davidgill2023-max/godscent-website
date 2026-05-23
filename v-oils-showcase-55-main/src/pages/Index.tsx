import emailjs from "@emailjs/browser";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Instagram, ShoppingBag, X, Plus, Minus, Shield, RotateCcw, Lock, Upload, CheckCircle } from "lucide-react";
import logo from "@/assets/godscent-logo.png";
import heroBottle from "@/assets/hero-bottle.jpg";
import collection from "@/assets/collection.jpg";
import craft from "@/assets/craft.jpg";
import oilBaccarat from "@/assets/oil-baccarat.png";
import oilOud from "@/assets/oil-oud.png";
import oilBond from "@/assets/oil-bond.png";
import oilDreamsickle from "@/assets/oil-dreamsickle.png";
import review1 from "@/assets/review-1.jpg";
import review2 from "@/assets/review-2.jpg";
import review3 from "@/assets/review-3.jpg";
import zelleQr from "@/assets/zelle-qr.jpg";
 
// Init EmailJS ONCE at module level
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const SERVICE_ID           = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const ADMIN_TEMPLATE_ID    = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE as string;
const CUSTOMER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE as string;
const CONTACT_TEMPLATE_ID  = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE as string;
const PUBLIC_KEY           = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

console.log("📍 Environment Variables:");
console.log("SERVICE_ID:", SERVICE_ID);
console.log("PUBLIC_KEY:", PUBLIC_KEY);
console.log("ADMIN_TEMPLATE_ID:", ADMIN_TEMPLATE_ID);
console.log("CUSTOMER_TEMPLATE_ID:", CUSTOMER_TEMPLATE_ID);
 
const products = [
  { no: "N 01", name: "Baccarat",     notes: "A bold crimson signature — saffron, ambergris, and smoked cedar wrapped in red velvet warmth.",    price: 25, image: oilBaccarat   },
  { no: "N 02", name: "Oud",          notes: "Liquid gold — aged agarwood, honeyed amber, and a whisper of resin for nights that linger.",        price: 25, image: oilOud        },
  { no: "N 03", name: "Bond",         notes: "Cool, composed, unmistakable — blue iris, sea salt, and crisp bergamot tied with a clean musk.",   price: 25, image: oilBond       },
  { no: "N 04", name: "Dream Sickle", notes: "Sun-warmed peach, vanilla cream, and soft mandarin — a nostalgic, golden-hour daydream.",           price: 25, image: oilDreamsickle},
];
 
const PaymentIcons: Record<string, React.FC<{ active: boolean }>> = {
  "PayPal": ({ active }) => (
    <svg viewBox="0 0 60 32" fill="none" className="h-7 w-auto mx-auto">
      <path d="M24 8h8c4 0 6 2 5.5 6C36.5 19 33 21 29 21h-2l-1.5 7H20L24 8z" fill={active ? "hsl(var(--amber))" : "currentColor"} fillOpacity={active ? 0.7 : 0.3} />
      <path d="M29 10h7c3.5 0 5.5 1.8 5 5.5C40 21 37 23 33 23h-2l-1.5 6H24l1-5h3c4 0 7.5-2 8.5-7 .7-3.5-1-5-4-5h-1l-1 3z" fill={active ? "hsl(var(--amber))" : "currentColor"} fillOpacity={active ? 0.4 : 0.15} />
    </svg>
  ),
  "Zelle": ({ active }) => (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-auto mx-auto">
      <path d="M6 8h20l-16 16h16" stroke={active ? "hsl(var(--amber))" : "currentColor"} strokeOpacity={active ? 1 : 0.55} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Cash App": ({ active }) => (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-auto mx-auto">
      <text x="50%" y="23" textAnchor="middle" fontFamily="Georgia, serif" fontSize="24" fontWeight="700" fill={active ? "hsl(var(--amber))" : "currentColor"} fillOpacity={active ? 1 : 0.5}>$</text>
    </svg>
  ),
};
const PAYMENT_METHODS = Object.keys(PaymentIcons);
 
type PolicyType = "terms" | "returns" | "privacy" | null;
 
const PolicyModal = ({ type, onClose }: { type: PolicyType; onClose: () => void }) => {
  if (!type) return null;
  const content: Record<NonNullable<PolicyType>, { title: string; body: React.ReactNode }> = {
    terms: {
      title: "Terms of Service",
      body: (
        <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
          <p>By placing an order with God Scent, you agree to the following terms:</p>
          <p><strong className="text-foreground">Orders and Payment.</strong> All orders are subject to product availability. We reserve the right to refuse or cancel orders at our discretion. Payment is due at time of purchase. Prices are listed in USD.</p>
          <p><strong className="text-foreground">Age Requirement.</strong> You must be 18 years or older to make a purchase.</p>
          <p><strong className="text-foreground">Product Use.</strong> Our oils are handcrafted botanical products. Perform a patch test before use. Discontinue use if irritation occurs. Not intended to diagnose, treat, cure, or prevent any condition.</p>
          <p><strong className="text-foreground">Shipping.</strong> We aim to ship within 3-5 business days. Delivery times vary. We are not responsible for delays caused by carriers or customs.</p>
          <p><strong className="text-foreground">Intellectual Property.</strong> All content on this site is the exclusive property of God Scent and may not be reproduced without written permission.</p>
          <p><strong className="text-foreground">Governing Law.</strong> These terms are governed by the laws of the State of New York, USA.</p>
          <p className="italic">Last updated: {new Date().getFullYear()}</p>
        </div>
      ),
    },
    returns: {
      title: "Return and Refund Policy",
      body: (
        <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
          <p>Because our oils are handcrafted in small batches and applied to skin, we take returns on a case-by-case basis.</p>
          <p><strong className="text-foreground">Eligibility.</strong> We accept return requests within 14 days of delivery. Items must be unused, in original packaging, and accompanied by proof of purchase.</p>
          <p><strong className="text-foreground">Non-returnable Items.</strong> Opened or used oils, sale items, and gift cards cannot be returned for hygiene and safety reasons.</p>
          <p><strong className="text-foreground">Damaged or Defective Items.</strong> If your order arrives damaged, please contact us within 48 hours with photos. We will replace or refund at no cost to you.</p>
          <p><strong className="text-foreground">Process.</strong> Email godscentoils99@gmail.com with your order number and reason. We will respond within two business days with next steps.</p>
          <p><strong className="text-foreground">Shipping Costs.</strong> Return shipping is the customer's responsibility unless the item is defective or we made an error.</p>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
          <p>Your privacy matters to us. Here is how we handle your data.</p>
          <p><strong className="text-foreground">Information We Collect.</strong> We collect your name, email address, shipping address, and payment information when you place an order.</p>
          <p><strong className="text-foreground">How We Use It.</strong> Your data is used to process and fulfil orders, send shipping confirmations, and respond to inquiries.</p>
          <p><strong className="text-foreground">Third Parties.</strong> We do not sell or rent your personal information. We may share data with trusted service providers solely to operate our business.</p>
          <p><strong className="text-foreground">Data Retention.</strong> Order records are retained for up to 7 years as required by law. You may request deletion of your data by emailing godscentoils99@gmail.com.</p>
          <p><strong className="text-foreground">Cookies.</strong> We use minimal, necessary cookies. No advertising cookies are used.</p>
          <p><strong className="text-foreground">Your Rights.</strong> Contact us at godscentoils99@gmail.com to access, correct, or delete your data.</p>
          <p className="italic">Last updated: {new Date().getFullYear()}</p>
        </div>
      ),
    },
  };
  const { title, body } = content[type];
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-background border border-border shadow-elegant max-h-[80vh] overflow-y-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 border-b border-border sticky top-0 bg-background">
          <h4 className="font-serif text-2xl">{title}</h4>
          <button onClick={onClose} className="text-stone-700 hover:text-amber transition-colors ml-4 mt-1"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">{body}</div>
      </div>
    </div>
  );
};
 
type CartItem = { name: string; price: number; qty: number; image: string };
type OrderData = { customerEmail: string; customerName: string; address: string; city: string; zip: string; country: string; items: CartItem[]; total: number; paymentMethod: string; };
 
async function sendOrderEmails(orderData: OrderData) {
  const itemsList = orderData.items.map((i) => `${i.name} x${i.qty}  -  $${(i.price * i.qty).toFixed(2)}`).join("\n");
  const params = {
    customer_name:  orderData.customerName,
    customer_email: orderData.customerEmail,
    items:          itemsList,
    total:          `$${orderData.total.toFixed(2)}`,
    payment_method: orderData.paymentMethod,
    address:        `${orderData.address}, ${orderData.city} ${orderData.zip}, ${orderData.country}`,
  };
  console.log("📧 Sending admin email with params:", params);
  console.log("📧 Using Service ID:", SERVICE_ID, "Template ID:", ADMIN_TEMPLATE_ID, "Public Key:", PUBLIC_KEY);
  try {
    await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID,    { ...params, to_email: "godscentoils99@gmail.com" }, PUBLIC_KEY);
    console.log("✅ Admin email sent successfully");
  } catch (err) {
    console.error("❌ Admin email failed:", err);
    throw err;
  }
  try {
    await emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, { ...params, to_email: orderData.customerEmail },    PUBLIC_KEY);
    console.log("✅ Customer email sent successfully");
  } catch (err) {
    console.error("❌ Customer email failed:", err);
    throw err;
  }
}
 
async function sendContactEmail(name: string, email: string, message: string) {
  await emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, {
    from_name:  name,
    from_email: email,
    message:    message,
    to_email:   "godscentoils99@gmail.com",
  }, PUBLIC_KEY);
}
 
  const Index = () => {
  const [emailInput, setEmailInput]           = useState("");
  const [pendingOrder, setPendingOrder]       = useState<OrderData | null>(null);
  const [cart, setCart]                       = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen]               = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("PayPal");
  const [policyModal, setPolicyModal]         = useState<PolicyType>(null);
  const [agreements, setAgreements]           = useState({ terms: false, returns: false, privacy: false });
  const [processing, setProcessing]           = useState(false);
  const [zelleOpen, setZelleOpen]             = useState(false);
  const [zelleStep, setZelleStep]             = useState<"instructions"|"upload"|"confirmed">("instructions");
  const [zelleScreenshot, setZelleScreenshot] = useState<string | null>(null);
  const [zelleRef, setZelleRef]               = useState("");
  const zelleFileRef                          = useRef<HTMLInputElement>(null);
  const [paymentConfirmOpen, setPaymentConfirmOpen] = useState(false);
  const [awaitingPayment, setAwaitingPayment] = useState(false);
 
  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [cartOpen]);
 
  const addToCart = (p: typeof products[number]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === p.name);
      if (existing) return prev.map((i) => i.name === p.name ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { name: p.name, price: p.price, qty: 1, image: p.image }];
    });
    toast.success(`${p.name} added to cart`);
    setCartOpen(true);
  };
 
  const updateQty = (name: string, delta: number) =>
    setCart((prev) => prev.map((i) => i.name === name ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0));
 
  const removeFromCart = (name: string) => setCart((prev) => prev.filter((i) => i.name !== name));
 
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const allAgreed = agreements.terms && agreements.returns && agreements.privacy;
 
  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const form    = e.target as HTMLFormElement;
    const name    = (form.elements.namedItem("name")    as HTMLInputElement).value;
    const email   = (form.elements.namedItem("email")   as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
    try {
      await sendContactEmail(name, email, message);
      toast.success("Message received", { description: "We'll be in touch within two business days." });
      form.reset();
    } catch (err) {
      console.error("Contact email error:", err);
      toast.error("Couldn't send your message. Please email us directly at godscentoils99@gmail.com");
    }
  };
 
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    try {
      await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, {
        to_email: "godscentoils99@gmail.com", customer_name: "Newsletter subscriber",
        customer_email: emailInput, items: "---", total: "---", payment_method: "Newsletter signup", address: "---",
      }, PUBLIC_KEY);
    } catch { /* silent */ }
    toast.success("Welcome to the atelier", { description: "We'll write when the next batch is ready." });
    setEmailInput("");
  };
 
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) { toast.error("Your cart is empty."); return; }
    if (!allAgreed) { toast.error("Please agree to all policies before checking out."); return; }
 
    const form = e.target as HTMLFormElement;
    const get  = (n: string) => (form.elements.namedItem(n) as HTMLInputElement)?.value ?? "";
 
    const orderData: OrderData = {
      customerEmail: get("email"),   customerName: get("fullName"),
      address:       get("address"), city:         get("city"),
      zip:           get("zip"),     country:      get("country"),
      items: cart,   total: cartTotal, paymentMethod: selectedPayment,
    };
 
    setPendingOrder(orderData);
    setProcessing(true);
 
    if (selectedPayment === "Zelle") {
      setProcessing(false);
      setZelleStep("instructions");
      setZelleOpen(true);
      return;
    }
 
    setProcessing(false);

if (selectedPayment === "PayPal") {
window.open(
  `https://www.paypal.com/paypalme/VaShawnMarshall/${cartTotal}`,
  "_blank",
  "noopener,noreferrer"
);

  setAwaitingPayment(true);
  setPaymentConfirmOpen(true);

  return;
}

if (selectedPayment === "Cash App") {
 window.open(
  `https://cash.app/$GodscentOils/${cartTotal}`,
  "_blank",
  "noopener,noreferrer"
);

  setAwaitingPayment(true);
  setPaymentConfirmOpen(true);

  return;
  }
  };

  const handleExternalPaymentConfirmed = async () => {
  if (!pendingOrder) return;

  setProcessing(true);

  try {
    await sendOrderEmails(pendingOrder);

    toast.success("Order confirmed!", {
      description: "Your payment has been received and your order is now being prepared.",
    });

    setCart([]);
    setAgreements({
      terms: false,
      returns: false,
      privacy: false,
    });

    setPaymentConfirmOpen(false);
    setAwaitingPayment(false);
    setCartOpen(false);
  } catch (err) {
    console.error("Payment confirmation error:", err);

    toast.error(
      "We could not finalize your order automatically. Please contact godscentoils99@gmail.com."
    );
  }

  setProcessing(false);
};
 
  const handleZelleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file."); return; }
    const reader = new FileReader();
    reader.onload = () => setZelleScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  };
 
  const handleZelleConfirm = async () => {
    if (!zelleScreenshot) { toast.error("Please upload a screenshot of your Zelle payment."); return; }
    if (zelleRef.length < 4) { toast.error("Please enter the last 4 digits of the phone number used."); return; }
    if (!pendingOrder) return;
    setProcessing(true);
    try {
      const orderWithProof: OrderData = { ...pendingOrder, paymentMethod: `Zelle (Last 4 digits: ...${zelleRef}, Screenshot: UPLOADED & VERIFIED)` };
      await sendOrderEmails(orderWithProof);
      setZelleStep("confirmed");
      setCart([]);
      setAgreements({ terms: false, returns: false, privacy: false });
      toast.success("Payment verified! Order confirmation sent to your email.");
    } catch (err) {
      console.error("Zelle confirm error:", err);
      console.log("Full error object:", JSON.stringify(err, null, 2));
      toast.error("Email failed. Contact us at godscentoils99@gmail.com with your screenshot.");
    }
    setProcessing(false);
  };
 
  const closeZelle = () => {
    const wasConfirmed = zelleStep === "confirmed";
    setZelleOpen(false);
    setZelleStep("instructions");
    setZelleScreenshot(null);
    setZelleRef("");
    if (wasConfirmed) setCartOpen(false);
  };
 
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
 
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
        <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <img src={logo} alt="God Scent" className="h-32 w-auto" />
          </a>
          <ul className="hidden md:flex items-center gap-10 text-xs tracking-luxury uppercase">
            <li><a href="#collection"   className="hover:text-amber transition-colors">Collection</a></li>
            <li><a href="#craft"        className="hover:text-amber transition-colors">The Craft</a></li>
            <li><a href="#testimonials" className="hover:text-amber transition-colors">Reviews</a></li>
            <li><a href="#contact"      className="hover:text-amber transition-colors">Contact</a></li>
          </ul>
          <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 text-xs tracking-luxury uppercase hover:text-amber transition-colors" aria-label="Open cart">
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-amber-deep text-background text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-serif">{cartCount}</span>
            )}
          </button>
        </nav>
      </header>
 
      {/* HERO */}
      <section id="top" className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <p className="text-xs tracking-luxury uppercase text-stone-700 mb-8">Est. -- Small Batch - Handpoured</p>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] text-balance">
              Oils made<br /><em className="italic text-amber-deep">slowly,</em><br />by hand.
            </h1>
            <p className="mt-10 max-w-md text-lg text-stone-700 leading-relaxed">
              A quiet collection of botanical oils, distilled in small batches from a single kitchen table -- for a scent that's so enchanting, you would think it was sent by God.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Button asChild size="lg" className="rounded-none bg-foreground text-background hover:bg-amber-deep h-14 px-10 text-xs tracking-luxury uppercase">
                <a href="#collection">Discover the Collection</a>
              </Button>
              <a href="#craft" className="text-xs tracking-luxury uppercase border-b border-foreground pb-1 hover:border-amber hover:text-amber transition-colors">Read our story</a>
            </div>
          </div>
          <div className="lg:col-span-5 relative animate-fade-in">
            <div className="absolute -inset-8 bg-gradient-amber opacity-10 blur-3xl rounded-full" />
<img
  src={heroBottle}
  alt="God Scent signature amber bottle"
  className="relative w-full h-[560px] lg:h-[700px] object-cover rounded-2xl shadow-elegant"
  width={1080}
  height={1920}
/>
            <div className="absolute -left-6 top-12 hidden lg:block text-xs tracking-luxury uppercase text-stone-700 rotate-180" style={{ writingMode: "vertical-rl" }}>
              Pure - Botanical - Unhurried
            </div>
          </div>
        </div>
      </section>
 
      {/* MARQUEE */}
      <section className="border-y border-border/60 py-8 overflow-hidden bg-secondary/40">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 pr-16 font-serif italic text-2xl text-stone-700">
              <span>Cold-pressed</span><span>-</span><span>Wild harvested</span><span>-</span>
              <span>Single origin</span><span>-</span><span>Naturally fragrant</span><span>-</span>
              <span>Patiently made</span><span>-</span><span>Pure botanicals</span><span>-</span>
            </div>
          ))}
        </div>
      </section>
 
      {/* COLLECTION */}
      <section id="collection" className="py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8 mb-20">
            <div className="lg:col-span-4"><p className="text-xs tracking-luxury uppercase text-stone-700 mb-6">-- The Collection</p></div>
            <div className="lg:col-span-8">
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
                Newly featured. <em className="italic text-amber-deep">Each</em> a daily essential, bottled with intention.
              </h2>
            </div>

             {/* PRODUCT GRID */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((p) => (
              <article key={p.no} className="group transition-transform duration-500 hover:-translate-y-1">
                <div className="relative overflow-hidden bg-secondary/50 aspect-[4/5] mb-6">
<img
  src={p.image}
  alt={`${p.name} oil bottle`}
  className="
    absolute inset-0
    w-full h-full
    object-cover
    rounded-2xl
    transition-transform
    duration-700
    group-hover:scale-105
  "
  loading="lazy"
/>
                  <span className="absolute top-6 left-6 text-xs tracking-luxury uppercase text-cream drop-shadow-md">{p.no}</span>
                  <span className="absolute top-6 right-6 font-serif text-xl text-cream drop-shadow-md">${p.price}</span>
                </div>
                <h3 className="font-serif text-3xl mb-2">{p.name}</h3>
                <p className="text-sm text-stone-700 italic mb-5">{p.notes}</p>
                <Button onClick={() => addToCart(p)} className="w-full rounded-none bg-foreground text-background hover:bg-amber-deep h-12 text-xs tracking-luxury uppercase">
                  Add to Cart -- ${p.price}
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
 
      {/* CRAFT */}
      <section id="craft" className="py-32 lg:py-40 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
<img
  src={craft}
  alt="Hands pouring oil into a small glass bottle"
  className="w-full h-[620px] object-cover rounded-2xl shadow-elegant"
  loading="lazy"
  width={1080}
  height={1920}
/>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2">
            <p className="text-xs tracking-luxury uppercase text-stone-700 mb-8">-- The Craft</p>
            <h2 className="font-serif text-5xl md:text-6xl leading-[1.05] mb-10 text-balance">
              From kitchen <em className="italic text-amber-deep">to</em> bottle, in our own hands.
            </h2>
            <p className="text-stone-700 leading-relaxed mb-6 text-lg">
              Every God Scent oil begins in a single kitchen, with botanicals sourced from growers we know by name. We infuse, decant and bottle by hand -- no shortcuts, no fillers, no machines between us and you.
            </p>
            <p className="text-stone-700 leading-relaxed text-lg">
              Each batch is small enough to count by the dozen. What you receive today may not exist tomorrow -- and that is the point.
            </p>
            <div className="mt-14 grid grid-cols-3 gap-8 pt-10 border-t border-border">
              {[{ n: "100%", l: "Botanical" }, { n: "12", l: "Batches a year" }, { n: "0", l: "Synthetics" }].map((s) => (
                <div key={s.l}>
                  <div className="font-serif text-4xl text-amber-deep">{s.n}</div>
                  <div className="text-xs tracking-luxury uppercase text-stone-700 mt-2">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      {/* EDITORIAL */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative">
            <img src={collection} alt="The God Scent collection laid on warm linen" className="w-full h-[400px] md:h-[560px] object-cover" loading="lazy" width={1920} height={1080} />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-serif italic text-3xl md:text-5xl text-cream text-center px-8 max-w-3xl drop-shadow-lg">
                "A perfume oil should feel like a memory you haven't had yet."
              </p>
            </div>
          </div>
        </div>
      </section>
 
      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-32 lg:py-40 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8 mb-20">
            <div className="lg:col-span-4"><p className="text-xs tracking-luxury uppercase text-stone-700 mb-6">-- Kind Words</p></div>
            <div className="lg:col-span-8">
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
                What our <em className="italic text-amber-deep">people</em> are saying.
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Baccarat has become a small daily ritual. It smells like a memory I didn't know I had.",                                                   name: "Elena M.",  role: "Brooklyn, NY",       photo: review1 },
              { quote: "I stock God Scent in my apothecary and customers return for them again and again. Truly exceptional craft.",                               name: "Juno Hale", role: "Owner, House of Hale", photo: review2 },
              { quote: "Bond is the most honest fragrance I own. Nothing showy -- just quiet, warm, and entirely itself.",                                         name: "Marisol R.", role: "Lisbon, PT",          photo: review3 },
            ].map((t) => (
              <figure key={t.name} className="bg-background border border-border p-10 flex flex-col h-full">
                <div className="font-serif text-5xl text-amber-deep leading-none mb-6">"</div>
                <blockquote className="font-serif text-xl leading-relaxed text-foreground/90 flex-1 italic">{t.quote}</blockquote>
                <figcaption className="mt-8 pt-6 border-t border-border flex items-center gap-4">
                  <img src={t.photo} alt={t.name} className="h-14 w-14 rounded-full object-cover" loading="lazy" width={512} height={512} />
                  <div>
                    <div className="font-serif text-lg">{t.name}</div>
                    <div className="text-xs tracking-luxury uppercase text-stone-700 mt-1">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
 
      {/* CONTACT */}
      <section id="contact" className="py-32 lg:py-40">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs tracking-luxury uppercase text-stone-700 mb-6">-- Contact</p>
            <h2 className="font-serif text-5xl md:text-6xl leading-[1.05] mb-8 text-balance">Say <em className="italic text-amber-deep">hello.</em></h2>
                        <p className="text-stone-700 leading-relaxed mb-6">Questions about the collection, a custom order, or just want to write? We read every note.</p>
            <p className="font-serif text-lg">godscentoils99@gmail.com</p>
           </div>
 <div
  className="flex justify-center md:justify-end"
  style={{ marginTop: "6rem" }}
>
  <Button
    size="lg"
    variant="outline"
    className="px-8 py-6 text-base"
    onClick={() => {
      window.location.href =
        "mailto:godscentoils99@gmail.com?subject=God%20Scent%20Inquiry";
    }}
  >
    Send Message
  </Button>
</div>
        </div>
      </section>
 
      {/* FOOTER */}
      <footer className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-12 items-start">
         <div>
  <a href="#top">
    <img
      src={logo}
      alt="God Scent"
      className="h-24 w-auto mb-4 hover:opacity-80 transition-opacity"
    />
  </a>

  <p className="text-sm text-stone-700 italic max-w-xs">
    Handcrafted botanical oils, made slowly in small batches.
  </p>
</div>
          <div>
            <p className="text-xs tracking-luxury uppercase text-stone-700 mb-4">Follow</p>
            <ul className="space-y-2 font-serif text-lg">
              <li>
                <a href="https://instagram.com/_godscentoils" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-amber transition-colors">
                  <Instagram className="h-4 w-4" /> @_godscentoils
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-luxury uppercase text-stone-700 mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-stone-700">
              <li><button onClick={() => setPolicyModal("terms")}   className="hover:text-amber transition-colors text-left">Terms of Service</button></li>
              <li><button onClick={() => setPolicyModal("returns")} className="hover:text-amber transition-colors text-left">Return and Refund Policy</button></li>
              <li><button onClick={() => setPolicyModal("privacy")} className="hover:text-amber transition-colors text-left">Privacy Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-xs text-stone-700 tracking-wide">
          <p>2025 God Scent. All rights reserved.</p>
          <p className="italic font-serif">Made by hand - Bottled with care</p>
        </div>
      </footer>
 
      {/* CART / CHECKOUT */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-background animate-fade-in overflow-y-auto">
          <div className="fixed top-0 inset-x-0 z-10 flex items-center justify-between px-6 lg:px-12 h-16 bg-background/95 backdrop-blur border-b border-border">
            <h3 className="font-serif text-2xl">Your Cart</h3>
            <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="hover:text-amber transition-colors flex items-center gap-2 text-xs tracking-luxury uppercase">
              <X className="h-5 w-5" /> Close
            </button>
          </div>
          <div className="w-full max-w-6xl px-6 lg:px-12 pt-24 pb-16">
            {cart.length === 0 ? (
              <div className="flex items-center justify-center min-h-[60vh] text-center text-stone-700 italic font-serif text-2xl">Your cart is empty.</div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                <div>
                  <p className="text-xs tracking-luxury uppercase text-stone-700 mb-8">-- Your Selection</p>
                  <div className="space-y-8">
                    {cart.map((i) => (
                      <div key={i.name} className="flex gap-6 border-b border-border pb-8">
                        <img
  src={i.image}
  alt={i.name}
  className="
    h-24 w-24
    object-cover
    rounded-xl
    bg-secondary/50
    flex-shrink-0
  "
/>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-2xl">{i.name}</h4>
                            <button onClick={() => removeFromCart(i.name)} aria-label="Remove" className="text-stone-700 hover:text-foreground ml-4"><X className="h-4 w-4" /></button>
                          </div>
                          <p className="text-sm tracking-luxury uppercase text-stone-700 mt-1">${i.price} each</p>
                          <div className="mt-4 flex items-center gap-4">
                            <button onClick={() => updateQty(i.name, -1)} className="h-8 w-8 border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Minus className="h-3 w-3" /></button>
                            <span className="font-serif text-xl w-6 text-center">{i.qty}</span>
                            <button onClick={() => updateQty(i.name, 1)}  className="h-8 w-8 border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Plus className="h-3 w-3" /></button>
                            <span className="ml-auto font-serif text-xl text-amber-deep">${i.price * i.qty}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-border space-y-3">
                    <div className="flex justify-between text-sm text-stone-700"><span>Subtotal</span><span>${cartTotal}</span></div>
                    <div className="flex justify-between text-sm text-stone-700"><span>Shipping</span><span>Calculated at checkout</span></div>
                    <div className="flex justify-between font-serif text-2xl pt-3 border-t border-border"><span>Total</span><span className="text-amber-deep">${cartTotal}</span></div>
                  </div>
                </div>
 
                <form onSubmit={handleCheckout} className="space-y-6 lg:sticky lg:top-24">
                  <p className="text-xs tracking-luxury uppercase text-stone-700 mb-2">-- Checkout</p>
                  <div className="space-y-4">
                    <p className="text-xs tracking-luxury uppercase text-stone-700">Email</p>
                    <Input required name="email" type="email" placeholder="Email for receipt" className="rounded-none border-0 border-b border-border bg-transparent focus-visible:ring-0 focus-visible:border-amber px-0 h-12 text-base" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs tracking-luxury uppercase text-stone-700">Shipping</p>
                    <Input required name="fullName" placeholder="Full name"        className="rounded-none border-0 border-b border-border bg-transparent focus-visible:ring-0 focus-visible:border-amber px-0 h-12 text-base" />
                    <Input required name="address"  placeholder="Street address"   className="rounded-none border-0 border-b border-border bg-transparent focus-visible:ring-0 focus-visible:border-amber px-0 h-12 text-base" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input required name="city" placeholder="City"              className="rounded-none border-0 border-b border-border bg-transparent focus-visible:ring-0 focus-visible:border-amber px-0 h-12 text-base" />
                      <Input required name="zip"  placeholder="ZIP / Postal code" className="rounded-none border-0 border-b border-border bg-transparent focus-visible:ring-0 focus-visible:border-amber px-0 h-12 text-base" />
                    </div>
                    <Input required name="country" placeholder="Country"          className="rounded-none border-0 border-b border-border bg-transparent focus-visible:ring-0 focus-visible:border-amber px-0 h-12 text-base" />
                  </div>
 
                  <div className="space-y-3">
                    <p className="text-xs tracking-luxury uppercase text-stone-700">Pay with</p>
                    <div className="grid grid-cols-3 gap-2">
                      {PAYMENT_METHODS.map((m) => {
                        const Icon = PaymentIcons[m];
                        const active = selectedPayment === m;
                        return (
                          <button type="button" key={m} onClick={() => setSelectedPayment(m)}
                            className={["flex flex-col items-center justify-center gap-1.5 border h-16 px-1 transition-all duration-200 text-[10px] tracking-wide uppercase",
                              active ? "border-amber bg-amber/5 text-amber" : "border-border text-stone-700 hover:border-amber/50 hover:text-foreground hover:bg-secondary/60"].join(" ")}
                            style={active ? { boxShadow: "inset 0 0 0 1px hsl(var(--amber) / 0.3)" } : {}} aria-pressed={active}>
                            <Icon active={active} />
                            <span className="leading-none">{m}</span>
                          </button>
                        );
                      })}
                      <div className="space-y-4">

  <Button>
    Pay with PayPal
  </Button>

  <Button>
    Pay with Cash App
  </Button>

  <p className="text-xs text-stone-600 mt-3 text-center leading-relaxed">
  Some browsers or ad blockers may prevent payment windows from opening automatically.
</p>

</div>
                    </div>
                  </div>
 
                  {selectedPayment === "PayPal" && (
                    <div className="bg-secondary/40 border border-amber/20 p-5 space-y-2">
                      <p className="text-xs tracking-luxury uppercase text-stone-700">PayPal Instructions</p>
                      <p className="font-serif text-base">Send <span className="text-amber-deep font-semibold">${cartTotal}</span> to <span className="font-semibold">VaShawn Marshall</span> (vmgill2022@gmail.com).</p>
                      <p className="text-xs text-stone-700">You will be redirected to PayPal after checkout. Include your name in the payment note.</p>
                    </div>
                  )}
                  {selectedPayment === "Zelle" && (
                    <div className="bg-secondary/40 border border-amber/20 p-5 space-y-2">
                      <p className="text-xs tracking-luxury uppercase text-stone-700">Zelle Instructions</p>
                      <p className="font-serif text-base">Send <span className="text-amber-deep font-semibold">${cartTotal}</span> to <span className="font-semibold">VaShawn Marshall</span> via Zelle.</p>
                      <p className="text-xs text-stone-700">Phone: (202) 246-4685</p>
                      <p className="text-xs text-stone-700">After clicking checkout, you will upload a screenshot of your completed Zelle payment as proof. Your order is confirmed once we verify it.</p>
                    </div>
                  )}
                  {selectedPayment === "Cash App" && (
                    <div className="bg-secondary/40 border border-amber/20 p-5 space-y-2">
                      <p className="text-xs tracking-luxury uppercase text-stone-700">Cash App Instructions</p>
                      <p className="font-serif text-base">Send <span className="text-amber-deep font-semibold">${cartTotal}</span> to <span className="font-semibold">$GodscentOils</span> on Cash App.</p>
                      <p className="text-xs text-stone-700">You will be redirected to Cash App after checkout. Include your name in the payment note.</p>
                    </div>
                  )}
 
                  <div className="space-y-3 pt-2 border-t border-border/60">
                    <p className="text-xs tracking-luxury uppercase text-stone-700">Before you buy</p>
                    {([
                      { key: "terms"   as const, label: "I agree to the",                              link: "Terms of Service",       modal: "terms"   as PolicyType },
                      { key: "returns" as const, label: "I have read the",                             link: "Return and Refund Policy", modal: "returns" as PolicyType },
                      { key: "privacy" as const, label: "I understand how my data is handled per the", link: "Privacy Policy",         modal: "privacy" as PolicyType },
                    ]).map(({ key, label, link, modal }) => (
                      <label key={key} className="flex items-start gap-3 cursor-pointer group">
                        <div className="mt-0.5 relative flex-shrink-0">
                          <input type="checkbox" className="sr-only" checked={agreements[key]} onChange={(e) => setAgreements((a) => ({ ...a, [key]: e.target.checked }))} />
                          <div className={["h-4 w-4 border transition-colors flex items-center justify-center",
                            agreements[key] ? "border-amber bg-amber/10" : "border-border group-hover:border-amber/50"].join(" ")}>
                            {agreements[key] && (
                              <svg viewBox="0 0 10 8" className="h-2.5 w-2.5" fill="none">
                                <path d="M1 4l3 3 5-6" stroke="hsl(var(--amber))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-stone-700 leading-relaxed">
                          {label}{" "}
                          <button type="button" onClick={() => setPolicyModal(modal)} className="underline underline-offset-2 hover:text-amber transition-colors">{link}</button>
                        </span>
                      </label>
                    ))}
                  </div>
 
                  <Button type="submit" disabled={!allAgreed || processing || cart.length === 0}
                    className={["w-full rounded-none h-14 text-sm tracking-luxury uppercase transition-all",
                      allAgreed ? "bg-foreground text-background hover:bg-amber-deep" : "bg-foreground/30 text-background/50 cursor-not-allowed"].join(" ")}>
                    {processing ? "Processing..." : `Complete Checkout -- $${cartTotal}`}
                  </Button>
 
                  <div className="flex items-center justify-center gap-8 pt-1">
                    <span className="flex items-center gap-1.5 text-[11px] text-stone-700 tracking-wide"><Lock className="h-3 w-3" /> SSL Secured</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-stone-700 tracking-wide"><Shield className="h-3 w-3" /> Secure Checkout</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-stone-700 tracking-wide"><RotateCcw className="h-3 w-3" /> 14-Day Returns</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
 
      {/* ZELLE 3-STEP PROOF MODAL */}
      {zelleOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
          <div className="relative bg-background border border-border shadow-elegant w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
 
            {zelleStep === "instructions" && (
              <div className="p-8 space-y-5 text-center">
                <button onClick={closeZelle} className="absolute top-4 right-4 text-stone-700 hover:text-amber"><X className="h-5 w-5" /></button>
                <p className="text-xs tracking-luxury uppercase text-stone-700">-- Zelle Payment</p>
                <h4 className="font-serif text-2xl">Send your payment</h4>
                <div className="flex justify-center">
                  <div className="border border-border p-3 bg-background inline-block">
                    <img src={zelleQr} alt="Zelle QR Code" className="w-44 h-44 object-contain" />
                  </div>
                </div>
                <p className="font-serif text-lg">Send <span className="text-amber-deep font-semibold">${pendingOrder?.total ?? cartTotal}</span> to <strong>VaShawn Marshall</strong></p>
                <p className="text-xs text-stone-700 leading-relaxed">Open your banking app, scan the QR code above or search VaShawn Marshall in Zelle, and complete the payment. Then click below.</p>
                <Button onClick={() => setZelleStep("upload")} className="w-full rounded-none bg-foreground text-background hover:bg-amber-deep h-12 text-xs tracking-luxury uppercase">
                  I have sent the payment
                </Button>
              </div>
            )}
 
            {zelleStep === "upload" && (
              <div className="p-8 space-y-5">
                <button onClick={closeZelle} className="absolute top-4 right-4 text-stone-700 hover:text-amber"><X className="h-5 w-5" /></button>
                <p className="text-xs tracking-luxury uppercase text-stone-700 text-center">-- Confirm Payment</p>
                <h4 className="font-serif text-2xl text-center">Upload proof of payment</h4>
                <p className="text-sm text-stone-700 text-center leading-relaxed">
                  Take a screenshot of your Zelle confirmation screen showing the payment went through. Upload it here so we can verify and ship your order.
                </p>
                <div className="border-2 border-dashed border-border hover:border-amber/50 transition-colors p-6 text-center cursor-pointer rounded-sm"
                  onClick={() => zelleFileRef.current?.click()}>
                  <input ref={zelleFileRef} type="file" accept="image/*" className="sr-only" onChange={handleZelleFileChange} />
                  {zelleScreenshot ? (
                    <div className="space-y-2">
                      <img src={zelleScreenshot} alt="Payment screenshot" className="max-h-40 mx-auto object-contain" />
                      <p className="text-xs text-amber-deep">Screenshot uploaded. Click to change.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-stone-700" />
                      <p className="text-sm text-stone-700">Click to upload your Zelle screenshot</p>
                      <p className="text-xs text-stone-700">PNG or JPG</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs tracking-luxury uppercase text-stone-700 block">Last 4 digits of phone number used for Zelle</label>
                  <Input placeholder="e.g. 4821" maxLength={4} inputMode="numeric" value={zelleRef}
                    onChange={(e) => setZelleRef(e.target.value.replace(/\D/g, ""))}
                    className="rounded-none border-0 border-b border-border bg-transparent focus-visible:ring-0 focus-visible:border-amber px-0 h-12 text-base tracking-widest" />
                  <p className="text-xs text-stone-700">This helps us match your Zelle payment to your order.</p>
                </div>
                <Button onClick={handleZelleConfirm} disabled={processing || !zelleScreenshot || zelleRef.length < 4}
                  className="w-full rounded-none bg-foreground text-background hover:bg-amber-deep h-12 text-xs tracking-luxury uppercase disabled:opacity-50">
                  {processing ? "Confirming..." : "Confirm and Complete Order"}
                </Button>
              </div>
            )}
 
            {zelleStep === "confirmed" && (
              <div className="p-8 space-y-4 text-center">
                <CheckCircle className="h-14 w-14 mx-auto text-amber-deep" />
                <h4 className="font-serif text-2xl">Order Confirmed!</h4>
                <p className="text-stone-700 text-sm leading-relaxed">
                  Thank you. We have received your payment screenshot and sent an order confirmation to your email. Your oils will ship within 3-5 business days.
                </p>
                <Button onClick={closeZelle} className="w-full rounded-none bg-foreground text-background hover:bg-amber-deep h-12 text-xs tracking-luxury uppercase">Done</Button>
              </div>
            )}
          </div>
        </div>
      )}
 {paymentConfirmOpen && (
  <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />

    <div
      className="relative bg-background border border-border shadow-elegant w-full max-w-md animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-8 space-y-5 text-center">

        <button
          onClick={() => setPaymentConfirmOpen(false)}
          className="absolute top-4 right-4 text-stone-700 hover:text-amber"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs tracking-luxury uppercase text-stone-700">
          -- Complete Payment
        </p>

        <h4 className="font-serif text-2xl">
          Finalize your order
        </h4>

        <p className="text-sm text-stone-700 leading-relaxed">
          Complete your payment in the opened app or tab.
          Once your payment has been submitted,
          return here to finalize your order.
        </p>

        <div className="bg-secondary/40 border border-border p-4 text-left">
          <p className="text-xs tracking-luxury uppercase text-stone-700 mb-2">
            Payment Method
          </p>

          <p className="font-serif text-lg">
            {selectedPayment}
          </p>

          <p className="mt-2 text-sm text-stone-700">
            Total: ${cartTotal}
          </p>
        </div>

        <div className="space-y-3 pt-2">

          <Button
            onClick={handleExternalPaymentConfirmed}
            disabled={processing}
            className="w-full rounded-none bg-foreground text-background hover:bg-amber-deep h-12 text-xs tracking-luxury uppercase"
          >
            {processing
              ? "Confirming..."
              : "Payment Sent"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              
              setPaymentConfirmOpen(false);

              toast.message(
                "No problem — you can return and confirm your payment whenever you're ready."
              );
            }}
            className="w-full rounded-none h-12 text-xs tracking-luxury uppercase"
          >
            Not Yet
          </Button>

        </div>
      </div>
    </div>
  </div>
)}
      <PolicyModal type={policyModal} onClose={() => setPolicyModal(null)} />
    </div>
  );
};
 
export default Index;

