// SAMPLE CATALOG - replace with your real products (name, price, description, image).
// `emoji` + `hue` draw the placeholder artwork; add an `image` URL per product to use real photos.

export type Product = {
  slug: string;
  name: string;
  price: number;
  mrp: number;
  category: string;
  occasions: string[];
  for: string[];
  short: string;
  description: string;
  emoji: string;
  hue: number;
  stock: number;
  featured?: boolean;
  image?: string;
  personalise?: { label: string; maxLen: number };
};

export const CATEGORIES = [
  { slug: "hampers", name: "Gift Hampers", emoji: "🧺" },
  { slug: "personalised", name: "Personalised", emoji: "✍️" },
  { slug: "sweets", name: "Sweets & Chocolates", emoji: "🍫" },
  { slug: "home-decor", name: "Home & Decor", emoji: "🕯️" },
  { slug: "plants", name: "Plants & Flowers", emoji: "🪴" },
  { slug: "jewellery", name: "Jewellery & Accessories", emoji: "💍" },
];

export const OCCASIONS = [
  { slug: "birthday", name: "Birthday", emoji: "🎂" },
  { slug: "anniversary", name: "Anniversary", emoji: "💞" },
  { slug: "wedding", name: "Wedding", emoji: "💐" },
  { slug: "rakhi", name: "Rakhi", emoji: "🧿" },
  { slug: "diwali", name: "Diwali", emoji: "🪔" },
  { slug: "housewarming", name: "Housewarming", emoji: "🏡" },
  { slug: "corporate", name: "Corporate", emoji: "💼" },
  { slug: "valentine", name: "Valentine's", emoji: "❤️" },
];

export const RECIPIENTS = [
  { slug: "her", name: "Her" },
  { slug: "him", name: "Him" },
  { slug: "kids", name: "Kids" },
  { slug: "parents", name: "Parents" },
  { slug: "couple", name: "Couple" },
  { slug: "team", name: "Team" },
];

