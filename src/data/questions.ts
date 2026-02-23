import { Question } from "@/types";

export const questions: Question[] = [
  // ============================================
  // SELF-SELECT SECTION (nature: choose, type: PREFERENCE)
  // ============================================
  {
    id: "billionaire-mansion",
    section: "self-select",
    nature: "choose",
    type: "PREFERENCE",
    title: "Billionaire Mansion",
    prompt: "Which mansion would you live in?",
    emoji: "🏰",
    coverImageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    options: [
      {
        id: "mansion-modern",
        title: "Modern Glass Mansion",
        imageUrl:
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        tags: ["minimalist", "modern", "sleek"],
      },
      {
        id: "mansion-tropical",
        title: "Tropical Villa",
        imageUrl:
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
        tags: ["tropical", "chill", "nature"],
      },
      {
        id: "mansion-castle",
        title: "European Castle",
        imageUrl:
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
        tags: ["classic", "royal", "old-money"],
      },
      {
        id: "mansion-penthouse",
        title: "NYC Penthouse",
        imageUrl:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        tags: ["urban", "modern", "ambitious"],
      },
      {
        id: "mansion-cabin",
        title: "Luxury Mountain Lodge",
        imageUrl:
          "https://images.unsplash.com/photo-1759281944287-9173dc7018e7?w=800&q=80",
        tags: ["cozy", "nature", "adventurous"],
      },
    ],
  },
  {
    id: "dream-prom-dress",
    section: "self-select",
    nature: "choose",
    type: "PREFERENCE",
    title: "Dream Prom Dress",
    prompt: "Which dress are you wearing?",
    emoji: "👗",
    coverImageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    options: [
      {
        id: "dress-red-gown",
        title: "Red Satin Gown",
        imageUrl:
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
        tags: ["bold", "glamorous", "classic"],
      },
      {
        id: "dress-fairy",
        title: "Fairy Tulle",
        imageUrl:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
        tags: ["dreamy", "romantic", "whimsical"],
      },
      {
        id: "dress-black-mini",
        title: "Black Mini",
        imageUrl:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
        tags: ["edgy", "modern", "bold"],
      },
      {
        id: "dress-sparkle",
        title: "Gold Sparkle",
        imageUrl:
          "https://images.unsplash.com/photo-1761164920854-7fadab441b25?w=800&q=80",
        tags: ["glamorous", "extra", "confident"],
      },
      {
        id: "dress-pastel",
        title: "Pastel Flowy",
        imageUrl:
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
        tags: ["soft", "romantic", "dreamy"],
      },
    ],
  },
  {
    id: "which-bunny",
    section: "self-select",
    nature: "choose",
    type: "PREFERENCE",
    title: "Which Bunny Am I",
    prompt: "Which bunny matches your energy?",
    emoji: "🐰",
    coverImageUrl:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80",
    options: [
      {
        id: "bunny-fluffy",
        title: "Fluffy Cloud Bunny",
        imageUrl:
          "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80",
        tags: ["soft", "cozy", "gentle"],
      },
      {
        id: "bunny-lop",
        title: "Floppy Lop Bunny",
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1661832480567-68a86cb46f34?w=800&q=80",
        tags: ["chill", "gentle", "sweet"],
      },
      {
        id: "bunny-wild",
        title: "Wild Adventure Bunny",
        imageUrl:
          "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=800&q=80",
        tags: ["adventurous", "bold", "energetic"],
      },
      {
        id: "bunny-baby",
        title: "Tiny Baby Bunny",
        imageUrl:
          "https://images.unsplash.com/photo-1664781211050-fa042bfc7709?w=800&q=80",
        tags: ["sweet", "innocent", "soft"],
      },
      {
        id: "bunny-elegant",
        title: "Elegant Show Bunny",
        imageUrl:
          "https://images.unsplash.com/photo-1602557496847-11ea01879c87?w=800&q=80",
        tags: ["elegant", "confident", "glamorous"],
      },
    ],
  },
  {
    id: "which-color",
    section: "self-select",
    nature: "choose",
    type: "PREFERENCE",
    title: "Which Color Am I",
    prompt: "Which color represents you?",
    emoji: "🎨",
    coverImageUrl:
      "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&q=80",
    options: [
      {
        id: "color-ocean-blue",
        title: "Ocean Blue",
        imageUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        tags: ["calm", "deep", "chill"],
      },
      {
        id: "color-sunset-orange",
        title: "Sunset Orange",
        imageUrl:
          "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80",
        tags: ["warm", "energetic", "bold"],
      },
      {
        id: "color-forest-green",
        title: "Forest Green",
        imageUrl:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
        tags: ["nature", "grounded", "calm"],
      },
      {
        id: "color-lavender",
        title: "Dreamy Lavender",
        imageUrl:
          "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&q=80",
        tags: ["dreamy", "soft", "whimsical"],
      },
      {
        id: "color-cherry-red",
        title: "Cherry Red",
        imageUrl:
          "https://images.unsplash.com/photo-1655129870529-f7cdc464a372?w=800&q=80",
        tags: ["bold", "passionate", "confident"],
      },
    ],
  },
  {
    id: "which-flower",
    section: "self-select",
    nature: "choose",
    type: "PREFERENCE",
    title: "Which Flower Am I",
    prompt: "Which flower are you?",
    emoji: "🌸",
    coverImageUrl:
      "https://images.unsplash.com/photo-1655129870529-f7cdc464a372?w=800&q=80",
    options: [
      {
        id: "flower-rose",
        title: "Classic Rose",
        imageUrl:
          "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80",
        tags: ["classic", "romantic", "passionate"],
      },
      {
        id: "flower-sunflower",
        title: "Bright Sunflower",
        imageUrl:
          "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&q=80",
        tags: ["warm", "energetic", "cheerful"],
      },
      {
        id: "flower-cherry-blossom",
        title: "Cherry Blossom",
        imageUrl:
          "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80",
        tags: ["dreamy", "gentle", "whimsical"],
      },
      {
        id: "flower-lavender",
        title: "Wild Lavender",
        imageUrl:
          "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&q=80",
        tags: ["calm", "soft", "nature"],
      },
      {
        id: "flower-daisy",
        title: "Simple Daisy",
        imageUrl:
          "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&q=80",
        tags: ["sweet", "innocent", "cheerful"],
      },
    ],
  },
  {
    id: "which-princess",
    section: "self-select",
    nature: "choose",
    type: "PREFERENCE",
    title: "Which Princess Am I",
    prompt: "Which princess is your vibe?",
    emoji: "👑",
    coverImageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    options: [
      {
        id: "princess-warrior",
        title: "Warrior Princess",
        imageUrl:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
        tags: ["bold", "adventurous", "confident"],
      },
      {
        id: "princess-fairy-tale",
        title: "Fairy Tale Princess",
        imageUrl:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
        tags: ["dreamy", "romantic", "classic"],
      },
      {
        id: "princess-rebel",
        title: "Rebel Princess",
        imageUrl:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        tags: ["edgy", "bold", "independent"],
      },
      {
        id: "princess-nature",
        title: "Nature Princess",
        imageUrl:
          "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=800&q=80",
        tags: ["nature", "gentle", "grounded"],
      },
      {
        id: "princess-ice",
        title: "Ice Queen",
        imageUrl:
          "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
        tags: ["elegant", "cool", "mysterious"],
      },
    ],
  },

  // ============================================
  // ALGORITHM SECTION (nature: guess, type: IDENTITY)
  // ============================================
  {
    id: "horror-character",
    section: "algorithm",
    nature: "guess",
    type: "IDENTITY",
    title: "Horror Character",
    prompt: "Which horror character would your friend be?",
    emoji: "🔪",
    coverImageUrl:
      "https://plus.unsplash.com/premium_photo-1723877219812-c3d2f114d3a9?w=800&q=80",
    options: [
      {
        id: "horror-ghost",
        title: "Silent Ghost",
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1723877219812-c3d2f114d3a9?w=800&q=80",
        tags: ["mysterious", "quiet", "ethereal"],
      },
      {
        id: "horror-vampire",
        title: "Elegant Vampire",
        imageUrl:
          "https://images.unsplash.com/photo-1761414140137-9d6a3c704a8d?w=800&q=80",
        tags: ["elegant", "dramatic", "classic"],
      },
      {
        id: "horror-witch",
        title: "Mysterious Witch",
        imageUrl:
          "https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?w=800&q=80",
        tags: ["mysterious", "independent", "wise"],
      },
      {
        id: "horror-zombie",
        title: "Chaotic Zombie",
        imageUrl:
          "https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=800&q=80",
        tags: ["chaotic", "energetic", "wild"],
      },
      {
        id: "horror-monster",
        title: "Friendly Monster",
        imageUrl:
          "https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?w=800&q=80",
        tags: ["sweet", "misunderstood", "gentle"],
      },
    ],
  },
  {
    id: "cartoon-sidekick",
    section: "algorithm",
    nature: "guess",
    type: "IDENTITY",
    title: "Cartoon Sidekick",
    prompt: "Which cartoon sidekick is your friend?",
    emoji: "🧸",
    coverImageUrl:
      "https://images.unsplash.com/photo-1746352066879-8f2604b5bf41?w=800&q=80",
    options: [
      {
        id: "sidekick-loyal",
        title: "Loyal Companion",
        imageUrl:
          "https://images.unsplash.com/photo-1746352066879-8f2604b5bf41?w=800&q=80",
        tags: ["loyal", "dependable", "sweet"],
      },
      {
        id: "sidekick-funny",
        title: "Comic Relief",
        imageUrl:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
        tags: ["funny", "energetic", "chaotic"],
      },
      {
        id: "sidekick-smart",
        title: "Brainiac Buddy",
        imageUrl:
          "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
        tags: ["smart", "wise", "calm"],
      },
      {
        id: "sidekick-brave",
        title: "Tiny But Brave",
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1661508614319-b5e40d1143bb?w=800&q=80",
        tags: ["brave", "bold", "adventurous"],
      },
      {
        id: "sidekick-chill",
        title: "Chill Vibes Only",
        imageUrl:
          "https://images.unsplash.com/photo-1760214694267-473ee4d07280?w=800&q=80",
        tags: ["chill", "calm", "easygoing"],
      },
    ],
  },
  {
    id: "reality-show",
    section: "algorithm",
    nature: "guess",
    type: "IDENTITY",
    title: "Reality Show Cast",
    prompt: "Which reality show role fits your friend?",
    emoji: "📺",
    coverImageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    options: [
      {
        id: "reality-drama",
        title: "The Drama Queen",
        imageUrl:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
        tags: ["dramatic", "bold", "extra"],
      },
      {
        id: "reality-strategist",
        title: "The Strategist",
        imageUrl:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        tags: ["smart", "ambitious", "calculated"],
      },
      {
        id: "reality-sweetheart",
        title: "The Sweetheart",
        imageUrl:
          "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
        tags: ["sweet", "gentle", "loyal"],
      },
      {
        id: "reality-villain",
        title: "The Loveable Villain",
        imageUrl:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        tags: ["edgy", "confident", "dramatic"],
      },
      {
        id: "reality-wildcard",
        title: "The Wildcard",
        imageUrl:
          "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80",
        tags: ["chaotic", "wild", "unpredictable"],
      },
    ],
  },
  {
    id: "zodiac-energy",
    section: "algorithm",
    nature: "guess",
    type: "IDENTITY",
    title: "Zodiac Energy",
    prompt: "Which zodiac energy does your friend give?",
    emoji: "♈",
    coverImageUrl:
      "https://images.unsplash.com/photo-1570041544732-7690bf144593?w=800&q=80",
    options: [
      {
        id: "zodiac-fire",
        title: "Fire Sign Energy",
        imageUrl:
          "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80",
        tags: ["bold", "passionate", "energetic"],
      },
      {
        id: "zodiac-earth",
        title: "Earth Sign Energy",
        imageUrl:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
        tags: ["grounded", "dependable", "calm"],
      },
      {
        id: "zodiac-air",
        title: "Air Sign Energy",
        imageUrl:
          "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
        tags: ["free-spirited", "social", "whimsical"],
      },
      {
        id: "zodiac-water",
        title: "Water Sign Energy",
        imageUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        tags: ["deep", "emotional", "mysterious"],
      },
      {
        id: "zodiac-mystery",
        title: "Mystery Energy",
        imageUrl:
          "https://images.unsplash.com/photo-1570041544732-7690bf144593?w=800&q=80",
        tags: ["mysterious", "unpredictable", "independent"],
      },
    ],
  },
];

// Helper functions
export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function getOptionById(
  questionId: string,
  optionId: string
): { question: Question; option: Question["options"][0] } | undefined {
  const question = getQuestionById(questionId);
  if (!question) return undefined;
  const option = question.options.find((o) => o.id === optionId);
  if (!option) return undefined;
  return { question, option };
}

export function getQuestionsBySection(
  section: "self-select" | "algorithm"
): Question[] {
  return questions.filter((q) => q.section === section);
}
