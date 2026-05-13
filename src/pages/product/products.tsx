import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import ProductCard from "@/components/product/productCard";
import ProductFilters, {
  type ProductFilterOption,
} from "@/components/product/productFilters";
import { Input } from "@/components/ui/input";
import { Clock, Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import {
  useGetRecentSearches,
  useInfiniteProducts,
} from "@/services/product/product.query";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetCategory } from "@/services/category/category.query";
import ProductCardSkeleton from "@/components/product/productCardSkeleton";
import { useAuth } from "@/context/authContext";
import type { SortOptions } from "@/services/product/product.types";

type SortOption = "default" | SortOptions;

const DEFAULT_PRICE_MAX = 5000;

const Products = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const activeSort =
    (searchParams.get("sort") as SortOption | null) ?? "default";
  const activeFilter =
    (searchParams.get("filter") as ProductFilterOption | null) ?? "all";
  const activeBrandsParam = searchParams.get("brands") ?? "";
  const legacyBrand = searchParams.get("brand") ?? "";
  const activeBrands = useMemo(() => {
    if (activeBrandsParam) {
      return activeBrandsParam
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return legacyBrand ? [legacyBrand] : [];
  }, [activeBrandsParam, legacyBrand]);
  const searchFromParams = searchParams.get("search") || "";
  const [search, setSearch] = useState(searchFromParams);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    DEFAULT_PRICE_MAX,
  ]);
  const [minRating, setMinRating] = useState(0);
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
      sort: activeSort !== "default" ? activeSort : undefined,
      filter: activeFilter !== "all" ? activeFilter : undefined,
      brand: activeBrands.length === 1 ? activeBrands[0] : undefined,
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

  const loadedProducts = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const computedMaxPrice = useMemo(() => {
    const prices = loadedProducts.flatMap((item) =>
      item.variants.map((variant) => variant.discounted_price),
    );

    if (prices.length === 0) return DEFAULT_PRICE_MAX;
    return Math.ceil(Math.max(...prices));
  }, [loadedProducts]);

  const brandOptions = useMemo(() => {
    return [
      ...new Set(loadedProducts.map((item) => item.brand).filter(Boolean)),
    ];
  }, [loadedProducts]);

  useEffect(() => {
    setPriceRange((current) => {
      const nextMin = Math.min(current[0], computedMaxPrice);
      const nextMax =
        current[1] <= 0 || current[1] > computedMaxPrice
          ? computedMaxPrice
          : current[1];
      return [Math.min(nextMin, nextMax), nextMax];
    });
  }, [computedMaxPrice]);

  const visibleProducts = useMemo(() => {
    return loadedProducts.filter((item) => {
      const variantPrices = item.variants.map(
        (variant) => variant.discounted_price,
      );
      const itemMinPrice = variantPrices.length
        ? Math.min(...variantPrices)
        : Number.MAX_SAFE_INTEGER;
      const withinPrice =
        itemMinPrice >= priceRange[0] && itemMinPrice <= priceRange[1];
      const ratingValue = item.average_rating ?? item.rating ?? 0;
      const withinRating = minRating === 0 || ratingValue >= minRating;
      const withinBrand =
        activeBrands.length === 0 || activeBrands.includes(item.brand);

      return withinPrice && withinRating && withinBrand;
    });
  }, [activeBrands, loadedProducts, minRating, priceRange]);

  const updateParam = (key: string, value?: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (key === "brands") {
      nextParams.delete("brand");
    }

    if (!value || value === "all" || value === "default") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };

  const toggleBrand = (brand: string) => {
    const selected = new Set(activeBrands);

    if (selected.has(brand)) {
      selected.delete(brand);
    } else {
      selected.add(brand);
    }

    const nextValue = Array.from(selected).join(",");
    updateParam("brands", nextValue);
  };

  const clearFilters = () => {
    setSearch("");
    setPriceRange([0, computedMaxPrice]);
    setMinRating(0);
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

  const hasActiveFilters = Boolean(
    search ||
    activeSort !== "default" ||
    activeFilter !== "all" ||
    activeBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < computedMaxPrice ||
    minRating > 0 ||
    activeCategory !== "all",
  );

  const totalCounts = data?.pages[0]?.totalCounts ?? 0;
  const visibleCount = visibleProducts.length;

  return (
    <>
      <section className="container mx-auto px-2 sm:px-4">
        <div className="p-3 sm:p-6 md:p-10">
          {/* <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Shop
          </h1> */}
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="hidden h-fit rounded-xl border bg-card p-5 lg:sticky lg:top-24 lg:block">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <ProductFilters
                activeCategory={activeCategory}
                activeFilter={activeFilter}
                activeBrands={activeBrands}
                categoryOptions={categoryData?.data ?? []}
                brandOptions={brandOptions}
                priceRange={priceRange}
                computedMaxPrice={computedMaxPrice}
                minRating={minRating}
                hasActiveFilters={hasActiveFilters}
                onUpdateParam={updateParam}
                onToggleBrand={toggleBrand}
                onSetPriceRange={setPriceRange}
                onSetMinRating={setMinRating}
                onClearFilters={clearFilters}
              />
            </aside>

            <div>
              <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                <div ref={searchBoxRef} className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className="pl-9"
                  />

                  {isSearchFocused && filteredRecentSearches.length > 0 && (
                    <div className="absolute z-20 mt-2 w-full rounded-lg border bg-background shadow-md">
                      <p className="px-3 pb-1 pt-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
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
                  value={activeSort}
                  onValueChange={(value) => updateParam("sort", value)}
                >
                  <SelectTrigger className="w-full sm:w-52">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price_low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="top_rated">Top Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          !
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="h-[85vh] rounded-t-2xl"
                  >
                    <SheetHeader>
                      <SheetTitle className="font-display">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 overflow-y-auto pr-1">
                      <ProductFilters
                        activeCategory={activeCategory}
                        activeFilter={activeFilter}
                        activeBrands={activeBrands}
                        categoryOptions={categoryData?.data ?? []}
                        brandOptions={brandOptions}
                        priceRange={priceRange}
                        computedMaxPrice={computedMaxPrice}
                        minRating={minRating}
                        hasActiveFilters={hasActiveFilters}
                        onUpdateParam={updateParam}
                        onToggleBrand={toggleBrand}
                        onSetPriceRange={setPriceRange}
                        onSetMinRating={setMinRating}
                        onClearFilters={clearFilters}
                        isMobile
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <p className="mb-4 text-sm text-muted-foreground">
                Showing {visibleCount} of {totalCounts} product
                {totalCounts !== 1 ? "s" : ""}
              </p>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                  {Array(4)
                    .fill(undefined)
                    .map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                </div>
              ) : visibleCount > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                  {visibleProducts.map((item, index) => (
                    <ProductCard key={item.slug} product={item} index={index} />
                  ))}

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
                  className="py-20 text-center text-muted-foreground"
                >
                  <p className="text-lg">No products found</p>
                  <p className="mt-1 text-sm">
                    Try adjusting your search or filters
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
