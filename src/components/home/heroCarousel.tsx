import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop",
    title: "Timeless\nEssentials",
    subtitle: "Curated pieces crafted from the finest materials for everyday elegance.",
    cta: "Shop Collection",
    link: "/products",
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop",
    title: "New\nArrivals",
    subtitle: "Discover the latest additions to our carefully curated collection.",
    cta: "Explore Now",
    link: "/products?category=Clothing",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop",
    title: "Winter\nSale",
    subtitle: "Up to 40% off on selected premium items. Limited time only.",
    cta: "Shop Sale",
    link: "/products",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative h-[75vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-foreground/35" />

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight whitespace-pre-line">
                {slide.title}
              </h1>
              <p className="mt-4 text-primary-foreground/80 text-lg font-body">{slide.subtitle}</p>
              <Link to={slide.link}>
                <Button className="mt-6 px-8 py-6 text-sm font-semibold tracking-wide rounded-lg">
                  {slide.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm text-primary-foreground p-2 rounded-full hover:bg-background/40 transition-colors cursor-pointer ">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm text-primary-foreground p-2 rounded-full hover:bg-background/40 transition-colors cursor-pointer">
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/40"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
