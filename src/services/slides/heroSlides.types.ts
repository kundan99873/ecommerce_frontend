export interface AddHeroSlideBody {
  name: string;
  description: string;
  image?: File;
}

export interface UpdateHeroSlideBody {
  id: number;
  body: FormData;
}

export interface HeroSlide {
  id: number;
  title: string;
  description: string;
  image_url: string;
  cta: string;
  is_active: boolean;
  link: string;
}

export interface GetHeroSlideResponse {
  success: boolean;
  message: string;
  data: HeroSlide[];
}


export interface GetHeroSlideQuery {
  search?: string;
  is_active?: boolean;
}