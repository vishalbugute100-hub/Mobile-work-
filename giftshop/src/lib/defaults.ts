// Starter content, copied into the database on first run. After that everything is edited in /admin.
import type { Category, Coupon, PageDoc, Post, Product, Settings } from "./types";

export const DEFAULT_SETTINGS: Settings = {
  name: "HML Gifting",
  tagline: "Where Every Gift Builds a Relationship",
  altTagline: "Thoughtful Gifts for Lasting Memories",
  heroTitle: "Where every gift builds a relationship.",
  heroSub: "Premium teas, single-origin coffee and fine spices, presented in boxes made to be remembered. For your people, your clients and your festivals.",
  heroImage: "",
  announcement: "Corporate & bulk gifting: custom packaging and branding available. Request a quote.",
  phone: "", email: "", whatsapp: "", address: "",
  parentLine: "", legalInfo: "",
  freeShipAbove: 1499, shippingFee: 99, giftWrapFee: 149, bulkMin: 25,
  gaId: "", pixelId: "", adsId: "",
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "tea", slug: "tea", name: "Tea", emoji: "🍵", blurb: "Single-estate and signature blends from Darjeeling, Assam and the Nilgiris.", sort: 1 },
  { id: "coffee", slug: "coffee", name: "Coffee", emoji: "☕", blurb: "Freshly roasted South Indian arabica and filter blends.", sort: 2 },
  { id: "spices", slug: "spices", name: "Spices", emoji: "🌿", blurb: "Saffron, cardamom, pepper and masterbox collections.", sort: 3 },
  { id: "corporate-gifting", slug: "corporate-gifting", name: "Corporate Gifting", emoji: "💼", blurb: "Welcome kits, desk sets and client hampers, with your branding.", sort: 4 },
  { id: "festive-gifting", slug: "festive-gifting", name: "Festive Gifting", emoji: "🪔", blurb: "Diwali, Rakhi, Christmas, Eid and wedding hampers.", sort: 5 },
];

const PK = [
  { name: "Signature Kraft Box", extra: 0 },
  { name: "Rigid Magnetic Box", extra: 250 },
  { name: "Wooden Keepsake Box", extra: 600 },
];

type P = Partial<Product> & Pick<Product, "slug" | "name" | "category" | "price" | "mrp" | "short" | "description" | "emoji" | "hue">;
const mk = (p: P): Product => ({
  id: p.slug, highlights: [], images: [], packaging: PK, tags: [], stock: 100, featured: false, visible: true, ...p,
});

