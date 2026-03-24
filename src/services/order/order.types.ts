export interface AddOrderBody {
  address_id: number;
  coupon_code?: string;
  payment_method?: string;
}

export interface UpdateOrderStatusBody {
  status: Order["status"];
}

interface OrderItem {
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
  review?: boolean;
}

export interface Order {
  order_number: string;
  items: OrderItem[];
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  purchase_date: string;
  payment_status: "PENDING" | "SUCCESS" | "FAILED";
  payment_method?: string;
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

export interface OrderDetail extends Order {
  address: {
    first_name: string;
    last_name: string;
    phone_code: string;
    phone_number: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pin_code: string;
  };
  coupon?: {
    code: string;
    discount_amount: number;
  };
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order[];
}

export interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: OrderDetail;
}

export interface AllOrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
}
