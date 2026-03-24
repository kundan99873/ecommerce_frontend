import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useGetCategory } from "@/services/category/category.query";
import type { Category } from "@/services/category/category.types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop";

const getCategoryInitial = (name: string) =>
  name.trim().charAt(0).toUpperCase();

const CategoryNav = () => {
  const { data } = useGetCategory();

  const categoryData = data?.data ?? [];
  const featuredCategory = categoryData[0];
  const gridCategories = categoryData.slice(1, 5);

  if (!featuredCategory) {
    return null;
  }

  const getCategoryImage = (category: Category) =>
    category.image_url || FALLBACK_IMAGE;

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        className="flex items-center justify-between mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Find what you're looking for
          </p>
        </div>
        <Link
          to="/products"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Browse All <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {/* Featured large category + grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Large featured card */}
        <motion.div
          className="md:col-span-5 md:row-span-2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Link
            to={`/products?category=${featuredCategory.slug}`}
            className="group block relative h-full min-h-80 overflow-hidden rounded-2xl"
          >
            <img
              src={getCategoryImage(featuredCategory)}
              alt={featuredCategory.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-3xl mb-2 block text-primary-foreground/90">
                {getCategoryInitial(featuredCategory.name)}
              </span>
              <h3 className="text-primary-foreground font-display font-bold text-2xl">
                {featuredCategory.name}
              </h3>
              <p className="text-primary-foreground/70 text-sm mt-1">
                {featuredCategory.product_count} products
              </p>
              <span className="inline-flex items-center gap-1 text-primary-foreground text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* 4 smaller cards in 2x2 grid */}
        {gridCategories.map((cat, i) => (
          <motion.div
            key={cat.name}
            className="md:col-span-3.5 md:col-span-3 lg:col-span-3 xl:col-span-3"
            style={{ gridColumn: `span 3` }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i + 1) * 0.1 }}
          >
            <Link
              to={`/products?category=${cat.slug}`}
              className="group block relative aspect-4/3 overflow-hidden rounded-2xl"
            >
              <img
                src={getCategoryImage(cat)}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-foreground/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl text-primary-foreground/90">
                    {getCategoryInitial(cat.name)}
                  </span>
                  <div>
                    <h3 className="text-primary-foreground font-display font-bold text-base">
                      {cat.name}
                    </h3>
                    <p className="text-primary-foreground/70 text-xs">
                      {cat.product_count} products
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-primary-foreground" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryNav;
