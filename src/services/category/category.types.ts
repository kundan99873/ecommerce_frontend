export interface AddCategoryBody {
  name: string;
  description: string;
  image?: File;
}

export interface UpdateCategoryBody {
  slug: string;
  body: FormData;
}

export interface Category {
  name: string;
  description: string | null;
  slug: string;
  image_url: string;
  created_at: string;  
  product_count: number;
}

export interface GetCategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}
