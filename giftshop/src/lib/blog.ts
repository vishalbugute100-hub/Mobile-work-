// Sample SEO content. Rewrite with your own voice; each post targets a search intent.
export type Post = { slug: string; title: string; description: string; date: string; body: string[]; link: { href: string; label: string } };

export const POSTS: Post[] = [
  {
    slug: "diwali-gift-ideas-for-family-and-clients",
    title: "20 Diwali Gift Ideas for Family, Friends and Clients",
    description: "Thoughtful Diwali gift ideas by budget, from mithai boxes and diyas to premium hampers for corporate clients.",
    date: "2026-09-20",
    body: [
      "Diwali gifting is about warmth and tradition, but the best gifts also feel personal. Start with who you are gifting, then match the budget.",
      "Under ₹1,000: a mithai box, a set of brass diyas or scented candles are crowd-pleasers that suit almost anyone in the family.",
      "₹1,000 to ₹2,500: curated hampers with dry fruits, chocolates and a keepsake pack feel generous without being over the top.",
      "For corporate clients: choose neutral, premium items such as tea and coffee hampers or engraved stationery, and add a branded note card.",
      "Order early: festive weeks sell out, and personalised items need extra production time.",
    ],
    link: { href: "/shop?occasion=diwali", label: "Shop Diwali gifts" },
  },
  {
    slug: "anniversary-gift-ideas-for-wife",
    title: "Anniversary Gift Ideas for Wife That She Will Actually Love",
    description: "Romantic, practical and personalised anniversary gift ideas for your wife, with budgets for every year.",
    date: "2026-08-10",
    body: [
      "The gift that lands best usually shows you noticed something about her. Personalisation is the shortcut: a name, a date or a shared memory.",
      "Classic romantic: a hand-tied rose bouquet with a box of chocolates never fails, especially with a handwritten card.",
      "Keepsake: an engraved photo frame or an initial pendant becomes something she keeps for years.",
      "Experience-led: pair a small gift with a plan, like a dinner reservation or a weekend drive.",
    ],
    link: { href: "/shop?occasion=anniversary&for=her", label: "Shop anniversary gifts for her" },
  },
  {
    slug: "corporate-gifting-guide",
    title: "Corporate Gifting Guide: How to Choose Gifts for Employees and Clients",
    description: "A practical guide to corporate gifting: budgets, what to avoid, personalisation and bulk ordering tips.",
    date: "2026-07-02",
    body: [
      "Good corporate gifts are useful, tasteful and easy to receive. Avoid anything too personal or perishable on a long shipping route.",
      "Pick a budget tier per audience: employees, vendors and top clients usually deserve different tiers.",
      "Personalisation, like a name on a pen or mug, lifts a generic item into a memorable one.",
      "For bulk orders, ask for a sample first and confirm delivery timelines before the festival rush.",
    ],
    link: { href: "/shop?occasion=corporate", label: "Shop corporate gifts" },
  },
];
