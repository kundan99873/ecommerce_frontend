export interface AddCategoryBody {
  name: string;
  description: string;
  image?: File;
}

export interface UpdateCategoryBody {
  slug: string;
  body: AddCategoryBody;
}

export interface Category {
  name: string;
  description: string | null;
  slug: string;
  image_url: string;
}

export interface GetCategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}
