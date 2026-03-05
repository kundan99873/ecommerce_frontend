export type CartBody = {
  slug: string;
  quantity: number;
};

export type CartProduct = {
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
};

export interface CartItem {
  quantity: number;
  price: number;
  subtotal: number;
  name: string;
  slug: string;
  sku: string;
  stock: number;
  color: string;
  size: string;
  image: string;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: {
    items: CartItem[];
    total_items: number;
    total_price: number;
  };
}
