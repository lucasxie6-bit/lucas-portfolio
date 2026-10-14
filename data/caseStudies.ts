// What each project page (/work/[slug]) shows. Text in [brackets] is a placeholder waiting for real copy.
export interface CaseStudy {
  slug: string;
  name: string;
  kind: string;
  year: string;
  line: string;
  /** The big line under the product shot; defaults to `line`. **Double asterisks** fade words out. */
  headline?: string;
  /** The live product, linked under the headline. */
  liveUrl?: string;
  /** The project's colour, used for its big name. */
  accent: string;
  /** Colour for the small section labels; defaults to the accent. */
  tint?: string;
  /** The neutral behind the product shot and screen rows; defaults to a cool grey. */
  panel?: string;
  /** The soft gradient behind phone screens in rows and sequences; defaults to sponty's pastel. */
  wash?: string;
  /** Rename sections for this project, e.g. outcome → "Final concept" when nothing was measured. */
  labels?: Partial<Record<string, string>>;
  /** Headlines above the solution and key-decision lists. **Double asterisks** tint words. */
  solutionLead?: string;
  /** Draw the solution as illustrated cards made for this study. */
  solutionArt?: "alvarez" | "spark";
  /** Show the role as one large sentence. */
  roleStatement?: boolean;
  /** Draw the outcome as a panel made for this study. */
  outcomeArt?: "alvarez";
  decisionsLead?: string;
  meta: { role: string; timeline: string; platform: string };
  /** Phone screens shown side by side in the hero panel; leave out for a placeholder. */
  heroScreens?: { src: string; alt: string }[];
  /** A single wide image for the hero panel. */
  heroImage?: { src: string; alt: string };
  /** A drawn hero built in code, shown in the hero panel at 16:9. */
  heroArt?: "sponty-map" | "grove-dots" | "alvarez-hoodie" | "spark-phone";
  /** A self-contained animated page (in /public) shown in the hero panel, framed at 16:9. */
  heroEmbed?: { src: string; title: string };
  /** An optional headline shown above the overview paragraph; **double asterisks** pick words out in the tint. */
  overviewLead?: string;
  /** One paragraph, or a pair of short labelled cards (the problem, then what was built). */
  overview: string | string[] | { label: string; text: string }[];
  /** Show a drawn before/after in place of the overview text (the text stays as its description for screen readers). */
  overviewVisual?: "before-after" | "chat" | "receipt" | "brief" | "spark-compare";
  /** For the "chat" context: a short line under the headline, and the group chat shown beside it. */
  overviewSub?: string;
  chat?: { from?: string; text: string; mine?: boolean; faded?: boolean }[];
  /** For the "receipt" context: a receipt's items with their footprint, the heaviest flagged, and one swap. */
  receipt?: { label: string; items: { name: string; value: number; heavy?: boolean }[]; swap: string; action: string };
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
  /** `src` puts a phone screen above the point. */
  /** `icon` draws a small illustration above the point; the points then show as a row of cards. */
  solution: {
    title: string;
    line: string;
    short?: string;
    src?: string;
    alt?: string;
    icon?: "receipt" | "number" | "sprout" | "dots";
  }[];
  /** The interface choices that were made and why; shown as "Key Design Decisions" in place of `solution`. */
  /** `embed` is a self-contained animation in /public, played in the card's 4:3 frame; `src` a still image. */
  /** `phone` marks `src` as a phone screen: the decisions then show as alternating rows, like sponty's solution. */
  decisions?: { title: string; line: string; visual?: string; src?: string; embed?: string; phone?: boolean }[];
  /** A drawn moodboard above text-only decisions, which then show as a swipeable row. */
  decisionsArt?: "sponty-mood";
  role: string | string[];
  /** A fuller role section: each hat worn with what it covered, then one closing line. Shown instead of `role`. */
  roleDetail?: { parts: { title: string; line: string }[]; closing?: string };
  /** A role told as one line and the steps owned, drawn as a row of shapes. Shown instead of `role`. */
  roleProcess?: { statement: string; steps: string[] };
  outcome: string;
  /** A fuller outcome section: a headline, big numbers, then paragraphs and what's next. Shown instead of `outcome`. */
  outcomeDetail?: {
    lead: string;
    stats?: { value: string; label: string }[];
    paragraphs: string[];
    /** A before/after: the chat that stalls, and the plan that happens instead. */
    compare?: { before: string[]; after: { title: string; sub: string; cta: string } };
    /** A quiet last line. */
    closing?: string;
    /** With stats and highlights: the words leading into the first number, shown on a bento of cards instead of the headline. */
    intro?: string;
    /** A sequence of phone screens, side by side, each with a short caption. */
    screens?: { src: string; alt: string; caption: string }[];
    /** Three phones on one panel: left, a larger raised centre, right. */
    trio?: { src: string; alt: string }[];
    /** Short wins shown under "Beyond the numbers". */
    highlights?: { title: string; line: string }[];
    next?: string;
  };
  /** `phone` shows the image as a phone screen instead of cropping it to 4:3. */
  gallery: { src: string; alt: string; phone?: boolean }[];
  /** A drawn bento of screens and cards, shown instead of the plain gallery. */
  galleryArt?: "sponty-bento" | "alvarez-reel" | "spark-screens";
}

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
    liveUrl: "https://useno.app",
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
      { title: "Search in plain words", line: "Matches how students talk, not recruiter keywords.", visual: "Search visual", embed: "/useno-decisions/01-search-in-plain-words.html" },
      { title: "Listings straight from career pages", line: "Pulled from the source, filtered for early career.", visual: "Career-page listings visual", embed: "/useno-decisions/02-listings-from-career-pages.html" },
      { title: "Eligibility before everything", line: "See if you qualify without opening the listing.", visual: "Eligibility visual", embed: "/useno-decisions/03-eligibility-before-everything.html" },
      { title: "Saving and tracking in one place", line: "Save, apply and track without leaving useno.", visual: "Saving and tracking visual", embed: "/useno-decisions/04-saving-and-tracking.html" },
    ],
    role: "Founder, product designer and developer.",
    roleDetail: {
      parts: [
        { title: "Founder", line: "Idea to 1,000 users" },
        { title: "Designer", line: "Wireframe to final UI" },
        { title: "Developer", line: "Prototype to launch" },
      ],
    },
    outcome: "From an idea to 1,000 users.",
    outcomeDetail: {
      lead: "From an idea to **1,000 users.**",
      intro: "From an idea to",
      stats: [
        { value: "1,000", label: "Users" },
        { value: "10,000+", label: "Job views" },
        { value: "2,000", label: "Job applications" },
      ],
      paragraphs: [],
      highlights: [
        { title: "Launched end to end", line: "Discovery, eligibility filtering and application tracking." },
        { title: "Automated sourcing", line: "Six ATS platforms and hundreds of company career sites." },
        { title: "Distribution into growth", line: "About 500–600 users from Reddit outreach in two to four weeks." },
      ],
      next: "Improving relevance, refining the search experience, and learning which opportunities students actually find valuable.",
    },
    gallery: [],
  },
  {
    slug: "sponty",
    name: "sponty",
    accent: "#4A3F6B",
    // Sponty's counterpart to useno's dusty blue: a dusty pink for labels and highlighted words.
    tint: "#B4608E",
    // A pale lavender-grey: still neutral, but in the same family as the map's lilac.
    panel: "#F3F1F7",
    kind: "case study",
    year: "2026",
    line: "Spontaneous hangouts in three taps.",
    headline: "Spontaneous hangouts **in three taps.**",
    meta: { role: "Product designer", timeline: "2026", platform: "Mobile app" },
    heroArt: "sponty-map",
    overviewLead: "When did hanging out become so **complicated?**",
    overviewVisual: "chat",
    overviewSub: "Sponty makes hanging out spontaneous again.",
    chat: [
      { from: "Maya", text: "we should hang soon!!" },
      { from: "Jordan", text: "yesss when r u free" },
      { from: "Maya", text: "maybe next week? \ud83d\ude05", faded: true },
      { text: "or\u2026 right now?", mine: true },
    ],
    overview: [
      "Somewhere between endless group chats, conflicting schedules and \"we should hang soon,\" making plans became more work than actually seeing your friends.",
      "Sponty is a mobile app designed to bring back spontaneous hangouts. Share what you're doing, see who's nearby, and turn an ordinary afternoon into something worth remembering.",
    ],
    problem: "Making plans takes so much back-and-forth that most people just stay home.",
    solution: [
      {
        title: "Spontaneity over scheduling",
        short: "Post what you\u2019re up to. Friends nearby join.",
        line: "Forget planning days ahead. Post what you're doing right now and let friends join.",
        src: "/sponty/welcome.jpg",
        alt: "A friend's invite on the map: Coffee and stroll at 2pm, three people going, with a Let's go button",
      },
      {
        title: "Three taps, zero friction",
        short: "Pick it, share it, go.",
        line: "Choose an activity, share your location, and you're live. No group chats or lengthy invitations.",
        src: "/sponty/create.jpg",
        alt: "The What's the vibe screen: a plan, a time limit, party size and who's invited",
      },
      {
        title: "Here now, gone later",
        short: "Plans expire on their own. No endless feed.",
        line: "Posts expire automatically. Sponty is built around what's happening now, not another endless feed.",
        src: "/sponty/memories.jpg",
        alt: "Your Memories: past hangouts collected by month",
      },
      {
        title: "Your friends, on a map",
        short: "See who\u2019s around at a glance.",
        line: "See what's happening around you at a glance. Less scrolling, more showing up.",
        src: "/sponty/map.jpg",
        alt: "The home map with friends shown as characters around you",
      },
    ],
    decisionsArt: "sponty-mood",
    decisions: [
      { title: "A 2016 kind of spontaneous", line: "Pastels, script and cartoons, when apps felt playful." },
      { title: "Characters, not profile photos", line: "Animal avatars make showing up low pressure." },
      { title: "Tap, don\u2019t type", line: "Time, party size and invites are one tap each." },
      { title: "Plans with a timer", line: "15, 30 or 45 minutes to join. It\u2019s about now." },
    ],
    role: [
      "I developed Sponty's product concept and designed the core experience, from the interaction model and user flows to the interface and visual identity.",
      "I focused on making spontaneous plans feel as effortless as the idea itself.",
    ],
    roleProcess: {
      statement: "I shaped Sponty end to end, so spontaneous plans feel as effortless as the idea.",
      steps: ["Concept", "Interaction model", "User flows", "Interface", "Visual identity"],
    },
    outcome: "Less planning. More living.",
    outcomeDetail: {
      lead: "Less planning. **More living.**",
      paragraphs: [],
      compare: {
        before: ["when r u free?", "idk maybe sat", "let me check", "\u2026"],
        after: { title: "Coffee and stroll @ 2pm", sub: "3 people going", cta: "Let\u2019s go!" },
      },
      closing: "Sometimes the best plans are the ones you never really made.",
    },
    galleryArt: "sponty-bento",
    gallery: [
      { src: "/sponty/add-friends.jpg", alt: "Add Friends: a QR code to scan, and a link to copy", phone: true },
      { src: "/sponty/character.jpg", alt: "Customize your character: pick an animal avatar and name", phone: true },
    ],
  },
  {
    slug: "spark",
    name: "spark",
    accent: "#3B2F6B",
    tint: "#4B4FA0",
    labels: { outcome: "Final concept" },
    kind: "case study",
    year: "2026",
    line: "Earn the answer. Build the thinking.",
    headline: "Earn the answer. **Build the thinking.**",
    meta: { role: "Product designer", timeline: "2026", platform: "Mobile app concept" },
    heroArt: "spark-phone",
    overviewLead: "When answers become instant, what happens to **learning?**",
    overviewVisual: "spark-compare",
    solutionArt: "spark",
    overview: [
      "AI can finish an assignment in seconds. But getting the answer isn\u2019t the same as understanding it.",
      "Spark explores a different relationship with AI: one that encourages students to think for themselves, ask better questions, and develop confidence in their own abilities.",
    ],
    problem: "When AI can answer anything instantly, students stop working things out for themselves.",
    solution: [
      { title: "Guidance over answers", line: "Instead of immediately giving students a solution, Spark encourages them to work through problems with questions and hints." },
      { title: "Help on your terms", line: "Students choose how much support they need, from a small hint to a guided outline, rather than receiving a complete answer by default." },
      { title: "Rewarding independent thinking", line: "A points system encourages students to rely less on AI, making the process of learning as rewarding as reaching an answer." },
      { title: "Making progress visible", line: "Progress through four stages, from Assisted to Thinker, gives students a tangible sense of their growing independence." },
    ],
    role: [
      "Designed Spark\u2019s core mobile experience, exploring how guided assistance, gamification, and progressive learning could encourage students to think independently.",
      "Focused on the interaction model, user flows, visual interface, and progression system.",
    ],
    outcome: "Less dependence. More confidence.",
    outcomeDetail: {
      lead: "Less dependence. **More confidence.**",
      paragraphs: [
        "Spark reimagines AI as a learning companion rather than an answer machine, using guided support and visible progress to make independent thinking the goal.",
      ],
    },
    galleryArt: "spark-screens",
    gallery: [],
  },
  {
    slug: "grove",
    name: "grove",
    accent: "#3E2419",
    tint: "#6B8A57",
    panel: "#F2F0E9",
    wash: "linear-gradient(160deg, #F6F1E7 0%, #EEF1E4 55%, #E6EEDF 100%)",
    labels: { outcome: "Final concept" },
    kind: "case study",
    year: "2026",
    line: "Turning everyday receipts into small, doable steps toward less waste.",
    headline: "Turning receipts into **small, doable steps.**",
    meta: { role: "Product designer", timeline: "2026", platform: "Mobile app" },
    heroArt: "grove-dots",
    overviewLead: "Sustainability shouldn\u2019t feel **overwhelming.**",
    overviewVisual: "receipt",
    overviewSub: "Grove turns receipts into clear impact and small challenges.",
    receipt: {
      label: "Receipt \u00b7 kg CO\u2082",
      items: [
        { name: "Ground beef", value: 3.1, heavy: true },
        { name: "Cheese", value: 1.0 },
        { name: "Oat milk", value: 0.4 },
        { name: "Lentils", value: 0.2 },
        { name: "Tortillas", value: 0.3 },
      ],
      swap: "Swap the beef, cut this by half.",
      action: "Plant it",
    },
    overview: [
      "Everyday purchases have an environmental impact, but understanding that impact, and knowing what to do about it, can feel difficult.",
      "Grove is a mobile app concept that turns shopping receipts into understandable environmental insights and small, achievable challenges.",
    ],
    problem: "People want to buy more sustainably, but nothing connects everyday spending to its footprint.",
    solutionLead: "Small actions. **Something to show for them.**",
    solution: [
      { title: "Scan", line: "Snap the receipt.", icon: "receipt" },
      { title: "Understand", line: "Impact you can picture.", icon: "number" },
      { title: "Grow", line: "Small challenges, real seeds.", icon: "sprout" },
      { title: "See it", line: "Your grove fills up.", icon: "dots" },
    ],
    decisionsLead: "Making the invisible feel **tangible.**",
    decisions: [
      {
        title: "Receipts as the entry point",
        line: "Start with something people already have. Line the receipt up, and Grove reads the rest.",
        src: "/grove/scan.png",
        visual: "Plant a receipt: a grocery receipt lined up inside the camera frame",
        phone: true,
      },
      {
        title: "Challenges over guilt",
        line: "One approachable swap, accept or not now, instead of a wall of statistics.",
        src: "/grove/see.png",
        visual: "A receipt's footprint, 5.4 kg of carbon and 20k litres of water, with one suggested swap: beef for lentils once a week",
        phone: true,
      },
      {
        title: "Seeds as progress",
        line: "Each swap becomes a seed that visibly fills up, so change has something to show for it.",
        src: "/grove/grow.png",
        visual: "Your seeds: public transit 8 of 10, lentil beans 1 of 4, thrifting done",
        phone: true,
      },
    ],
    role: "I owned Grove end to end: the product concept, UX and UI, visual design and the Figma prototype.",
    outcome: "A little less waste. A little more growth.",
    outcomeDetail: {
      lead: "A little less waste. **A little more growth.**",
      paragraphs: [],
      trio: [
        { src: "/grove/see.png", alt: "The receipt's footprint in carbon and water, with one suggested swap" },
        { src: "/grove/celebrate.png", alt: "Congratulations: a seed completed and some garbage cleared" },
        { src: "/grove/grow.png", alt: "Your seeds and how far along each one is" },
      ],
      closing: "Grove set out to make sustainability feel approachable and rewarding: one receipt, one small swap, one seed at a time.",
    },
    gallery: [],
  },
  {
    slug: "alvarez",
    name: "alvarez",
    accent: "#2A2722",
    tint: "#9A7A3A",
    kind: "brand",
    year: "2024",
    line: "Brand and storefront direction for an apparel label.",
    headline: "Giving an apparel idea **its identity.**",
    meta: { role: "Brand strategy, creative direction, ecommerce", timeline: "2024", platform: "Shopify (planned)" },
    heroArt: "alvarez-hoodie",
    overviewLead: "A clothing brand needs more than {hoodie} clothes.",
    overviewVisual: "brief",
    overview:
      "Alvarez started as an apparel concept without a defined identity. The challenge was figuring out where it belonged in a crowded fashion market, what would make it distinct, and how that identity could translate into an online store.",
    problem: "A broad apparel idea needed a clear identity, a place in the market and an online home.",
    solutionArt: "alvarez",
    roleStatement: true,
    outcomeArt: "alvarez",
    solution: [
      { title: "Finding a place in the market", line: "Studied competing apparel brands, pricing, product positioning, and the visual language shaping their identities." },
      { title: "Two directions, two personalities", line: "Explored contrasting identities: a darker, streetwear-inspired aesthetic and a cleaner, more contemporary retail direction." },
      { title: "Designing the shopping experience", line: "Planned a Shopify storefront around product discovery, clear navigation, and a cohesive brand experience." },
      { title: "Bringing the brand onto the product", line: "Developed apparel mockups to explore color, graphics, placement, and how each identity translated onto physical garments." },
    ],
    role:
      "Led brand research, creative direction, and ecommerce planning, from competitor analysis and visual exploration to product mockups and Shopify storefront structure.",
    outcome: "From an idea to two distinct brand identities.",
    outcomeDetail: {
      lead: "From an idea to **two distinct brand identities.**",
      paragraphs: [
        "Developed two visual directions, apparel concepts, and a proposed Shopify storefront structure, establishing a tangible foundation for Alvarez\u2019s next stage of development.",
      ],
    },
    galleryArt: "alvarez-reel",
    gallery: [],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
