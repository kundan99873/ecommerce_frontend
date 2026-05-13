import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  useGetRecentSearches,
  useProducts,
} from "@/services/product/product.query";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/context/authContext";
import { formatCurrency } from "@/utils/utils";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TRENDING = ["Cashmere", "Leather", "Sneakers", "Gold"];
const MIN_SEARCH_LENGTH = 3;
const RESULT_LIMIT = 4;

const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 350);
  const trimmedQuery = query.trim();
  const canSearch = debouncedQuery.trim().length >= MIN_SEARCH_LENGTH;

  const { data } = useGetRecentSearches(isAuthenticated);
  const { data: searchData, isFetching: isSearching } = useProducts(
    {
      search: debouncedQuery.trim(),
      limit: RESULT_LIMIT,
      page: 1,
    },
    { enabled: canSearch },
  );

  const recentSearches = useMemo(() => {
    const searches = data?.data?.searches ?? [];

    return Array.from(
      new Set(
        searches
          .map((item: { search_query: string }) => item.search_query?.trim())
          .filter((term): term is string => Boolean(term)),
      ),
    );
  }, [data]);

  const filteredRecentSearches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return recentSearches;
    return recentSearches.filter((item) => item.toLowerCase().includes(term));
  }, [query, recentSearches]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const results = useMemo(
    () => (canSearch ? (searchData?.data ?? []) : []),
    [canSearch, searchData],
  );

  const goToProduct = (slug: string) => {
    onOpenChange(false);
    navigate(`/product/${slug}`);
  };

  const goToShop = () => {
    if (trimmedQuery.length < MIN_SEARCH_LENGTH) return;
    onOpenChange(false);
    navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden [&>button]:hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim().length >= MIN_SEARCH_LENGTH)
                goToShop();
              if (e.key === "Escape") onOpenChange(false);
            }}
            placeholder="Search products, brands, categories..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="px-4 py-2 border-b bg-muted/30">
          {trimmedQuery.length > 0 &&
          trimmedQuery.length < MIN_SEARCH_LENGTH ? (
            <p className="text-xs text-muted-foreground">
              Type at least {MIN_SEARCH_LENGTH} characters to start searching.
            </p>
          ) : trimmedQuery.length >= MIN_SEARCH_LENGTH ? (
            <p className="text-xs text-muted-foreground">
              Search Results for "{trimmedQuery}".
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Discover products faster with recent and trending searches.
            </p>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {trimmedQuery.length < MIN_SEARCH_LENGTH ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 space-y-5"
              >
                {/* Recent */}
                {filteredRecentSearches.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Recent Searches
                    </p>
                    <div className="space-y-1">
                      {filteredRecentSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Trending
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => setQuery(t)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm hover:bg-muted transition-colors"
                      >
                        <TrendingUp className="h-3 w-3 text-primary" />
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : results.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-2"
              >
                {results.map((product, i) =>
                  (() => {
                    const primaryVariant = product.variants?.[0];
                    const image = primaryVariant?.images?.[0]?.image_url;
                    if (!primaryVariant || !image) return null;

                    return (
                      <motion.button
                        key={product.slug}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => goToProduct(product.slug)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-muted transition-colors text-left"
                      >
                        <img
                          src={image}
                          alt={product.name}
                          className="h-12 w-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.brand} · {product.category.name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold">
                            {formatCurrency(primaryVariant.discounted_price)}
                          </p>
                          {primaryVariant.original_price >
                            primaryVariant.discounted_price && (
                            <p className="text-xs text-muted-foreground line-through">
                              {formatCurrency(primaryVariant.original_price)}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })(),
                )}

                <button
                  onClick={goToShop}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-t text-sm font-medium text-primary hover:bg-muted transition-colors"
                >
                  View all results for "{trimmedQuery}"
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ) : canSearch && isSearching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 space-y-3"
              >
                {Array.from({ length: RESULT_LIMIT }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2.5 rounded-lg border animate-pulse"
                  >
                    <div className="h-12 w-10 rounded-md bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-2/3 rounded bg-muted" />
                      <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                    <div className="w-16 space-y-2">
                      <div className="h-3.5 w-full rounded bg-muted" />
                      <div className="h-3 w-2/3 ml-auto rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 py-12 text-center"
              >
                <Search className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No products found for "{debouncedQuery}"
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search term
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
