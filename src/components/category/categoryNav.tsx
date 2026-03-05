import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";

const categoryData = [
  { name: "Clothing", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop", icon: "👔" },
  { name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", icon: "👟" },
  { name: "Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop", icon: "👜" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", icon: "⌚" },
  { name: "Jewelry", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop", icon: "💎" },
];

const CategoryNav = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        className="flex items-center justify-between mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Shop by Category</h2>
          <p className="text-muted-foreground text-sm mt-1">Find what you're looking for</p>
        </div>
        <Link to="/products" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
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
            to={`/products?category=${categoryData[0].name}`}
            className="group block relative h-full min-h-80 overflow-hidden rounded-2xl"
          >
            <img
              src={categoryData[0].image}
              alt={categoryData[0].name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-lineaR-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-3xl mb-2 block">{categoryData[0].icon}</span>
              <h3 className="text-primary-foreground font-display font-bold text-2xl">{categoryData[0].name}</h3>
              <p className="text-primary-foreground/70 text-sm mt-1">
                {products.filter(p => p.category === categoryData[0].name).length} products
              </p>
              <span className="inline-flex items-center gap-1 text-primary-foreground text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* 4 smaller cards in 2x2 grid */}
        {categoryData.slice(1).map((cat, i) => (
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
              to={`/products?category=${cat.name}`}
              className="group block relative aspect-4/3 overflow-hidden rounded-2xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-foreground/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <h3 className="text-primary-foreground font-display font-bold text-base">{cat.name}</h3>
                    <p className="text-primary-foreground/70 text-xs">
                      {products.filter(p => p.category === cat.name).length} products
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


// import { Link } from "react-router";
// import { motion } from "motion/react";
// import { useGetCategory } from "@/services/category/category.query";

// // const categoryImages: Record<string, string> = {
// //   Clothing: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop",
// //   Shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
// //   Bags: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
// //   Accessories: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
// //   Jewelry: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
// // };

// const CategoryNav = () => {
//   // const cats = Object.entries(categoryImages);
//   const { data } = useGetCategory();
//   console.log(data?.data);

//   return (
//     <section className="container mx-auto px-4 py-16">
//       <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
//         Shop by Category
//       </h2>
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         {data?.data.map((cat, i) => (
//           <motion.div
//             key={cat.name}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <Link
//               to={`/products?category=${name}`}
//               className="group block relative aspect-square overflow-hidden rounded-xl"
//             >
//               <img
//                 src={cat.image_url}
//                 alt={cat.name}
//                 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
//                 loading="lazy"
//               />
//               <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors" />
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-primary-foreground font-display font-bold text-lg md:text-xl">
//                   {cat.name}
//                 </span>
//               </div>
//             </Link>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default CategoryNav;
