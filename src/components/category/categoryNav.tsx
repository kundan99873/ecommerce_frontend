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
    <section className="container mx-auto px-4 py-10 md:py-20">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-border/60 bg-linear-to-br from-background via-background to-muted/30 p-3 md:rounded-[2rem] md:p-8">
        <div className="absolute -left-12 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div
            className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-end md:justify-between"
            variants={itemVariants}
          >
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Explore collections
              </div>
              <h2 className="text-xl font-bold md:text-4xl font-display">
                Shop by Category
              </h2>
              <p className="mt-1 max-w-xl text-xs text-muted-foreground md:mt-2 md:text-base">
                Discover curated categories with a cleaner layout and faster
                visual browsing.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-background/90 px-3 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 hover:gap-3 md:px-4 md:py-2 md:text-sm"
            >
              Browse All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="mt-5 md:hidden">
            <motion.div
              className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 pr-1"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              {mobileCategories.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  className="min-w-[70%] snap-start"
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="group relative block aspect-[4/4.2] overflow-hidden rounded-[1.1rem] border border-border/70 bg-card shadow-sm"
                  >
                    <img
                      src={getCategoryImage(cat)}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-foreground/75 via-foreground/20 to-transparent" />

                    <div className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/20 text-xs font-semibold text-primary-foreground backdrop-blur-md">
                      {getCategoryInitial(cat.name)}
                    </div>

                    {i === 0 && (
                      <div className="absolute right-2.5 top-2.5 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-primary-foreground backdrop-blur-sm">
                        Featured
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-2.5">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <h3 className="text-xs font-bold text-primary-foreground font-display">
                            {cat.name}
                          </h3>
                          <p className="mt-0.5 text-[11px] text-primary-foreground/70">
                            {cat.product_count} products
                          </p>
                        </div>

                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background/15 text-primary-foreground backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Swipe to explore all categories
            </p>
          </div>

          <div className="mt-6 hidden gap-3 md:mt-8 md:grid md:gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              className="order-1 lg:order-0"
              variants={itemVariants}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
            >
              <Link
                to={`/products?category=${featuredCategory.slug}`}
                className="group relative flex min-h-14rem overflow-hidden rounded-1.25rem bg-muted shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:min-h-30rem md:rounded-[1.75rem]"
              >
                <img
                  src={getCategoryImage(featuredCategory)}
                  alt={featuredCategory.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/30 to-transparent" />
                <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-primary-foreground backdrop-blur-md md:left-6 md:top-6 md:px-3 md:text-xs">
                  Featured category
                </div>

                <div className="relative mt-auto w-full p-3 md:p-7">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <span className="mb-1 block text-[10px] uppercase tracking-[0.24em] text-primary-foreground/70 md:mb-2 md:text-xs md:tracking-[0.3em]">
                        Most explored
                      </span>
                      <h3 className="max-w-md text-xl font-bold text-primary-foreground md:text-5xl font-display">
                        {featuredCategory.name}
                      </h3>
                      <p className="mt-1 max-w-lg text-xs leading-5 text-primary-foreground/75 md:mt-3 md:text-base md:leading-6">
                        {featuredCategory.product_count} products ready to open
                        with a single click.
                      </p>
                    </div>

                    <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-primary-foreground backdrop-blur-md md:flex">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-primary-foreground/90 md:mt-5 md:text-sm">
                    <span>Explore collection</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 gap-2.5 md:gap-4 sm:grid-cols-2">
              {gridCategories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
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
                    className="group relative block aspect-[4/4.2] overflow-hidden rounded-[1.1rem] border border-border/70 bg-card shadow-sm md:rounded-[1.5rem] sm:aspect-4/3"
                  >
                    <img
                      src={getCategoryImage(cat)}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-foreground/75 via-foreground/20 to-transparent" />

                    <div className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/20 text-xs font-semibold text-primary-foreground backdrop-blur-md md:left-4 md:top-4 md:h-10 md:w-10 md:text-sm">
                      {getCategoryInitial(cat.name)}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-2.5 md:p-4">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <h3 className="text-xs font-bold text-primary-foreground md:text-base font-display">
                            {cat.name}
                          </h3>
                          <p className="mt-0.5 text-[11px] text-primary-foreground/70 md:mt-1 md:text-xs">
                            {cat.product_count} products
                          </p>
                        </div>

                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background/15 text-primary-foreground opacity-100 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:h-9 md:w-9">
                          <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
