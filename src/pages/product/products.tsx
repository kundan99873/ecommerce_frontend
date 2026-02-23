import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router";
import ProductCard from "@/components/product/productCard";
import { products } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "motion/react";
import { useInfiniteProducts } from "@/services/product/product.query";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetCategory } from "@/services/category/category.query";

const maxPrice = Math.max(...products.map((p) => p.price));
// const brands = [...new Set(products.map((p) => p.category))]; // using category as brand proxy

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "newest";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearch = useDebounce(search);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProducts({
      search: debouncedSearch,
      limit: 10,
    });

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const { data: categoryData } = useGetCategory();
  console.log({ categoryData });

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating = p.rating >= minRating;
      const matchStock = !inStockOnly || p.inStock;
      return (
        matchCategory && matchSearch && matchPrice && matchRating && matchStock
      );
    });

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [activeCategory, search, sortBy, priceRange, minRating, inStockOnly]);

  const clearFilters = () => {
    setSearch("");
    setSortBy("default");
    setPriceRange([0, maxPrice]);
    setMinRating(0);
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    search ||
    sortBy !== "default" ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    minRating > 0 ||
    inStockOnly ||
    activeCategory !== "All";

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          min={0}
          max={maxPrice}
          step={5}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Minimum Rating</h3>
        <div className="flex gap-1">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border transition-colors ${
                minRating === r
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground"
              }`}
            >
              {r === 0 ? (
                "All"
              ) : (
                <>
                  <Star className="h-3 w-3 fill-current" /> {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="instock"
          checked={inStockOnly}
          onCheckedChange={(v) => setInStockOnly(v as boolean)}
        />
        <label htmlFor="instock" className="text-sm cursor-pointer">
          In stock only
        </label>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="h-3 w-3 mr-1" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">
          Shop
        </h1>

        {/* Top bar: categories, search, sort, filter toggle */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchParams({})}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                activeCategory === "all"
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categoryData?.data.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSearchParams({ category: cat.slug })}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="newest">New Arrivals</SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="sm:w-auto">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
                  {hasActiveFilters && (
                    <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-display">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data?.pages.map((page) =>
              page.data.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              )),
            )}
            <div ref={loadMoreRef} className="col-span-full h-10" />

            {isFetchingNextPage && (
              <p className="col-span-full text-center">Loading more...</p>
            )}

            {!hasNextPage && (
              <p className="col-span-full text-center text-gray-500">
                No more products 🚫
              </p>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground"
          >
            <p className="text-lg">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Products;
