export type Packaging = { name: string; extra: number };

export type Product = {
  id: string; // = slug (fixed once created)
  slug: string;
  name: string;
  category: string; // category slug
  price: number;
  mrp: number;
  short: string;
  description: string;
  highlights: string[];
  images: string[];
  emoji: string; // placeholder artwork when no image
  hue: number;
  packaging: Packaging[];
  tags: string[];
  size?: string;
  stock: number;
  featured: boolean;
  visible: boolean;
  personaliseLabel?: string; // set => customer can add custom text / logo note
  personaliseMax?: number;
  bulkMin?: number;
};

export type Category = { id: string; slug: string; name: string; emoji: string; blurb: string; image?: string; sort: number };
export type Post = { id: string; slug: string; title: string; description: string; date: string; body: string; published: boolean; ctaHref?: string; ctaLabel?: string };
export type PageDoc = { id: string; title: string; body: string };
export type Coupon = { id: string; code: string; label: string; pct?: number; flat?: number; min?: number; cap?: number; active: boolean };

export type Settings = {
  name: string; tagline: string; altTagline: string;
  heroTitle: string; heroSub: string; heroImage: string;
  announcement: string;
  phone: string; email: string; whatsapp: string; address: string;
  parentLine: string; legalInfo: string;
  freeShipAbove: number; shippingFee: number; giftWrapFee: number; bulkMin: number;
  orderMode: "shop" | "enquiry"; showPrices: boolean;
  gaId: string; pixelId: string; adsId: string;
};

export type EnquiryStatus = "new" | "quoted" | "won" | "lost";
export type Enquiry = {
  id: string; createdAt: string; status: EnquiryStatus;
  type: string; name: string; company: string; email: string; phone: string; city: string;
  product: string; productSlug: string; quantity: string; budget: string; neededBy: string;
  branding: boolean; message: string;
  quoteAmount?: string; quoteNote?: string; adminNote?: string;
};
