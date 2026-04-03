import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useGetHeroSlides } from "@/services/slides/heroSlides.query";
import { Skeleton } from "@/components/ui/skeleton";
import { convertToNewline } from "@/utils/utils";

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const { data, isLoading, error } = useGetHeroSlides({
    is_active: true,
  });

  const slides = useMemo(() => data?.data ?? [], [data]);

  const totalSlides = slides.length;

  const next = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prev = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides === 0) return;

    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, totalSlides]);

  const slide = slides[current];

  if (isLoading) {
    return (
      <section className="relative h-[75vh] overflow-hidden">
        <Skeleton className="h-full w-full" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative h-[75vh] overflow-hidden flex items-center justify-center">
        <div className="text-red-500 text-lg font-medium">
          Error loading slides.
        </div>
      </section>
    );
  }

  if (!slide) {
    return (
      <section className="relative h-[75vh] overflow-hidden flex items-center justify-center">
        <div className="text-gray-500 text-lg">No slides available.</div>
      </section>
    );
  }

  return (
    <section className="relative h-[72vh] min-h-28rem overflow-hidden md:h-[75vh]">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.id || current}
          src={slide.image_url}
          alt={slide.title}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      </AnimatePresence>

      <motion.div
        key={`overlay-${slide.id || current}`}
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/45 to-black/20"
        initial={{ opacity: 0.65 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      <div className="pointer-events-none absolute inset-0 md:hidden">
        <motion.div
          className="absolute -left-12 top-8 h-40 w-40 rounded-full bg-primary/35 blur-3xl"
          animate={{ x: [0, 14, 0], y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-10 bottom-20 h-44 w-44 rounded-full bg-secondary/25 blur-3xl"
          animate={{ x: [0, -12, 0], y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

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
              <motion.h1
                className="text-2xl font-bold leading-tight text-white whitespace-pre-line md:text-4xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {convertToNewline(slide.title)}
              </motion.h1>

              <motion.p
                className="mt-3 max-w-md text-sm text-white/85 md:mt-4 md:text-lg"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
              >
                {slide.description}
              </motion.p>

              <motion.div
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm md:hidden"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Swipe-ready highlights
              </motion.div>

              {slide.link && (
                <Link to={slide.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.3 }}
                  >
                    <Button className="mt-5 rounded-lg px-6 py-5 text-xs font-semibold md:mt-6 md:px-8 md:py-6 md:text-sm">
                    {slide.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
              )}

              <motion.div
                className="mt-4 grid grid-cols-3 gap-2 md:hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.34 }}
              >
                {slides.map((_, i) => (
                  <div
                    key={`mobile-progress-${i}`}
                    className="h-1.5 overflow-hidden rounded-full bg-white/25"
                  >
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={{ width: i === current ? "0%" : "100%" }}
                      animate={{ width: i === current ? "100%" : "100%" }}
                      transition={{
                        duration: i === current ? 7.2 : 0.2,
                        ease: "linear",
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/40 cursor-pointer md:left-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/40 cursor-pointer md:right-4"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 gap-2 md:flex md:bottom-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-8 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroCarousel;
