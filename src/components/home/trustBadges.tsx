import { Shield, Truck, RotateCcw, CreditCard } from "lucide-react";

const badges = [
  { icon: Shield, label: "Secure Payment", desc: "256-bit SSL encryption" },
  { icon: Truck, label: "Fast Delivery", desc: "Free shipping $100+" },
  { icon: RotateCcw, label: "Easy Returns", desc: "30-day return policy" },
  { icon: CreditCard, label: "Safe Checkout", desc: "Multiple payment options" },
];

const TrustBadges = () => (
  <section className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map(({ icon: Icon, label, desc }) => (
        <div key={label} className="flex flex-col items-center text-center p-4 bg-card border rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default TrustBadges;
