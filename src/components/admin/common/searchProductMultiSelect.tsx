import { useState, useEffect, useMemo } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetProductWithoutVariant } from "@/services/product/product.query";
import { useDebounce } from "@/hooks/useDebounce";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

type Product = {
  id: number;
  name: string;
};

interface Props {
  selectedProducts: number[];
  setSelectedProducts: (value: number[]) => void;
}

export default function SearchProductMultiSelect({
  selectedProducts,
  setSelectedProducts,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductObjects, setSelectedProductObjects] = useState<
    Product[]
  >([]);

  const safeSelected = Array.isArray(selectedProducts) ? selectedProducts : [];
  const debouncedSearch = useDebounce(searchTerm, 400);
  const { data, isLoading } = useGetProductWithoutVariant({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!data?.data) return;

    const mappedData: Product[] = data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));

    if (page === 1) {
      setProducts(mappedData);
    } else {
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = mappedData.filter(
          (p: Product) => !existingIds.has(p.id),
        );
        return [...prev, ...newItems];
      });
    }
  }, [data, page]);

  useEffect(() => {
    const matched = products.filter((p) => safeSelected.includes(p.id));

    setSelectedProductObjects((prev) => {
      const prevIds = new Set(prev.map((p) => p.id));
      const merged = [...prev];

      matched.forEach((p) => {
        if (!prevIds.has(p.id)) {
          merged.push(p);
        }
      });

      return merged;
    });
  }, [products, safeSelected]);

  const toggleProduct = (product: Product) => {
    const isSelected = safeSelected.includes(product.id);

    let updated: number[];

    if (isSelected) {
      updated = safeSelected.filter((id) => id !== product.id);
      setSelectedProductObjects((prev) =>
        prev.filter((p) => p.id !== product.id),
      );
    } else {
      updated = [...safeSelected, product.id];
      setSelectedProductObjects((prev) => [...prev, product]);
    }

    setSelectedProducts(updated);
  };

  const hasNextPage = useMemo(() => {
    if (!data?.totalCounts) return false;
    return page * 10 < data.totalCounts;
  }, [data, page]);

  const loadMore = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between min-h-10 h-auto px-3"
          >
            <div className="flex-1 overflow-hidden">
              {selectedProductObjects.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {selectedProductObjects.map((product) => (
                    <Badge
                      key={product.id}
                      variant="secondary"
                      className="max-w-40 truncate whitespace-nowrap cursor-pointer shrink-0 line-clamp-1"
                      title={product.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProduct(product);
                      }}
                    >
                      {product.name} ✕
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">Select products</span>
              )}
            </div>

            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-var(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput
              placeholder="Search product..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />

            <CommandEmpty>No product found.</CommandEmpty>

            <CommandGroup className="max-h-64 overflow-y-auto">
              {products.map((product) => {
                const isSelected = safeSelected.includes(product.id);

                return (
                  <CommandItem
                    key={product.id}
                    onSelect={() => toggleProduct(product)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox checked={isSelected} />
                    <span className="truncate">{product.name}</span>

                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}

              {hasNextPage && (
                <div className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
