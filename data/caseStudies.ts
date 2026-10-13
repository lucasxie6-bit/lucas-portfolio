// What each project page (/work/[slug]) shows. Text in [brackets] is a placeholder waiting for real copy.
export interface CaseStudy {
  slug: string;
  name: string;
  kind: string;
  year: string;
  line: string;
  /** The big line under the product shot; defaults to `line`. **Double asterisks** fade words out. */
  headline?: string;
  /** The project's colour, used for its big name. */
  accent: string;
  /** Colour for the small section labels; defaults to the accent. */
  tint?: string;
  meta: { role: string; timeline: string; platform: string };
  /** Phone screens shown side by side in the hero panel; leave out for a placeholder. */
  heroScreens?: { src: string; alt: string }[];
  /** A single wide image for the hero panel. */
  heroImage?: { src: string; alt: string };
  /** A self-contained animated page (in /public) shown in the hero panel, framed at 16:9. */
  heroEmbed?: { src: string; title: string };
  /** An optional headline shown above the overview paragraph; **double asterisks** pick words out in the tint. */
  overviewLead?: string;
  /** One paragraph, or a pair of short labelled cards (the problem, then what was built). */
  overview: string | { label: string; text: string }[];
  /** Show a drawn before/after in place of the overview text (the text stays as its description for screen readers). */
  overviewVisual?: "before-after";
  /** The question the project answers, shown in a callout at the end of the context. Wrap words in **double
   *  asterisks** to pick them out; the overview paragraph supports the same. */
  problem: string;
  /** Optional research section between the problem and the solution. */
  research?: {
    lead: string;
    paragraphs: string[];
    /** The annotated comparison of real searches; leave `src` out until there's a real screenshot. */
    evidence?: { src?: string; alt: string; caption: string };
    /** A count of how many first-page listings on each board say who can apply; shown instead of `evidence`. */
    chart?: {
      title: string;
      note: string;
      rows: { name: string; logo: "linkedin" | "simplify"; hits: number; total: number }[];
    };
    insight: string;
  };
  /** Optional design-exploration section between the research and the solution. */
  exploration?: { lead: string; paragraphs: string[]; closing: string };
  solution: { title: string; line: string }[];
  /** The interface choices that were made and why; shown as "Key Design Decisions" in place of `solution`. */
  decisions?: { title: string; why: string }[];
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
    accent: "#1B2D58",
    tint: "#5A6E9F",
    kind: "startup",
    year: "2026",
    line: "Internship discovery and application tracking, in one place.",
    headline: "Find and track internships **in one place.**",
    meta: { role: "Founder, designer, developer", timeline: "June 2026 – present", platform: "Responsive web app" },
    heroEmbed: { src: "/useno-spotlight/index.html", title: "Animated walkthrough of the useno.app homepage" },
    overviewLead: "The right roles were buried in **the wrong ones.**",
    overviewVisual: "before-after",
    overview: [
      { label: "The problem", text: "Job boards gave me hundreds of listings, but finding ones I actually qualified for was another story." },
      {
        label: "What I built",
        text: "useno surfaces student-relevant internships directly from company career pages, with saving and application tracking in one place.",
      },
    ],
    problem: "How might students find internships they **qualify for**, before they **close**?",
    research: {
      lead: "More listings didn't mean **better opportunities.**",
      paragraphs: [
        "I looked at how job boards surface internships, judging relevance, eligibility and fit for experience.",
      ],
      chart: {
        title: "Which listings say who can apply?",
        note: "First page of results for “software engineering intern, New York”.",
        rows: [
          { name: "LinkedIn", logo: "linkedin", hits: 2, total: 25 },
          { name: "Simplify", logo: "simplify", hits: 0, total: 21 },
        ],
      },
      insight: "Students don't need more listings. They need a better way to find the right ones.",
    },
    exploration: {
      lead: "Make the right opportunities **easier to recognize.**",
      paragraphs: ["Less time checking whether you qualify, more time on internships worth pursuing."],
      closing: "The goal wasn't to show students more jobs. It was to help them make better decisions about **the ones they found.**",
    },
    solution: [],
    decisions: [
      { title: "Search in plain words", why: "[Why students describe the role instead of building a query]" },
      { title: "Listings straight from career pages", why: "[Why useno pulls from company sites instead of job boards]" },
      { title: "Eligibility before everything", why: "[Why “can I apply?” leads each card]" },
      { title: "Saving and tracking in one place", why: "[Why the shortlist and the applications live together]" },
    ],
    role: "[What you did on Useno]",
    outcome: "[What came of it]",
    gallery: [],
  },
  {
    slug: "sponty",
    name: "sponty",
    accent: "#4A3F6B",
    kind: "case study",
    year: "2026",
    line: "Spontaneous hangouts in three taps.",
    meta: { role: "Product designer", timeline: "[Timeline]", platform: "Mobile app" },
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
      { title: "Spontaneity over planning", line: "Hangouts happen in the moment, not days later." },
      { title: "Buttons over typing", line: "Pre-built activities like coffee, park, study and food." },
      { title: "Expiration by design", line: "Every post disappears after 30 minutes, 1 hour or 2 hours." },
      { title: "Map-first", line: "One screen with pins, instead of a feed and a map." },
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
    accent: "#3B2F6B",
    kind: "case study",
    year: "2026",
    line: "Earn the answer. Build the thinking.",
    meta: { role: "Product designer", timeline: "[Timeline]", platform: "[Platform]" },
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
      { title: "Think first, unlock after", line: "Try your own answer before the AI one opens up." },
      { title: "Tiered help", line: "Hints and guiding questions earn points; full answers stay locked." },
      { title: "Guided redirects", line: "\"Do it for me\" requests turn into guided help." },
      { title: "Spark status", line: "Levels from Assisted to Thinker show your progress." },
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
    accent: "#3E2419",
    kind: "case study",
    year: "2026",
    line: "Turning everyday receipts into small, doable steps toward less waste.",
    meta: { role: "Product designer", timeline: "[Timeline]", platform: "[Platform]" },
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
      { title: "Scan a receipt", line: "Plant it in your grove with one photo." },
      { title: "See the impact", line: "Carbon and water, translated into things you can picture." },
      { title: "One small swap", line: "A single suggestion, like lentils instead of beef once a week." },
      { title: "Watch it grow", line: "Every swap you complete grows your grove." },
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
    accent: "#2A2722",
    kind: "brand",
    year: "2024",
    line: "Brand and storefront direction for an apparel label.",
    meta: { role: "Brand and ecommerce", timeline: "[Timeline]", platform: "Shopify" },
    heroImage: { src: "/alvarez1.png", alt: "Alvarez hoodie front and back mockup" },
    overview:
      "Alvarez was an apparel brand project that turned an early fashion concept into a concrete ecommerce direction: market research, brand positioning, visual design exploration, and planning a Shopify store.",
    problem: "A broad apparel idea needed a clear customer, a position and an online home before it could launch.",
    solution: [
      { title: "Market research", line: "Competitors, pricing, and how they present product." },
      { title: "Two design directions", line: "Dark streetwear, and a cleaner retail look." },
      { title: "Storefront structure", line: "How the Shopify site is laid out and shopped." },
      { title: "Product mockups", line: "Colour and graphic placement on real garments." },
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
