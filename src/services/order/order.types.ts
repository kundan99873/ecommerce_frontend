export interface AddOrderBody {
  address_id: number;
  coupon_code?: string;
  payment_method?: string;
}

interface OrderItem {
  product_slug: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  color: string;
  size?: string;
  price: number;
  quantity: number;
  images: {
    image_url: string;
    is_primary: boolean;
  }[];
}

export interface Order {
  order_number: string;
  items: OrderItem[];
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  purchase_date: string;
  payment_status: "PENDING" | "SUCCESS" | "FAILED";
  status:
    | "PENDING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "PACKED"
    | "OUT_FOR_DELIVERY"
    | "RETURN_REQUESTED"
    | "RETURNED"
    | "PROCESSING";
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order[];
}
