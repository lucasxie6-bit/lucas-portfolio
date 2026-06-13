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

export interface ProjectSection {
  id: string;
  title: string;
  content: string;
  visualProof?: VisualProof;
  gallery?: {
    liveProduct?: LiveProduct;
    items?: GalleryItem[];
  };
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

const defaultSections = (name: string): ProjectSection[] => [
  {
    id: "overview",
    title: "Overview",
    content: `${name} is a project focused on helping early-stage ideas find traction. This case study walks through the context, challenges, and outcomes of the work.`,
  },
  {
    id: "problem",
    title: "Problem",
    content:
      "Early-stage teams often struggle to validate ideas quickly, align on priorities, and communicate value to users. The core challenge was identifying where friction existed and what would meaningfully move the needle.",
  },
  {
    id: "solution",
    title: "Solution",
    content:
      "We shaped a focused product direction, refined the experience around key user flows, and iterated based on feedback. The approach prioritized clarity, speed, and measurable learning over feature breadth.",
  },
  {
    id: "role",
    title: "Role",
    content:
      "Led product strategy and execution — from discovery and positioning through design direction, prototyping, and go-to-market support alongside the founding team.",
  },
  {
    id: "outcome",
    title: "Outcome",
    content:
      "The project established a clearer product narrative, improved core flows, and created a stronger foundation for growth. Momentum and user engagement improved as the team shipped with more confidence.",
  },
];

export const projects: Project[] = [
  {
    slug: "useno",
    name: "Useno",
    year: "2026",
    image: "/2.png",
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
    image: "/3.png",
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
    image: "/4.png",
    tagline: "Building community-driven growth from the ground up.",
    sections: defaultSections("Grove"),
  },
  {
    slug: "sponty",
    name: "Sponty",
    year: "2026",
    image: "/5.png",
    tagline: "Making spontaneous connection feel effortless and fun.",
    sections: defaultSections("Sponty"),
  },
  {
    slug: "spark",
    name: "Spark",
    year: "2026",
    image: "/6.png",
    tagline: "Igniting early traction for ambitious founders.",
    sections: defaultSections("Spark"),
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
