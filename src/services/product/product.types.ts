export interface Product {
  name: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  brand: string;
  slug: string;
  is_active: boolean;
  variants: {
    color: string;
    size: string;
    original_price: number;
    discounted_price: number;
    stock: number;
    id: number;
    images: {
      image_url: string;
      id?: number;
    }[];
    removed_image_ids?: string[];
  }[];
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  message: string;
  totalCount: number;
}
