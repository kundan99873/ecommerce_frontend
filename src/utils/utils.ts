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
