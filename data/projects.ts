import type { CSSProperties } from "react";

interface GalleryItemBase {
  alt: string;
}

export interface GalleryImageItem extends GalleryItemBase {
  type?: "image";
  src: string;
}

export interface GalleryTikTokItem extends GalleryItemBase {
  type: "tiktok";
  cite: string;
  videoId: string;
}

export type GalleryItem = GalleryImageItem | GalleryTikTokItem;

export function projectHasTikTokEmbeds(project: Project): boolean {
  return project.sections.some((section) =>
    section.gallery?.items?.some((item) => item.type === "tiktok")
  );
}

export interface LiveProduct {
  href: string;
  embedUrl?: string;
  /** Fallback poster when the site blocks iframe embedding */
  src?: string;
  title?: string;
}

export interface VisualProofImage {
  src: string;
  alt: string;
  caption: string;
}

export interface VisualProofGallery {
  kind: "gallery";
  images: VisualProofImage[];
}

export interface VisualProofDirection {
  label: string;
  src: string;
  alt: string;
  caption: string;
}

export interface VisualProofDirections {
  kind: "directions";
  directions: VisualProofDirection[];
}

export type VisualProof = VisualProofGallery | VisualProofDirections;

export interface ProcessSlide {
  src: string;
  alt: string;
  caption: string;
}

export interface CarouselSlide {
  src: string;
  alt: string;
  caption?: string;
}

export interface Proofs {
  tryIt?: {
    slides: CarouselSlide[];
  };
  process?: ProcessSlide[];
}

export interface DesignDecision {
  title: string;
  description: string;
}

export interface ProjectSection {
  id: string;
  title: string;
  content: string;
  visualProof?: VisualProof;
  gallery?: {
    liveProduct?: LiveProduct;
    items?: GalleryItem[];
  };
  proofs?: Proofs;
  decisions?: DesignDecision[];
}

export interface Project {
  slug?: string;
  name: string;
  year: string;
  image?: string;
  lightBackground?: boolean;
  gradientStyle?: CSSProperties;
  comingSoon?: boolean;
  tagline: string;
  sections: ProjectSection[];
}