export const PRODUCTS: Product[] = [
  {
    slug: "royal-celebration-hamper",
    name: "Royal Celebration Hamper",
    price: 2499, mrp: 2999, category: "hampers",
    occasions: ["diwali", "wedding", "corporate"], for: ["parents", "couple", "team"],
    short: "Dry fruits, handmade chocolates, scented candle and a brass diya in a keepsake box.",
    description: "A generous hamper wrapped in a reusable wooden box: premium almonds and cashews, assorted handmade chocolates, a soy scented candle and a brass diya. Ideal for festive gifting and client appreciation.",
    emoji: "🎁", hue: 340, stock: 40, featured: true,
  },
  {
    slug: "personalised-photo-frame",
    name: "Personalised Photo Frame",
    price: 799, mrp: 999, category: "personalised",
    occasions: ["birthday", "anniversary", "valentine"], for: ["her", "him", "couple", "parents"],
    short: "Wooden frame engraved with a name and message of your choice.",
    description: "Solid wood frame with a laser-engraved name and short message. Holds a 6x8 inch photo. Each piece is made to order.",
    emoji: "🖼️", hue: 28, stock: 80, featured: true,
    personalise: { label: "Name & message to engrave", maxLen: 40 },
  },
  {
    slug: "name-engraved-pen-set",
    name: "Name-Engraved Pen Set",
    price: 649, mrp: 799, category: "personalised",
    occasions: ["corporate", "birthday"], for: ["him", "team"],
    short: "Matte metal pen with the recipient's name engraved, in a gift box.",
    description: "A smooth-writing metal ball pen with a name engraved on the barrel, packed in a magnetic gift box with a refill.",
    emoji: "🖋️", hue: 215, stock: 120,
    personalise: { label: "Name to engrave", maxLen: 20 },
  },
  {
    slug: "belgian-chocolate-box",
    name: "Belgian Chocolate Box (24 pcs)",
    price: 1199, mrp: 1399, category: "sweets",
    occasions: ["birthday", "anniversary", "valentine", "diwali"], for: ["her", "kids", "couple"],
    short: "24 assorted truffles and pralines in a ribbon-tied box.",
    description: "Twenty-four hand-finished truffles and pralines: dark, milk and hazelnut. Best consumed within 6 weeks. Ships in insulated packaging in warm weather.",
    emoji: "🍫", hue: 20, stock: 60, featured: true,
  },
  {
    slug: "kaju-katli-mithai-box",
    name: "Kaju Katli Mithai Box (500g)",
    price: 749, mrp: 849, category: "sweets",
    occasions: ["diwali", "rakhi", "housewarming"], for: ["parents", "team", "couple"],
    short: "Silver-leaf kaju katli made fresh in small batches.",
    description: "Classic cashew fudge diamonds with edible silver leaf, packed in a festive box. Made fresh; best within 10 days.",
    emoji: "🍬", hue: 48, stock: 90,
  },
  {
    slug: "rakhi-sweets-combo",
    name: "Rakhi & Sweets Combo",
    price: 549, mrp: 699, category: "hampers",
    occasions: ["rakhi"], for: ["him", "her"],
    short: "Designer rakhi, roli-chawal, and a mini mithai box.",
    description: "A designer rakhi with roli-chawal and a mini box of assorted mithai. Add a handwritten message at checkout.",
    emoji: "🧿", hue: 5, stock: 150, featured: true,
  },
  {
    slug: "soy-candle-trio",
    name: "Scented Soy Candle Trio",
    price: 899, mrp: 1199, category: "home-decor",
    occasions: ["housewarming", "birthday", "diwali"], for: ["her", "parents", "couple"],
    short: "Lavender, vanilla and sandalwood candles in glass jars.",
    description: "Three hand-poured soy wax candles (lavender, vanilla, sandalwood) in reusable glass jars with cotton wicks. Around 30 hours burn time each.",
    emoji: "🕯️", hue: 280, stock: 70,
  },
  {
    slug: "brass-diya-set",
    name: "Handcrafted Brass Diya Set",
    price: 999, mrp: 1299, category: "home-decor",
    occasions: ["diwali", "housewarming", "wedding"], for: ["parents", "couple"],
    short: "Set of 6 etched brass diyas with a decorative tray.",
    description: "Six etched brass diyas on a matching tray. A timeless festive and housewarming gift.",
    emoji: "🪔", hue: 38, stock: 55,
  },
  {
    slug: "lucky-bamboo-plant",
    name: "Lucky Bamboo in Ceramic Pot",
    price: 499, mrp: 649, category: "plants",
    occasions: ["housewarming", "corporate", "birthday"], for: ["team", "parents", "him"],
    short: "Low-maintenance bamboo in a glazed ceramic pot.",
    description: "Three-stalk lucky bamboo in a glazed ceramic pot with pebbles. Thrives in indirect light.",
    emoji: "🎋", hue: 140, stock: 100,
  },
  {
    slug: "rose-bouquet-red",
    name: "Red Rose Bouquet (12 stems)",
    price: 899, mrp: 999, category: "plants",
    occasions: ["valentine", "anniversary", "birthday"], for: ["her", "couple"],
    short: "Twelve fresh red roses, hand-tied with a ribbon.",
    description: "Twelve long-stem red roses with greens, hand-tied and wrapped. Delivered fresh in select cities.",
    emoji: "🌹", hue: 355, stock: 30, featured: true,
  },
  {
    slug: "silver-initial-pendant",
    name: "Silver Initial Pendant",
    price: 1499, mrp: 1999, category: "jewellery",
    occasions: ["birthday", "anniversary", "valentine"], for: ["her"],
    short: "925 sterling silver pendant with an initial of your choice.",
    description: "A 925 sterling silver pendant with a chain, personalised with a single initial. Comes in a velvet pouch.",
    emoji: "💍", hue: 250, stock: 45, featured: true,
    personalise: { label: "Initial (one letter)", maxLen: 1 },
  },
  {
    slug: "couple-keychain-set",
    name: "Couple Keychain Set",
    price: 399, mrp: 549, category: "jewellery",
    occasions: ["anniversary", "valentine"], for: ["couple"],
    short: "Matching pair of engraved metal keychains.",
    description: "Two interlocking metal keychains, each engraved with a name.",
    emoji: "🔑", hue: 320, stock: 140,
    personalise: { label: "Two names (e.g. Aarav & Meera)", maxLen: 30 },
  },
  {
    slug: "kids-storybook-and-plush",
    name: "Storybook & Plush Gift Set",
    price: 699, mrp: 899, category: "hampers",
    occasions: ["birthday"], for: ["kids"],
    short: "A bedtime storybook with a soft plush toy.",
    description: "An illustrated bedtime storybook with a soft plush friend, wrapped in a gift bag. Suitable for ages 2-6.",
    emoji: "🧸", hue: 190, stock: 85,
  },
  {
    slug: "gourmet-tea-coffee-hamper",
    name: "Gourmet Tea & Coffee Hamper",
    price: 1299, mrp: 1599, category: "hampers",
    occasions: ["corporate", "housewarming", "birthday"], for: ["parents", "team", "him"],
    short: "Single-estate teas, filter coffee, cookies and two ceramic mugs.",
    description: "Single-estate teas, ground filter coffee, butter cookies and two ceramic mugs in a gift box.",
    emoji: "☕", hue: 25, stock: 65,
  },
  {
    slug: "custom-name-mug",
    name: "Custom Name Mug",
    price: 349, mrp: 449, category: "personalised",
    occasions: ["birthday", "corporate", "valentine"], for: ["him", "her", "team", "kids"],
    short: "Ceramic mug printed with a name and a short line.",
    description: "A 330 ml ceramic mug, dishwasher safe, printed with a name and short message.",
    emoji: "🍵", hue: 170, stock: 200,
    personalise: { label: "Name / short message", maxLen: 30 },
  },
  {
    slug: "wedding-gift-trunk",
    name: "Wedding Gift Trunk",
    price: 3999, mrp: 4999, category: "hampers",
    occasions: ["wedding", "anniversary"], for: ["couple"],
    short: "Keepsake trunk with silver coin, dry fruits, candles and a note card.",
    description: "A keepsake trunk with a silver coin, dry fruits, scented candles, mithai and a handwritten note card.",
    emoji: "💝", hue: 330, stock: 20,
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const discountPct = (p: Product) => Math.round(((p.mrp - p.price) / p.mrp) * 100);

export type Filters = { q?: string; category?: string; occasion?: string; for?: string; max?: number; sort?: string };

export function filterProducts(f: Filters): Product[] {
  const q = f.q?.trim().toLowerCase();
  let list = PRODUCTS.filter(
    (p) =>
      (!f.category || p.category === f.category) &&
      (!f.occasion || p.occasions.includes(f.occasion)) &&
      (!f.for || p.for.includes(f.for)) &&
      (!f.max || p.price <= f.max) &&
      (!q || `${p.name} ${p.short} ${p.category} ${p.occasions.join(" ")}`.toLowerCase().includes(q)),
  );
  if (f.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (f.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  else list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return list;
}
