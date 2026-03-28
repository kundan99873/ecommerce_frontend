import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router";
import ProductCard from "@/components/product/productCard";
import { products } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Clock, Search, SlidersHorizontal, Star, X } from "lucide-react";
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
import {
  useGetRecentSearches,
  useInfiniteProducts,
} from "@/services/product/product.query";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetCategory } from "@/services/category/category.query";
import ProductCardSkeleton from "@/components/product/productCardSkeleton";
import { useAuth } from "@/context/authContext";

const maxPrice = Math.max(...products.map((p) => p.price));
// const brands = [...new Set(products.map((p) => p.category))]; // using category as brand proxy

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "newest";

const Products = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const searchFromParams = searchParams.get("search") || "";
  const [search, setSearch] = useState(searchFromParams);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const debouncedSearch = useDebounce(search);
  const trimmedDebouncedSearch = debouncedSearch.trim();
  const effectiveSearch =
    trimmedDebouncedSearch.length >= 3 ? trimmedDebouncedSearch : undefined;

  useEffect(() => {
    setSearch((prev) => (prev === searchFromParams ? prev : searchFromParams));
  }, [searchFromParams]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProducts({
      search: effectiveSearch,
      limit: 8,
      category: activeCategory !== "all" ? activeCategory : undefined,
      is_product_listing_page: true,
    });
  const { data: recentSearchData } = useGetRecentSearches(isAuthenticated);
  const recentSearches =
    recentSearchData?.data.searches
      ?.map((item) => item.search_query?.trim())
      .filter((value): value is string => Boolean(value)) ?? [];
  const filteredRecentSearches = recentSearches.filter((item) =>
    item.toLowerCase().includes(search.trim().toLowerCase()),
  );

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

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const { data: categoryData } = useGetCategory();
  console.log({ categoryData });

  // const filtered = useMemo(() => {
  //   let result = products.filter((p) => {
  //     const matchCategory =
  //       activeCategory === "All" || p.category === activeCategory;
  //     const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
  //     const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
  //     const matchRating = p.rating >= minRating;
  //     const matchStock = !inStockOnly || p.inStock;
  //     return (
  //       matchCategory && matchSearch && matchPrice && matchRating && matchStock
  //     );
  //   });

  //   switch (sortBy) {
  //     case "price-asc":
  //       result.sort((a, b) => a.price - b.price);
  //       break;
  //     case "price-desc":
  //       result.sort((a, b) => b.price - a.price);
  //       break;
  //     case "rating":
  //       result.sort((a, b) => b.rating - a.rating);
  //       break;
  //     case "newest":
  //       result.sort((a, b) => b.id - a.id);
  //       break;
  //   }

  //   return result;
  // }, [activeCategory, search, sortBy, priceRange, minRating, inStockOnly]);

  const clearFilters = () => {
    setSearch("");
    setSortBy("default");
    setPriceRange([0, maxPrice]);
    setMinRating(0);
    setInStockOnly(false);
    setSearchParams({});
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);

    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("search", value);
    } else {
      nextParams.delete("search");
    }

    setSearchParams(nextParams);
  };

  const hasActiveFilters =
    search ||
    sortBy !== "default" ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    minRating > 0 ||
    inStockOnly ||
    activeCategory !== "all";

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

  console.log({ data });

  const totalCounts = data?.pages[0]?.totalCounts ?? 0;

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
              onClick={() => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.delete("category");
                setSearchParams(nextParams);
              }}
              className={`px-4 py-2 text-sm rounded-full cursor-pointer border transition-colors ${
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
                onClick={() => {
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set("category", cat.slug);
                  setSearchParams(nextParams);
                }}
                className={`px-4 py-2 text-sm rounded-full cursor-pointer border transition-colors ${
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
            <div ref={searchBoxRef} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="pl-9"
              />

              {isSearchFocused && filteredRecentSearches.length > 0 && (
                <div className="absolute z-20 mt-2 w-full rounded-lg border bg-background shadow-md">
                  <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent Searches
                  </p>
                  <div className="pb-2">
                    {filteredRecentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          handleSearchChange(term);
                          setIsSearchFocused(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                      >
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
          {totalCounts} product{totalCounts !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 ">
            {Array(4)
              .fill(undefined)
              .map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
          </div>
        ) : totalCounts > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data?.pages.map((page) =>
              page.data.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              )),
            )}
            <div ref={loadMoreRef} className="col-span-full h-10" />

            {isFetchingNextPage &&
              Array(4)
                .fill(undefined)
                .map((_, i) => <ProductCardSkeleton key={i} />)}

            {!hasNextPage && (
              <p className="col-span-full text-center text-gray-500">
                No more products
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
