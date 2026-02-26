"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

type Option = {
  id: number;
  name: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select products",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between h-auto"
        >
          {selected.length > 0
            ? selected.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {options
                    .filter((opt) => selected.includes(opt.id))
                    .map((opt) => (
                      <Badge
                        key={opt.id}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => toggleOption(opt.id)}
                      >
                        {opt.name} ✕
                      </Badge>
                    ))}
                </div>
              )
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="min-w-full p-0">
        <Command>
          <CommandInput placeholder="Search product..." />
          <CommandEmpty>No product found.</CommandEmpty>

          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => toggleOption(option.id)}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={selected.includes(option.id)}
                  onCheckedChange={() => toggleOption(option.id)}
                />
                {option.name}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selected.includes(option.id) ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>

      {/* Selected Badges */}
    </Popover>
  );
}
