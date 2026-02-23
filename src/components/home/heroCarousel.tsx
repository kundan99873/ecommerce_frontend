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
    <section className="relative h-[75vh] overflow-hidden">
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

      <div className="absolute inset-0 bg-black/40" />

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
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight whitespace-pre-line">
                {convertToNewline(slide.title)}
              </h1>

              <p className="mt-4 text-white/80 text-lg">{slide.description}</p>

              {slide.link && (
                <Link to={slide.link}>
                  <Button className="mt-6 px-8 py-6 text-sm font-semibold rounded-lg">
                    {slide.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/40 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/40 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
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
