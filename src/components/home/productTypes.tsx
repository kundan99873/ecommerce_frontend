import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import ProductCard from "../product/productCard";
import ProductCardSkeleton from "../product/productCardSkeleton";
import { motion } from "motion/react";
import type { Product } from "@/services/product/product.types";

export default function ProductTypes({
  title,
  products,
  loading,
}: {
  title: string;
  products: Product[];
  loading: boolean;
}) {
  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  return (
    <section className="container mx-auto px-2 py-8 sm:px-4">
      <div className="p-3 sm:p-6 md:p-10">
        <motion.div
          className="flex items-center justify-between mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Handpicked
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold mt-1">
              {title}
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-full border border-border/50 bg-primary/5 hover:bg-primary/10 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-border/70 active:scale-95 whitespace-nowrap"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {loading
            ? Array(4)
                .fill(undefined)
                .map((_, i) => <ProductCardSkeleton key={i} />)
            : products?.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
        </motion.div>
      </div>
    </section>
  );
}
