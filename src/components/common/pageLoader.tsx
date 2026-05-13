import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Rotating rings around bag */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border-2 border-primary/60 border-t-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />

          {/* Center icon */}
          <motion.div
            className="relative z-10 w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/40"
            animate={{ scale: [1, 1.1, 1], rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShoppingBag className="w-8 h-8 text-primary-foreground" strokeWidth={2.4} />
          </motion.div>
        </div>

        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <motion.h1
            className="font-display text-3xl md:text-4xl font-bold tracking-wide bg-linear-to-r from-primary via-accent to-primary bg-size-[200%_auto] bg-clip-text text-transparent"
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            LUMIÈRE
          </motion.h1>

          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Curating your experience
          </p>

          {/* Progress bar */}
          <div className="mt-2 w-48 h-0.75 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-primary to-accent rounded-full"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "60%" }}
            />
          </div>

          {/* Bouncing dots */}
          <div className="flex gap-1.5 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
