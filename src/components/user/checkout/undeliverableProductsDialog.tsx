import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trash2, MapPin } from "lucide-react";
import type { CartItem } from "@/services/cart/cart.types";

interface UndeliverableProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  undeliverableItems: CartItem[];
  onRemoveProducts: (items: CartItem[]) => void;
  onChangeAddress: () => void;
  isRemoving?: boolean;
}

const UndeliverableProductsDialog = ({
  open,
  onOpenChange,
  undeliverableItems,
  onRemoveProducts,
  onChangeAddress,
  isRemoving = false,
}: UndeliverableProductsDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delivery Not Available
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              The following {undeliverableItems.length} product(s) cannot be
              delivered to your selected address:
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto rounded-lg bg-muted/50 p-3">
              {undeliverableItems.map((item) => (
                <div key={item.sku} className="flex items-start gap-2 text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs shrink-0">
                    Undeliverable
                  </Badge>
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 pt-4 border-t">
          <p className="text-sm font-medium">What would you like to do?</p>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={onChangeAddress}
              className="w-full justify-start"
              disabled={isRemoving}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Change Delivery Address
            </Button>
            <Button
              variant="destructive"
              onClick={() => onRemoveProducts(undeliverableItems)}
              className="w-full justify-start"
              disabled={isRemoving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove These Products
            </Button>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>
            Keep Editing
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UndeliverableProductsDialog;