// SAMPLE products with placeholder artwork. Replace from /admin/products (add photos, prices, descriptions).
export const DEFAULT_PRODUCTS: Product[] = [
  mk({ slug: "darjeeling-first-flush", name: "Darjeeling First Flush", category: "tea", price: 899, mrp: 999, size: "100 g", emoji: "🍃", hue: 95, featured: true, tags: ["thank-you", "birthday"],
    short: "Delicate, floral spring harvest from a single Darjeeling estate.", description: "A light, muscatel-forward first flush plucked in early spring. Hand-sorted and sealed in a resealable tin to keep the aroma intact.",
    highlights: ["Origin: Darjeeling, West Bengal", "Notes: floral, muscatel, fresh", "Brew: 85°C, 3 minutes"] }),
  mk({ slug: "assam-gold-black-tea", name: "Assam Gold Black Tea", category: "tea", price: 649, mrp: 749, size: "100 g", emoji: "🫖", hue: 25,
    short: "Bold, malty Assam CTC for a strong morning cup.", description: "Full-bodied Assam with a deep copper liquor, ideal for classic milk chai or a robust black cup.", highlights: ["Origin: Assam", "Notes: malty, bold"] }),
  mk({ slug: "kashmiri-kahwa", name: "Kashmiri Kahwa", category: "tea", price: 799, mrp: 899, size: "75 g", emoji: "🌸", hue: 340, featured: true, tags: ["festive", "winter"],
    short: "Green tea with saffron, cardamom, cinnamon and almonds.", description: "A fragrant Kashmiri classic: green tea steeped with saffron strands, whole spices and slivered almonds.", highlights: ["Contains saffron & almonds", "Serve hot, with honey"] }),
  mk({ slug: "masala-chai-blend", name: "Signature Masala Chai Blend", category: "tea", price: 499, mrp: 599, size: "150 g", emoji: "🧡", hue: 30, tags: ["festive", "corporate"],
    short: "Our house blend of Assam tea with ginger, cardamom and clove.", description: "A balanced masala chai blend made with whole spices, ground fresh in small batches.", highlights: ["No artificial flavours"] }),
  mk({ slug: "coorg-arabica-coffee", name: "Coorg Single-Estate Arabica", category: "coffee", price: 749, mrp: 849, size: "250 g", emoji: "☕", hue: 22, featured: true, tags: ["corporate", "thank-you"],
    short: "Medium roast arabica with notes of chocolate and orange peel.", description: "Shade-grown arabica from Coorg, roasted to order. Available as beans or ground (note your preference at checkout).", highlights: ["Origin: Coorg, Karnataka", "Roast: medium", "Notes: cocoa, citrus"],
    personaliseLabel: "Grind preference (beans / filter / espresso)", personaliseMax: 30 }),
  mk({ slug: "south-indian-filter-coffee", name: "South Indian Filter Coffee Blend", category: "coffee", price: 549, mrp: 649, size: "250 g", emoji: "🥛", hue: 18,
    short: "80:20 coffee-chicory blend for the classic frothy decoction.", description: "A traditional filter coffee blend, roasted dark for a rich, frothy cup.", highlights: ["80% coffee, 20% chicory"] }),
  mk({ slug: "cold-brew-coffee-pods", name: "Cold Brew Steeping Bags (10)", category: "coffee", price: 599, mrp: 699, size: "10 bags", emoji: "🧊", hue: 200, tags: ["corporate"],
    short: "Just add cold water: smooth, low-acid cold brew at home or desk.", description: "Ten steeping bags of coarse-ground arabica. Steep overnight in cold water for a smooth concentrate.", highlights: ["Makes 10 servings"] }),
  mk({ slug: "kashmiri-saffron", name: "Kashmiri Saffron (1 g)", category: "spices", price: 599, mrp: 699, size: "1 g", emoji: "🌺", hue: 12, featured: true, tags: ["festive", "wedding"],
    short: "Deep red, long-thread saffron with intense aroma.", description: "Hand-picked saffron threads, ideal for kheer, biryani and kahwa. Packed in a glass vial.", highlights: ["Grade: Mongra / A1"] }),
  mk({ slug: "malabar-pepper-cardamom", name: "Malabar Pepper & Green Cardamom Duo", category: "spices", price: 699, mrp: 799, size: "2 × 50 g", emoji: "🌿", hue: 130,
    short: "Two Kerala staples in matching glass jars.", description: "Bold Tellicherry-style black pepper and aromatic green cardamom pods, in reusable glass jars.", highlights: ["Origin: Kerala"] }),
  mk({ slug: "spice-masterbox-6", name: "Spice Masterbox (6 jars)", category: "spices", price: 1799, mrp: 2099, size: "6 jars", emoji: "🧂", hue: 40, featured: true, tags: ["housewarming", "wedding", "festive"],
    short: "Six essential whole spices in a presentation box.", description: "Cumin, coriander, black pepper, cardamom, cinnamon and clove in six labelled glass jars within a hinged wooden box.", highlights: ["Reusable wooden box", "Recipe card included"] }),
  mk({ slug: "tea-connoisseur-gift-box", name: "Tea Connoisseur Gift Box", category: "corporate-gifting", price: 2499, mrp: 2899, size: "4 teas + infuser", emoji: "🎁", hue: 150, featured: true, tags: ["corporate", "thank-you", "diwali"],
    short: "Four signature teas with a steel infuser in a rigid gift box.", description: "Darjeeling, Assam, Kahwa and Masala Chai in tins, with a stainless-steel infuser and a handwritten-style card. Add your company logo on the lid for bulk orders.", highlights: ["Customisable lid with logo", "Bulk pricing available"],
    personaliseLabel: "Message for the card / logo notes", personaliseMax: 120 }),
  mk({ slug: "executive-coffee-desk-set", name: "Executive Coffee & Desk Set", category: "corporate-gifting", price: 2999, mrp: 3499, size: "Gift set", emoji: "💼", hue: 220, tags: ["corporate"],
    short: "Arabica, a ceramic mug and a notebook, boxed for the desk.", description: "Single-estate arabica, a ceramic mug and a hardbound notebook in a rigid box. Branded options available for teams.", highlights: ["Add company branding"],
    personaliseLabel: "Name / logo notes", personaliseMax: 120 }),
  mk({ slug: "diwali-celebration-hamper", name: "Diwali Celebration Hamper", category: "festive-gifting", price: 3499, mrp: 3999, size: "Hamper", emoji: "🪔", hue: 38, featured: true, tags: ["diwali", "festive"],
    short: "Saffron, kahwa, dry fruits, brass diya and mithai in a festive box.", description: "A festive hamper with Kashmiri kahwa, saffron, premium dry fruits, a brass diya and handmade mithai.", highlights: ["Order early for Diwali"] }),
  mk({ slug: "rakhi-tea-spice-hamper", name: "Rakhi Tea & Spice Hamper", category: "festive-gifting", price: 1599, mrp: 1899, size: "Hamper", emoji: "🧿", hue: 5, tags: ["rakhi", "festive"],
    short: "Designer rakhi with a tea and cardamom gift set.", description: "A designer rakhi with roli-chawal, a tin of Darjeeling tea and green cardamom.", highlights: ["Add a handwritten message"], personaliseLabel: "Message for the card", personaliseMax: 120 }),
];

