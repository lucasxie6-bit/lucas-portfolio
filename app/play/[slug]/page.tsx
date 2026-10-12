import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CDRack from "@/components/CDRack";
import { albums, getAlbumBySlug } from "@/data/albums";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return albums.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) return {};
  return { title: `${album.name} — Lucas Xie`, description: album.line };
}

export default async function PlayPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!getAlbumBySlug(slug)) notFound();
  return <CDRack initialSlug={slug} />;
}
