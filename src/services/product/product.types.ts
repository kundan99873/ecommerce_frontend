export interface Product {
  name: string;
  description: string;
  category: {
    name: string;
  };
  brand: string;
  slug: string;
  variants: {
    color: string;
    size: string;
    original_price: number;
    discounted_price: number;
    stock: number;
    sku: string;
    images: {
      image_url: string;
    }[];
  }[];
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  message: string;
}
