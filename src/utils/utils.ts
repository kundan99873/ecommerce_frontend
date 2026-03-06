import type { Order } from "@/services/order/order.types";

export const cleanQueryParams = <T extends object>(params: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value != null && value !== "",
    ),
  ) as Partial<T>;
};

export const formatCurrency = (
  amount: number = 0,
  currency: string = "INR",
) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const convertToNewline = (str: string): string => {
  return str.replace(/\\n/g, "\n");
};


 export const trackingFor = (status: Order["status"]) => {
    const steps: string[] = [
      "PENDING",
      "PAID",
      "CANCELLED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];
    const statusIndex: Record<string, number> = {
      PENDING: 0,
      PACKED: 1,
      CANCELLED: -1,
      SHIPPED: 3,
      OUT_FOR_DELIVERY: 4,
      DELIVERED: 5,
    };
    const idx = statusIndex[status] ?? -1;
    return steps.map((label, i) => ({
      label,
      date: i <= idx ? "2025-02-0" + (i + 1) : "",
      done: i <= idx,
    }));
  };