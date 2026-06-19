import type { Product } from "./types";

export const products: Product[] = [
  {
    id: "yirgacheffe-natural",
    slug: "yirgacheffe-natural",
    category: "coffee",
    name: {
      en: "Yirgacheffe Natural",
      fr: "Yirgacheffe Naturel",
    },
    origin: {
      en: "Ethiopia · Gedeb",
      fr: "Éthiopie · Gedeb",
    },
    roast: "light",
    tastingNotes: {
      en: ["Blueberry", "Jasmine", "Honey"],
      fr: ["Bleuet", "Jasmin", "Miel"],
    },
    description: {
      en: "Sun-dried in raised beds at 2,100m. Bright, floral, and unmistakably Yirgacheffe — like fruit you didn't know coffee could taste like.",
      fr: "Séché au soleil sur lits surélevés à 2 100 m. Lumineux, floral, indéniablement Yirgacheffe — un fruit qu'on ne soupçonnait pas dans le café.",
    },
    priceCents: 2400,
    weightGrams: 340,
    imageUrl: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=1200&q=80",
    featured: true,
    inStock: true,
  },
  {
    id: "huila-pink-bourbon",
    slug: "huila-pink-bourbon",
    category: "coffee",
    name: {
      en: "Huila Pink Bourbon",
      fr: "Huila Bourbon Rose",
    },
    origin: {
      en: "Colombia · Huila",
      fr: "Colombie · Huila",
    },
    roast: "medium",
    tastingNotes: {
      en: ["Red apple", "Caramel", "Almond"],
      fr: ["Pomme rouge", "Caramel", "Amande"],
    },
    description: {
      en: "From a single farm in Pitalito. Pink Bourbon is a rare cultivar — soft acidity, balanced sweetness, an everyday cup that punches above its weight.",
      fr: "D'une seule ferme à Pitalito. Le Bourbon Rose est un cultivar rare — acidité douce, sucrosité équilibrée, une tasse du quotidien qui surpasse les attentes.",
    },
    priceCents: 2100,
    weightGrams: 340,
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80",
    featured: true,
    inStock: true,
  },
  {
    id: "signature-beaubien",
    slug: "signature-beaubien",
    category: "coffee",
    name: {
      en: "Signature Beaubien",
      fr: "Signature Beaubien",
    },
    origin: {
      en: "Blend · Brazil · Guatemala · Ethiopia",
      fr: "Mélange · Brésil · Guatemala · Éthiopie",
    },
    roast: "medium-dark",
    tastingNotes: {
      en: ["Dark chocolate", "Hazelnut", "Brown sugar"],
      fr: ["Chocolat noir", "Noisette", "Cassonade"],
    },
    description: {
      en: "Our house blend, named for the street where we started. Built for milk drinks but rich enough to drink black. The cup that built the business.",
      fr: "Notre mélange maison, baptisé du nom de la rue où tout a commencé. Conçu pour les boissons lactées, assez riche pour le boire noir. La tasse qui a fondé l'entreprise.",
    },
    priceCents: 1900,
    weightGrams: 340,
    imageUrl: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=1200&q=80",
    featured: true,
    inStock: true,
  },
  {
    id: "antigua-bourbon",
    slug: "antigua-bourbon",
    category: "coffee",
    name: {
      en: "Antigua Bourbon",
      fr: "Antigua Bourbon",
    },
    origin: {
      en: "Guatemala · Antigua",
      fr: "Guatemala · Antigua",
    },
    roast: "medium",
    tastingNotes: {
      en: ["Milk chocolate", "Orange", "Toffee"],
      fr: ["Chocolat au lait", "Orange", "Toffee"],
    },
    description: {
      en: "Grown in volcanic soil between three volcanoes. Classic, balanced, the kind of coffee you can drink three cups of without thinking.",
      fr: "Cultivé dans un sol volcanique entre trois volcans. Classique, équilibré, le café qu'on boit trois fois sans y penser.",
    },
    priceCents: 2000,
    weightGrams: 340,
    imageUrl: "https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=1200&q=80",
    inStock: true,
  },
  {
    id: "espresso-nonna",
    slug: "espresso-nonna",
    category: "coffee",
    name: {
      en: "Espresso Nonna",
      fr: "Espresso Nonna",
    },
    origin: {
      en: "Blend · Brazil · India",
      fr: "Mélange · Brésil · Inde",
    },
    roast: "espresso",
    tastingNotes: {
      en: ["Cocoa", "Roasted nut", "Molasses"],
      fr: ["Cacao", "Noix grillée", "Mélasse"],
    },
    description: {
      en: "An old-school Italian-style espresso. Heavy body, syrupy crema, no acidity to fight you in the morning.",
      fr: "Un espresso à l'italienne, à l'ancienne. Corps lourd, crema sirupeuse, sans acidité pour vous brusquer le matin.",
    },
    priceCents: 1800,
    weightGrams: 340,
    imageUrl: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=1200&q=80",
    inStock: true,
  },
  {
    id: "earl-grey-supreme",
    slug: "earl-grey-supreme",
    category: "tea",
    name: {
      en: "Earl Grey Supreme",
      fr: "Earl Grey Suprême",
    },
    origin: {
      en: "India · Ceylon · Bergamot",
      fr: "Inde · Ceylan · Bergamote",
    },
    tastingNotes: {
      en: ["Bergamot", "Black tea", "Citrus zest"],
      fr: ["Bergamote", "Thé noir", "Zeste d'agrumes"],
    },
    description: {
      en: "Assam and Ceylon base with real bergamot oil and a touch of cornflower. Bright, fragrant, a proper afternoon tea.",
      fr: "Base d'Assam et de Ceylan avec véritable huile de bergamote et une touche de bleuet. Lumineux, parfumé, un vrai thé d'après-midi.",
    },
    priceCents: 1400,
    weightGrams: 100,
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=1200&q=80",
    inStock: true,
  },
  {
    id: "discovery-trio",
    slug: "discovery-trio",
    category: "gift",
    name: {
      en: "Discovery Trio",
      fr: "Trio Découverte",
    },
    description: {
      en: "Three single-origin coffees, 150g each, in a kraft gift box. The easiest way to introduce someone to the good stuff.",
      fr: "Trois cafés d'origine unique, 150 g chacun, dans une boîte cadeau en kraft. La façon la plus simple d'initier quelqu'un.",
    },
    priceCents: 4500,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
    featured: true,
    inStock: true,
  },
  {
    id: "moka-pot-bialetti",
    slug: "moka-pot-bialetti",
    category: "gift",
    name: {
      en: "Moka Pot · 6 cups",
      fr: "Cafetière moka · 6 tasses",
    },
    description: {
      en: "The classic Italian stovetop. Pair it with a bag of Espresso Nonna and you've made someone's morning for a decade.",
      fr: "La classique italienne sur cuisinière. Associez-la à un sac d'Espresso Nonna et vous faites les matins de quelqu'un pendant dix ans.",
    },
    priceCents: 5200,
    imageUrl: "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=1200&q=80",
    inStock: true,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function listProducts(category?: Product["category"]): Product[] {
  if (!category) return products;
  return products.filter((p) => p.category === category);
}

export function listFeatured(): Product[] {
  return products.filter((p) => p.featured);
}