export const DEFAULT_COUPONS: Coupon[] = [
  { id: "WELCOME10", code: "WELCOME10", label: "10% off your first order", pct: 10, active: true },
  { id: "GIFT250", code: "GIFT250", label: "₹250 off orders above ₹2,499", flat: 250, min: 2499, active: true },
];

export const DEFAULT_POSTS: Post[] = [
  { id: "corporate-gifting-guide", slug: "corporate-gifting-guide", title: "Corporate Gifting Guide: Choosing Gifts That Build Relationships", date: "2026-09-10", published: true,
    description: "How to choose corporate gifts for clients and employees: budgets, personalisation and bulk ordering tips.",
    body: "Good corporate gifts are useful, tasteful and easy to receive. Premium tea, coffee and spices tick all three, and they are consumable, so there is nothing to store or return.\n\n## Pick a tier for each audience\nTop clients, vendors and employees deserve different tiers. Decide a budget per tier before choosing products.\n\n## Add a personal touch\nA custom lid, a branded card or a handwritten note turns a good gift into a memorable one.\n\n## Order early for festive seasons\nBulk orders with custom packaging need lead time. Share your quantity and date and we will send a quote.",
    ctaHref: "/enquiry?type=Corporate%20gifting", ctaLabel: "Request a corporate gifting quote" },
  { id: "diwali-gifting-ideas", slug: "diwali-gifting-ideas", title: "Diwali Gifting Ideas: Premium Tea, Spice and Coffee Hampers", date: "2026-09-20", published: true,
    description: "Festive gifting ideas by budget, from saffron and kahwa to hampers for clients and family.",
    body: "Diwali gifting is about warmth and tradition. Premium food gifts feel special without being excessive.\n\n## Under ₹1,000\nA tin of Kashmiri kahwa, a saffron vial or a cardamom jar are crowd-pleasers.\n\n## ₹1,500 to ₹3,500\nCurated hampers with teas, spices and a keepsake box suit family and close clients.\n\n## For teams\nHaving 25 or more recipients? Ask for bulk pricing and custom packaging.",
    ctaHref: "/shop?tag=diwali", ctaLabel: "Shop Diwali gifts" },
];

export const DEFAULT_PAGES: PageDoc[] = [
  { id: "about", title: "About us", body: "We curate premium teas, coffees and spices and present them in gift boxes designed to be remembered.\n\n## Our belief\nEvery gift builds a relationship. Thoughtful gifts create lasting memories.\n\n## Corporate and bulk gifting\nWe work with companies and individuals on custom packaging, branding and bulk orders. Send us an enquiry and we will prepare a quote." },
  { id: "policies", title: "Shipping, returns & privacy", body: "## Shipping\nOrders are processed within 1-2 business days (customised items 3-7 days). Delivery usually takes 3-7 days depending on location.\n\n## Returns & refunds\nDamaged or wrong items can be reported within 48 hours of delivery with photos for a replacement or refund. Customised and consumable items are non-returnable unless defective.\n\n## Privacy\nWe collect your name, contact and address only to fulfil orders and enquiries. Payments are handled by our payment partner; we do not store card details. We do not sell your data.\n\n## Terms\nPrices are in INR and inclusive of applicable taxes. Product images are indicative. (Edit this text in Admin > Pages and have it reviewed for your business.)" },
];
