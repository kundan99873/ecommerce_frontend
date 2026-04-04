import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useGetCategory } from "@/services/category/category.query";
import type { Category } from "@/services/category/category.types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop";

const getCategoryInitial = (name: string) =>
  name.trim().charAt(0).toUpperCase();

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const CategoryNav = () => {
  const { data } = useGetCategory();

  const categoryData = data?.data ?? [];
  const featuredCategory = categoryData[0];
  const gridCategories = categoryData.slice(1, 5);
  const mobileCategories = categoryData;

  if (!featuredCategory) {
    return null;
  }

  const getCategoryImage = (category: Category) =>
    category.image_url || FALLBACK_IMAGE;

  return (
    <section className="container mx-auto px-2 py-8 sm:px-4 md:py-16 lg:py-20">
      <div className="relative overflow-hidden rounded-xl sm:rounded-[1.5rem] border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 p-3 sm:p-6 md:rounded-[2.5rem] md:p-8 lg:p-10">
        <div className="absolute -left-20 top-0 size-40 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-52 rounded-full bg-secondary/10 blur-3xl" />

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div
            className="flex flex-col gap-2 md:gap-4 md:flex-row md:items-center md:justify-between"
            variants={itemVariants}
          >
            <div className="max-w-2xl flex-1">
              <div className="mb-2 sm:mb-3 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-muted-foreground backdrop-blur-sm hover:bg-background/80 transition-colors">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Explore collections
              </div>
              <h2 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold font-display leading-tight">
                Shop by
                <br className="hidden sm:block" /> Category
              </h2>
              <p className="mt-1.5 sm:mt-2 max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                Discover our curated collection. Find exactly what you're
                looking for.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-full border border-border/50 bg-primary/5 hover:bg-primary/10 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-border/70 active:scale-95 whitespace-nowrap"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <div className="mt-4 sm:mt-5 md:hidden">
            <motion.div
              className="flex snap-x snap-mandatory gap-2 sm:gap-3 overflow-x-auto pb-2 pr-1 -mx-2 sm:-mx-4 px-2 sm:px-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              {mobileCategories.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  className="min-w-[45%] sm:min-w-[42%] snap-start"
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="group relative block aspect-square overflow-hidden rounded-lg sm:rounded-[1rem] border border-border/50 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
                  >
                    <img
                      src={getCategoryImage(cat)}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

                    <div className="absolute left-2 top-2 flex size-6 sm:size-7 items-center justify-center rounded-full bg-background/30 text-xs font-semibold text-primary-foreground backdrop-blur-md">
                      {getCategoryInitial(cat.name)}
                    </div>

                    {i === 0 && (
                      <div className="absolute right-2 top-2 rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-primary-foreground backdrop-blur-sm">
                        Featured
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5">
                      <div className="flex items-end justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-primary-foreground font-display truncate">
                            {cat.name}
                          </h3>
                          <p className="mt-0.5 text-[10px] sm:text-xs text-primary-foreground/70 truncate">
                            {cat.product_count} items
                          </p>
                        </div>

                        <div className="flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-primary-foreground backdrop-blur-md transition-all duration-300 group-hover:bg-white/20 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <p className="mt-1.5 text-[10px] sm:text-xs text-muted-foreground">
              Scroll to see more →
            </p>
          </div>

          <div className="mt-6 hidden gap-3 md:mt-7 md:grid md:gap-4 lg:gap-5 lg:grid-cols-[1.2fr_1fr]">
            <motion.div
              className="order-1 lg:order-0"
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
            >
              <Link
                to={`/products?category=${featuredCategory.slug}`}
                className="group relative flex min-h-72 md:min-h-80 lg:min-h-96 overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-muted to-muted/50 shadow-lg hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={getCategoryImage(featuredCategory)}
                  alt={featuredCategory.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/35 to-transparent" />
                <div className="absolute left-4 md:left-6 top-4 md:top-6 rounded-lg md:rounded-xl border border-white/20 bg-white/10 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-primary-foreground backdrop-blur-md">
                  ⭐ Featured
                </div>

                <div className="relative mt-auto w-full p-5 md:p-7 lg:p-8">
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex-1">
                      <span className="mb-2 md:mb-3 block text-[11px] md:text-xs uppercase tracking-widest text-primary-foreground/70 font-medium">
                        Most Popular
                      </span>
                      <h3 className="max-w-md text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground md:leading-tight font-display">
                        {featuredCategory.name}
                      </h3>
                      <p className="mt-2 md:mt-3 max-w-lg text-sm md:text-base leading-relaxed text-primary-foreground/80">
                        {featuredCategory.product_count} products · Start
                        exploring now
                      </p>
                    </div>

                    <div className="hidden h-14 w-14 lg:h-16 lg:w-16 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-primary-foreground backdrop-blur-md lg:flex transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                      <ArrowRight className="h-6 w-6 lg:h-7 lg:w-7" />
                    </div>
                  </div>

                  <div className="mt-4 md:mt-5 flex items-center gap-2 text-sm md:text-base font-semibold text-primary-foreground/90 group-hover:text-primary-foreground transition-colors">
                    <span>View Collection</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 auto-rows-fr">
              {gridCategories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    delay: (i + 1) * 0.08,
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                  }}
                >
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="group relative block h-full overflow-hidden rounded-xl sm:rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 hover:border-border/70 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
                  >
                    <img
                      src={getCategoryImage(cat)}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-125"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                    <div className="absolute left-3 sm:left-4 top-3 sm:top-4 flex size-8 sm:size-10 items-center justify-center rounded-lg sm:rounded-full bg-background/40 text-xs sm:text-sm font-bold text-primary-foreground backdrop-blur-sm transition-colors group-hover:bg-background/50">
                      {getCategoryInitial(cat.name)}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <div className="flex items-end justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-primary-foreground font-display leading-tight truncate">
                            {cat.name}
                          </h3>
                          <p className="mt-1 text-[10px] sm:text-xs text-primary-foreground/70 truncate">
                            {cat.product_count} items
                          </p>
                        </div>

                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-full bg-white/15 text-primary-foreground backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryNav;