export const projects: Project[] = [
  {
    slug: "useno",
    name: "Useno",
    year: "2026",
    image: "/cards/1.svg",
    tagline: "Helping creators and teams turn ideas into momentum.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Useno started as an idea to help people build real connections in a new city, pairing newcomers and travelers with locals around shared interests instead of one-off paid tours. This case study covers the early validation work, the pivot in direction, and what came out of testing the concept in the real world.",
      },
      {
        id: "problem",
        title: "Problem",
        content:
          "Moving to or visiting a new city can be isolating. Most platforms focus on transactional experiences, not lasting connections, so people leave a city without the relationships that would make them want to come back or stay engaged with it.",
      },
      {
        id: "solution",
        title: "Solution",
        content:
          "We built a lightweight MVP centered on small, interest based meetups, low pressure in person gatherings designed to test whether shared interest connection (not transactional tours) was the real unlock. Instead of building a full marketplace upfront, we validated demand through direct outreach and hands on event coordination.",
      },
      {
        id: "role",
        title: "Role",
        content:
          "Led the concept from initial research through MVP execution, including idea validation conversations, defining the meetup format, coordinating logistics, and gathering feedback to inform the next iteration.",
      },
      {
        id: "outcome",
        title: "Outcome",
        content:
          "Ran 5 successful MVP meetups, each validating real demand for interest based local connection. Attendees consistently said they wanted to stay in touch beyond the event, confirming the relationship over transaction thesis. These sessions also surfaced key insights on format, group size, and matching criteria for a future product direction.",
      },
      {
        id: "gallery",
        title: "Gallery",
        content: "",
        gallery: {
          liveProduct: {
            href: "https://useno.app",
          },
          items: [
            { src: "/usenomeetup1.jpeg", alt: "Useno meetup 1", type: "image" },
            { src: "/usenomeetup2.jpeg", alt: "Useno meetup 2", type: "image" },
            { src: "/usenomeetup3.jpeg", alt: "Useno meetup 3", type: "image" },
            { src: "/usenomeetup4.jpeg", alt: "Useno meetup 4", type: "image" },
            {
              type: "tiktok",
              cite: "https://www.tiktok.com/@joinuseno/photo/7644959340713102610",
              videoId: "7644959340713102610",
              alt: "Useno TikTok clip 1",
            },
            {
              type: "tiktok",
              cite: "https://www.tiktok.com/@joinuseno/video/7645396727431810322",
              videoId: "7645396727431810322",
              alt: "Useno TikTok clip 2",
            },
          ],
        },
      },
    ],
  },
  {
    slug: "alvarez",
    name: "Alvarez",
    year: "2024",
    image: "/cards/2.svg",
    tagline: "A refined brand and product experience for a growing venture.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Alvarez was an apparel brand project focused on turning an early-stage fashion concept into a more concrete ecommerce direction. The work included market research, brand positioning, visual design exploration, and planning a Shopify website that could support a future online clothing store.",
      },
      {
        id: "problem",
        title: "Problem",
        content:
          "The project started with a broad apparel concept but needed clearer direction around the target customer, product positioning, and how the brand should show up online. Before moving closer to launch, the team needed to understand the competitive fashion landscape, define the brand's visual identity, and create an ecommerce experience that felt credible to potential customers.",
      },
      {
        id: "solution",
        title: "Solution",
        content:
          "I developed two design directions for the apparel brand and helped shape the structure of a Shopify ecommerce website. I also conducted market research to understand competitor brands, customer expectations, pricing, product presentation, and positioning opportunities. The work focused on making the brand feel more polished, testable, and ready for an online retail experience.",
      },
      {
        id: "product-mockups",
        title: "Product Mockups",
        content:
          "Early hoodie mockups explored garment colour, graphic placement, front/back views, and how the Alvarez identity could appear on a real product.",
        visualProof: {
          kind: "gallery",
          images: [
            {
              src: "/alvarez1.png",
              alt: "Alvarez hoodie front and back mockup",
              caption: "Front and back hoodie mockup",
            },
            {
              src: "/alvarez2.jpg",
              alt: "Alvarez graphic placement exploration",
              caption: "Graphic placement exploration",
            },
          ],
        },
      },
      {
        id: "design-directions",
        title: "Design Directions",
        content:
          "Two visual directions were developed to test different ways the apparel brand could feel online, from darker streetwear styling to a cleaner ecommerce presentation.",
        visualProof: {
          kind: "directions",
          directions: [
            {
              label: "Direction 01",
              src: "/moodboard1.png",
              alt: "Alvarez dark graphic streetwear direction",
              caption:
                "Focused on washed black tones, oversized silhouettes, and bold front graphics.",
            },
            {
              label: "Direction 02",
              src: "/moodboard2.png",
              alt: "Alvarez cleaner ecommerce direction",
              caption:
                "Explored a simpler product presentation with broader online retail appeal.",
            },
          ],
        },
      },
      {
        id: "role",
        title: "Role",
        content:
          "Led market research, ecommerce planning, and design direction for the project. My work included competitor review, Shopify site structure, visual concept development, apparel brand positioning, and translating the business idea into two possible website and brand directions.",
      },
      {
        id: "outcome",
        title: "Outcome",
        content:
          "The project resulted in two distinct design concepts, a clearer apparel brand direction, and a stronger foundation for building a Shopify storefront. The work helped define how the brand could present its clothing, communicate value to customers, and move from a loose fashion concept toward a more launch-ready online shopping experience.",
      },
    ],
  },
  {
    slug: "grove",
    name: "Grove",
    year: "2026",
    image: "/cards/3.svg",
    tagline: "Turning everyday receipts into small, doable steps toward less waste.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Grove turns everyday receipts into a personal sustainability tracker. Scan a receipt and see the carbon and water cost behind what you bought, in numbers you can picture. Then Grove gives you one simple swap to try next time.",
      },
      {
        id: "problem",
        title: "Problem",
        content:
          "46% of consumers say they want to reduce their environmental impact through what they buy (PwC, 2024), but most have no easy way to connect everyday spending to its footprint. Existing sustainability apps bury people in data, or guilt-trip them without giving them anything to do about it.",
      },
      {
        id: "solution",
        title: "Solution",
        content:
          'Scan a receipt, see its impact, get one simple action to improve. Grove turns raw numbers, like 5.4kg of CO2 or 20,000 liters of water, into comparisons that click, like "that\'s about 45 minutes of leaving your car running." Then it suggests one small swap, like trading beef for lentils once a week. Each swap you complete adds to a visual grove that keeps growing.',
      },
      {
        id: "role",
        title: "Role",
        content:
          "Led design end to end: research into consumer sustainability behavior, mapping the scan-to-action user flow, and designing and prototyping the full UI in Figma.",
      },
      {
        id: "outcome",
        title: "Outcome",
        content:
          "The result is a lightweight, encouraging tool that makes sustainability feel doable. Large, readable numbers. One suggestion at a time. A clean layout that doesn't ask much of you.",
      },
      {
        id: "proofs",
        title: "Proofs",
        content: "",
        proofs: {
          tryIt: {
            slides: [
              {
                src: "/grove-screen-01-scan.svg",
                alt: "Scan receipt screen — Plant a Receipt",
                caption: "Scan a receipt to plant it",
              },
              {
                src: "/grove-screen-02-impact.svg",
                alt: "Impact results screen showing 5.4kg CO2 and 20K liters of water with relatable comparisons",
                caption: "See its impact, translated into terms you can picture",
              },
              {
                src: "/grove-screen-03-seeds.svg",
                alt: "Seeds and progress tracking screen showing completed swaps",
                caption: "Every completed swap grows your grove",
              },
              {
                src: "/grove-screen-04-action.svg",
                alt: "Completed seed screen with congratulations and cleared footprint",
                caption: "One small swap, one less thing to worry about",
              },
            ],
          },
          process: [
            { src: "/research-insights.svg", alt: "Research & insights", caption: "Research & insights" },
            { src: "/mappingthescan-to-actionflow.svg", alt: "Mapping the scan-to-action flow", caption: "Mapping the scan-to-action flow" },
            { src: "/visualdesignexploration.svg", alt: "Visual design exploration", caption: "Visual design exploration" },
          ],
        },
      },
    ],
  },
  {
    slug: "sponty",
    name: "Sponty",
    year: "2026",
    image: "/cards/4.svg",
    tagline: "Making spontaneous connection feel effortless and fun.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          'Sponty ("No Plans. Just Vibes.") is a mobile app that turns "I\'m bored" into "let\'s hang out" in three taps. Instead of planning days ahead, you post what you\'re doing right now, grabbing coffee, heading to the park, and nearby friends can join on the spot. This case study covers the design decisions behind making spontaneity feel simple, low-pressure, and safe.',
      },
      {
        id: "problem",
        title: "Problem",
        content:
          "Making plans usually means a slow back-and-forth of texts, typing out where, when, and who's coming, and committing to something that might fall through. That friction kills spontaneity, so most people just stay home. The challenge: capture the carefree, in-person energy of early Snapchat and Houseparty without becoming another curated feed, and without ignoring real privacy and safety concerns around sharing location.",
      },
      {
        id: "solution",
        title: "Solution",
        content:
          "Sponty strips hangouts down to a 3-tap flow: pick a pre-built activity (coffee, park, study, food), choose who sees it (friends, close friends, or specific people), and post. Hangouts show on a map with approximate, not exact, location by default, and auto-expire after 30 minutes, 1 hour, or 2 hours. Edge cases were designed up front: posts quietly expire if no one joins, an optional cap keeps groups manageable, and canceling removes the pin instantly.",
      },
      {
        id: "role",
        title: "Role",
        content:
          "Owned end-to-end product design, from concept and competitive analysis (what made early Snapchat and Houseparty feel fun) to defining the core interaction model, wireframing the post flow and map/feed views, and designing for privacy and safety edge cases.",
      },
      {
        id: "outcome",
        title: "Outcome",
        content:
          "A focused, single-purpose app: one primary screen (map-first), one core action (post a hangout), one clear lifecycle (post, join, expire). Cutting features like chat and stories keeps Sponty true to its premise, real spontaneity, not another feed to scroll.",
      },
      {
        id: "design-decisions",
        title: "Design Decisions",
        content: "",
        decisions: [
          {
            title: "Spontaneity over planning",
            description:
              "Removing scheduling friction so hangouts happen in the moment, not days later.",
          },
          {
            title: "Buttons over typing",
            description:
              "Pre-built activity buttons (coffee, park, study, food) instead of free text, for speed and consistency.",
          },
          {
            title: "Expiration by design",
            description:
              "Every post auto-expires (30 min / 1 hr / 2 hr) to reinforce spontaneity and prevent clutter.",
          },
          {
            title: "Map-first, not feed-and-map",
            description:
              "One primary interface (map with pins) to avoid clutter and confusion.",
          },
        ],
      },
      {
        id: "proofs",
        title: "Proofs",
        content: "",
        proofs: {
          tryIt: {
            slides: [
              {
                src: "/sponty-screen-01-map.svg",
                alt: "Map home screen showing active hangouts as pins",
                caption: "Map home — see where your friends are right now",
              },
              {
                src: "/sponty-screen-02-create.svg",
                alt: "Create a hangout screen with vibe, time limit, and group size options",
                caption: "Create a hangout — set the vibe, time limit, and group size",
              },
              {
                src: "/sponty-screen-03-capture.svg",
                alt: "Built-in camera screen for capturing the moment",
                caption: "Capture the moment — built-in camera to share with friends",
              },
              {
                src: "/sponty-screen-04-memories.svg",
                alt: "Memories screen showing saved and recapped hangouts",
                caption: "Your Memories — every hangout, saved and recapped",
              },
            ],
          },
        },
      },
    ],
  },
  {
    slug: "spark",
    name: "Spark",
    year: "2026",
    image: "/cards/5.svg",
    tagline: "Earn the answer. Build the thinking.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Spark is an app designed to break the habit of defaulting to AI for instant answers. This case study walks through the idea, the design tension it tackles, and how the interaction model was shaped.",
      },
      {
        id: "problem",
        title: "Problem",
        content:
          "When AI can answer anything instantly, people stop forming their own opinions first, skipping the struggle that builds critical thinking. The challenge was designing friction that feels motivating, not punishing, so users engage their own reasoning before reaching for AI.",
      },
      {
        id: "solution",
        title: "Solution",
        content:
          'Spark locks AI-generated answers behind a short "unlock" step: before getting help, users must first attempt their own answer or give constructive feedback on someone else\'s. This reframes AI as a reward for effort rather than a shortcut, building a habit of thinking first.',
      },
      {
        id: "role",
        title: "Role",
        content:
          'Led product design, from defining the core "think first, unlock after" mechanic to designing the unlock flow, feedback prompts, and the balance between friction and reward.',
      },
      {
        id: "outcome",
        title: "Outcome",
        content:
          "The result is a clear, repeatable interaction model that nudges users toward reflection without feeling like a punishment, turning AI into a second opinion instead of a first resort.",
      },
      {
        id: "proofs",
        title: "Proofs",
        content: "",
        proofs: {
          tryIt: {
            slides: [
              {
                src: "/spark-screen-01-home.svg",
                alt: "Home screen showing Spark Score and progress toward Thinker status",
                caption: "Home — track your Spark Score and progress toward 'Thinker' status",
              },
              {
                src: "/spark-screen-02-tiered.svg",
                alt: "Tiered help screen with hints and guiding questions",
                caption: "Tiered help — hints and guiding questions earn points; full explanations stay locked",
              },
              {
                src: "/spark-screen-03-redirect.svg",
                alt: "Spark redirecting a do-it-for-me request into guided help",
                caption: "Spark redirects 'do it for me' requests into guided, point-earning help",
              },
              {
                src: "/spark-screen-04-status.svg",
                alt: "Spark Status screen showing level breakdown from Assisted to Thinker",
                caption: "Spark Status — level breakdown from Assisted to Thinker",
              },
            ],
          },
        },
      },
    ],
  },
  {
    name: "Coming soon",
    year: "—",
    comingSoon: true,
    lightBackground: true,
    gradientStyle: {
      background:
        "linear-gradient(135deg, #e8e4df 0%, #f0ebe5 50%, #ddd8d2 100%)",
    },
    tagline: "",
    sections: [],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects
    .filter((p) => p.slug && !p.comingSoon)
    .map((p) => p.slug as string);
}
