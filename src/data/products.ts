export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  description: string;
  rating: number;
  reviews: number;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
}

export interface Order {
  id: string;
  date: string;
  status:
    | "delivered"
    | "shipped"
    | "processing"
    | "cancelled"
    | "packed"
    | "out_for_delivery";
  items: { product: Product; quantity: number }[];
  total: number;
  trackingSteps?: { label: string; date: string; done: boolean }[];
}

export const categories = [
  "All",
  "Clothing",
  "Shoes",
  "Bags",
  "Accessories",
  "Jewelry",
];

export const products: Product[] = [
  {
    id: 1,
    name: "Cashmere Blend Overcoat",
    price: 289,
    originalPrice: 350,
    image:
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=750&fit=crop",
    category: "Clothing",
    brand: "Lumière",
    description:
      "Luxuriously soft cashmere blend overcoat with a tailored silhouette. Perfect for layering during cooler months. Features a notch lapel, two-button closure, and side pockets.",
    rating: 4.8,
    reviews: 124,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Camel", "Charcoal", "Navy"],
    inStock: true,
  },
  {
    id: 2,
    name: "Leather Crossbody Bag",
    price: 165,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop",
    category: "Bags",
    brand: "Maison",
    description:
      "Handcrafted full-grain leather crossbody with adjustable strap. Interior features a zip pocket and two slip pockets for effortless organization.",
    rating: 4.6,
    reviews: 89,
    colors: ["Tan", "Black", "Burgundy"],
    inStock: true,
  },
  {
    id: 3,
    name: "Merino Wool Sweater",
    price: 128,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=750&fit=crop",
    category: "Clothing",
    brand: "Lumière",
    description:
      "Ultra-fine merino wool crewneck sweater with ribbed cuffs and hem. Breathable and temperature-regulating for year-round comfort.",
    rating: 4.9,
    reviews: 203,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Forest", "Navy"],
    inStock: true,
  },
  {
    id: 4,
    name: "Suede Chelsea Boots",
    price: 220,
    originalPrice: 275,
    image:
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=750&fit=crop",
    category: "Shoes",
    brand: "Artisan",
    description:
      "Premium suede Chelsea boots with elastic side panels and pull tab. Leather-lined interior with cushioned insole for all-day comfort.",
    rating: 4.7,
    reviews: 156,
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["Sand", "Brown", "Black"],
    inStock: true,
  },
  {
    id: 5,
    name: "Gold Chain Necklace",
    price: 95,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=750&fit=crop",
    category: "Jewelry",
    brand: "Éclat",
    description:
      "14k gold-plated chain necklace with a minimalist design. Hypoallergenic and tarnish-resistant. Length: 18 inches with 2-inch extender.",
    rating: 4.5,
    reviews: 67,
    inStock: true,
  },
  {
    id: 6,
    name: "Linen Blend Trousers",
    price: 98,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop",
    category: "Clothing",
    brand: "Maison",
    description:
      "Relaxed-fit linen blend trousers with an elastic waist and drawstring. Side pockets and back welt pockets for a refined look.",
    rating: 4.4,
    reviews: 91,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Sand", "White", "Olive"],
    inStock: true,
  },
  {
    id: 7,
    name: "Leather Belt",
    price: 68,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop",
    category: "Accessories",
    brand: "Artisan",
    description:
      "Full-grain Italian leather belt with a brushed brass buckle. Width: 1.25 inches. Available in multiple sizes for a perfect fit.",
    rating: 4.8,
    reviews: 142,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cognac", "Black"],
    inStock: true,
  },
  {
    id: 8,
    name: "Canvas Tote Bag",
    price: 52,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=750&fit=crop",
    category: "Bags",
    brand: "Lumière",
    description:
      "Heavy-duty organic cotton canvas tote with leather handles. Interior zip pocket and magnetic snap closure. Machine washable.",
    rating: 4.3,
    reviews: 78,
    colors: ["Natural", "Black", "Navy"],
    inStock: true,
  },
  {
    id: 9,
    name: "Silk Scarf",
    price: 78,
    image:
      "https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=600&h=750&fit=crop",
    category: "Accessories",
    brand: "Éclat",
    description:
      "Pure mulberry silk scarf with hand-rolled edges. Versatile styling — wear as a neck scarf, hair accessory, or bag charm.",
    rating: 4.6,
    reviews: 54,
    colors: ["Ivory", "Blush", "Emerald"],
    inStock: true,
  },
  {
    id: 10,
    name: "Leather Sneakers",
    price: 185,
    originalPrice: 230,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=750&fit=crop",
    category: "Shoes",
    brand: "Artisan",
    description:
      "Minimalist white leather sneakers with a cushioned sole. Clean silhouette crafted from Italian full-grain leather.",
    rating: 4.7,
    reviews: 198,
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["White", "Off-White"],
    inStock: true,
  },
  {
    id: 11,
    name: "Pearl Drop Earrings",
    price: 115,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=750&fit=crop",
    category: "Jewelry",
    brand: "Éclat",
    description:
      "Freshwater pearl drop earrings set in 18k gold vermeil. Classic elegance for any occasion.",
    rating: 4.8,
    reviews: 73,
    inStock: true,
  },
  {
    id: 12,
    name: "Denim Jacket",
    price: 145,
    image:
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=750&fit=crop",
    category: "Clothing",
    brand: "Maison",
    description:
      "Classic denim jacket in medium wash with vintage-inspired brass buttons. Slightly oversized fit for layering.",
    rating: 4.5,
    reviews: 112,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Medium Wash", "Dark Wash"],
    inStock: false,
  },
];

const trackingFor = (status: Order["status"]): Order["trackingSteps"] => {
  const steps = [
    "Ordered",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  const statusIndex: Record<string, number> = {
    processing: 0,
    packed: 1,
    shipped: 2,
    out_for_delivery: 3,
    delivered: 4,
    cancelled: -1,
  };
  const idx = statusIndex[status] ?? -1;
  return steps.map((label, i) => ({
    label,
    date: i <= idx ? "2025-02-0" + (i + 1) : "",
    done: i <= idx,
  }));
};

export const orders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-12-15",
    status: "delivered",
    items: [
      { product: products[0], quantity: 1 },
      { product: products[4], quantity: 1 },
    ],
    total: 384,
    trackingSteps: trackingFor("delivered"),
  },
  {
    id: "ORD-2024-002",
    date: "2025-01-08",
    status: "shipped",
    items: [{ product: products[2], quantity: 2 }],
    total: 256,
    trackingSteps: trackingFor("shipped"),
  },
  {
    id: "ORD-2025-003",
    date: "2025-01-28",
    status: "processing",
    items: [
      { product: products[3], quantity: 1 },
      { product: products[7], quantity: 1 },
    ],
    total: 272,
    trackingSteps: trackingFor("processing"),
  },
  {
    id: "ORD-2025-004",
    date: "2025-02-01",
    status: "cancelled",
    items: [{ product: products[1], quantity: 1 }],
    total: 165,
    trackingSteps: trackingFor("cancelled"),
  },
];
