import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CDRack from "@/components/CDRack";
import { PROJECT_SLUGS } from "@/components/records";
import { getAlbumBySlug } from "@/data/albums";

type Params = { slug: string };

const isProject = (slug: string) => (PROJECT_SLUGS as readonly string[]).includes(slug);

export function generateStaticParams(): Params[] {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const album = isProject(slug) ? getAlbumBySlug(slug) : undefined;
  if (!album) return {};
  return { title: `${album.name.toLowerCase()} — Lucas Xie`, description: album.line };
}

export default async function PlayPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!isProject(slug)) notFound();
  return <CDRack initialSlug={slug} />;
}
