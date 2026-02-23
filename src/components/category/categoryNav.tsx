import { Link } from "react-router";
import { motion } from "motion/react";
import { useGetCategory } from "@/services/category/category.query";

// const categoryImages: Record<string, string> = {
//   Clothing: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop",
//   Shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
//   Bags: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
//   Accessories: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
//   Jewelry: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
// };

const CategoryNav = () => {
  // const cats = Object.entries(categoryImages);
  const { data } = useGetCategory();
  console.log(data?.data);

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {data?.data.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/products?category=${name}`}
              className="group block relative aspect-square overflow-hidden rounded-xl"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg md:text-xl">
                  {cat.name}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryNav;
