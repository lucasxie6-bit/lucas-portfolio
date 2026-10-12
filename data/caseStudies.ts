// What each project page (/work/[slug]) shows. Text in [brackets] is a placeholder waiting for real copy.
export interface CaseStudy {
  slug: string;
  name: string;
  kind: string;
  year: string;
  line: string;
  meta: { role: string; timeline: string; platform: string };
  /** Phone screens shown side by side in the hero panel; leave out for a placeholder. */
  heroScreens?: { src: string; alt: string }[];
  /** A single wide image for the hero panel. */
  heroImage?: { src: string; alt: string };
  /** A self-contained animated page (in /public) shown in the hero panel, framed at 16:9. */
  heroEmbed?: { src: string; title: string };
  overview: string;
  /** One sentence that sums up the problem, shown large. */
  problem: string;
  solution: { title: string; line: string }[];
  role: string;
  outcome: string;
  gallery: { src: string; alt: string }[];
}

const screens = (name: string, list: [string, string][]) =>
  list.map(([file, alt]) => ({ src: `/${name}-screen-${file}.svg`, alt }));

export const caseStudies: CaseStudy[] = [
  {
    slug: "useno",
    name: "useno",
    kind: "startup",
    year: "2026",
    line: "internship discovery and application tracking, in one place.",
    meta: { role: "[role]", timeline: "[timeline]", platform: "[web / mobile]" },
    heroEmbed: { src: "/useno-spotlight/index.html", title: "Animated walkthrough of the useno.app homepage" },
    overview:
      "useno helps students find internships worth applying to, then keeps every application in one place: search and filters, saved opportunities, and a tracker for where each one stands.",
    problem: "[the one sentence that sums up the problem]",
    solution: [
      { title: "internship discovery", line: "[one line on what it does]" },
      { title: "search and filters", line: "[one line on what it does]" },
      { title: "saved opportunities", line: "[one line on what it does]" },
      { title: "application tracking", line: "[one line on what it does]" },
    ],
    role: "[what you did on useno]",
    outcome: "[what came of it]",
    gallery: [],
  },
  {
    slug: "sponty",
    name: "sponty",
    kind: "case study",
    year: "2026",
    line: "spontaneous hangouts in three taps.",
    meta: { role: "product design", timeline: "[timeline]", platform: "mobile" },
    heroScreens: screens("sponty", [
      ["01-map", "Map home screen showing active hangouts as pins"],
      ["02-create", "Create a hangout screen with vibe, time limit, and group size options"],
      ["03-capture", "Built-in camera screen for capturing the moment"],
      ["04-memories", "Memories screen showing saved and recapped hangouts"],
    ]),
    overview:
      "Sponty is a mobile app that turns \"I'm bored\" into \"let's hang out\" in three taps. Instead of planning days ahead, you post what you're doing right now, like grabbing coffee or heading to the park, and nearby friends can join on the spot.",
    problem: "Making plans takes so much back-and-forth that most people just stay home.",
    solution: [
      { title: "spontaneity over planning", line: "Hangouts happen in the moment, not days later." },
      { title: "buttons over typing", line: "Pre-built activities like coffee, park, study and food." },
      { title: "expiration by design", line: "Every post disappears after 30 minutes, 1 hour or 2 hours." },
      { title: "map-first", line: "One screen with pins, instead of a feed and a map." },
    ],
    role:
      "Owned the product design end to end: competitive analysis of what made early Snapchat and Houseparty feel fun, the core interaction model, wireframes for the post flow and map, and the privacy and safety edge cases.",
    outcome:
      "A focused, single-purpose app: one primary screen, one core action, one clear lifecycle (post, join, expire). Leaving out chat and stories keeps Sponty about real spontaneity, not another feed to scroll.",
    gallery: [],
  },
  {
    slug: "spark",
    name: "spark",
    kind: "case study",
    year: "2026",
    line: "earn the answer. build the thinking.",
    meta: { role: "product design", timeline: "[timeline]", platform: "[platform]" },
    heroScreens: screens("spark", [
      ["01-home", "Home screen showing Spark Score and progress toward Thinker status"],
      ["02-tiered", "Tiered help screen with hints and guiding questions"],
      ["03-redirect", "Spark redirecting a do-it-for-me request into guided help"],
      ["04-status", "Spark Status screen showing level breakdown from Assisted to Thinker"],
    ]),
    overview:
      "Spark is an app designed to break the habit of defaulting to AI for instant answers. It asks you to think first, and treats AI as a second opinion rather than a first resort.",
    problem: "When AI can answer anything instantly, people stop forming their own opinions first.",
    solution: [
      { title: "think first, unlock after", line: "Try your own answer before the AI one opens up." },
      { title: "tiered help", line: "Hints and guiding questions earn points; full answers stay locked." },
      { title: "guided redirects", line: "\"Do it for me\" requests turn into guided help." },
      { title: "spark status", line: "Levels from Assisted to Thinker show your progress." },
    ],
    role:
      "Led product design, from defining the core \"think first, unlock after\" mechanic to designing the unlock flow, the feedback prompts, and the balance between friction and reward.",
    outcome:
      "A clear, repeatable interaction model that nudges people toward reflection without feeling like a punishment, turning AI into a second opinion instead of a first resort.",
    gallery: [],
  },
  {
    slug: "grove",
    name: "grove",
    kind: "case study",
    year: "2026",
    line: "turning everyday receipts into small, doable steps toward less waste.",
    meta: { role: "product design", timeline: "[timeline]", platform: "[platform]" },
    heroScreens: screens("grove", [
      ["01-scan", "Scan receipt screen"],
      ["02-impact", "Impact results screen showing CO2 and water use with relatable comparisons"],
      ["03-seeds", "Seeds and progress tracking screen showing completed swaps"],
      ["04-action", "Completed seed screen with congratulations"],
    ]),
    overview:
      "Grove turns everyday receipts into a personal sustainability tracker. Scan a receipt and see the carbon and water cost behind what you bought, in numbers you can picture, then get one simple swap to try next time.",
    problem: "People want to buy more sustainably, but nothing connects everyday spending to its footprint.",
    solution: [
      { title: "scan a receipt", line: "Plant it in your grove with one photo." },
      { title: "see the impact", line: "Carbon and water, translated into things you can picture." },
      { title: "one small swap", line: "A single suggestion, like lentils instead of beef once a week." },
      { title: "watch it grow", line: "Every swap you complete grows your grove." },
    ],
    role:
      "Led the design end to end: research into how people think about sustainable shopping, mapping the scan-to-action flow, and designing and prototyping the full UI in Figma.",
    outcome:
      "A lightweight, encouraging tool that makes sustainability feel doable: large, readable numbers, one suggestion at a time, and a layout that doesn't ask much of you.",
    gallery: [
      { src: "/research-insights.svg", alt: "Research and insights" },
      { src: "/mappingthescan-to-actionflow.svg", alt: "Mapping the scan-to-action flow" },
      { src: "/visualdesignexploration.svg", alt: "Visual design exploration" },
    ],
  },
  {
    slug: "alvarez",
    name: "alvarez",
    kind: "brand",
    year: "2024",
    line: "brand and storefront direction for an apparel label.",
    meta: { role: "brand & ecommerce", timeline: "[timeline]", platform: "shopify" },
    heroImage: { src: "/alvarez1.png", alt: "Alvarez hoodie front and back mockup" },
    overview:
      "Alvarez was an apparel brand project that turned an early fashion concept into a concrete ecommerce direction: market research, brand positioning, visual design exploration, and planning a Shopify store.",
    problem: "A broad apparel idea needed a clear customer, a position and an online home before it could launch.",
    solution: [
      { title: "market research", line: "Competitors, pricing, and how they present product." },
      { title: "two design directions", line: "Dark streetwear, and a cleaner retail look." },
      { title: "storefront structure", line: "How the Shopify site is laid out and shopped." },
      { title: "product mockups", line: "Colour and graphic placement on real garments." },
    ],
    role:
      "Led market research, ecommerce planning and design direction: competitor review, Shopify site structure, visual concepts, and turning the business idea into two possible brand directions.",
    outcome:
      "Two distinct design concepts, a clearer brand direction, and a stronger foundation for a Shopify storefront, moving a loose fashion concept toward a launch-ready shop.",
    gallery: [
      { src: "/alvarez2.jpg", alt: "Alvarez graphic placement exploration" },
      { src: "/moodboard1.png", alt: "Alvarez dark streetwear direction" },
      { src: "/moodboard2.png", alt: "Alvarez cleaner ecommerce direction" },
    ],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
