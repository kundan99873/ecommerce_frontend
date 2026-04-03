import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Star, X } from "lucide-react";
import type { FilterOptions } from "@/services/product/product.types";
import type { Category } from "@/services/category/category.types";
import { formatCurrency } from "@/utils/utils";

export type ProductFilterOption = "all" | FilterOptions;

interface ProductFiltersProps {
  activeCategory: string;
  activeFilter: ProductFilterOption;
  activeBrands: string[];
  categoryOptions: Category[];
  brandOptions: string[];
  priceRange: [number, number];
  computedMaxPrice: number;
  minRating: number;
  hasActiveFilters: boolean;
  onUpdateParam: (key: string, value?: string) => void;
  onToggleBrand: (brand: string) => void;
  onSetPriceRange: (value: [number, number]) => void;
  onSetMinRating: (value: number) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
}

const ProductFilters = ({
  activeCategory,
  activeFilter,
  activeBrands,
  categoryOptions,
  brandOptions,
  priceRange,
  computedMaxPrice,
  minRating,
  hasActiveFilters,
  onUpdateParam,
  onToggleBrand,
  onSetPriceRange,
  onSetMinRating,
  onClearFilters,
  isMobile = false,
}: ProductFiltersProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onUpdateParam("category", "all")}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              activeCategory === "all"
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onUpdateParam("category", cat.slug)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                activeCategory === cat.slug
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Product Filter</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "All", value: "all" },
            { label: "In Stock", value: "in_stock" },
            { label: "Out of Stock", value: "out_of_stock" },
            { label: "Featured", value: "featured" },
            { label: "Trending", value: "trending" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => onUpdateParam("filter", item.value)}
              className={`rounded-md border px-3 py-2 text-xs transition-colors ${
                activeFilter === item.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              } ${item.value === "all" ? "col-span-2" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Brand</h3>
        <div className="space-y-2 rounded-md border p-3">
          {brandOptions.length > 0 ? (
            brandOptions.map((brand) => {
              const isChecked = activeBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => onToggleBrand(brand)}
                  />
                  <span className="text-foreground/90">{brand}</span>
                </label>
              );
            })
          ) : (
            <p className="text-xs text-muted-foreground">
              No brand options available yet.
            </p>
          )}

          {activeBrands.length > 0 && (
            <button
              type="button"
              onClick={() => onUpdateParam("brands", "")}
              className="pt-1 text-xs text-primary hover:underline"
            >
              Clear selected brands
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={(v) => onSetPriceRange(v as [number, number])}
          min={0}
          max={computedMaxPrice}
          step={5}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(priceRange[0])}</span>
          <span>{formatCurrency(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Minimum Rating</h3>
        <div className="flex flex-wrap gap-1">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => onSetMinRating(r)}
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                minRating === r
                  ? "border-foreground bg-foreground text-background"
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

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onClearFilters}
        >
          <X className="mr-1 h-3 w-3" /> Clear All Filters
        </Button>
      )}

      {isMobile && <div className="h-2" />}
    </div>
  );
};

export default ProductFilters;
