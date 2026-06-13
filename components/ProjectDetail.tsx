import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import type { GalleryItem, Project } from "@/data/projects";
import { projectHasTikTokEmbeds } from "@/data/projects";
import LiveProductPreview from "@/components/LiveProductPreview";
import TikTokEmbed from "@/components/TikTokEmbed";

function isTikTokItem(item: GalleryItem): item is Extract<GalleryItem, { type: "tiktok" }> {
  return item.type === "tiktok";
}

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const hasTikTokEmbeds = projectHasTikTokEmbeds(project);

  return (
    <div className="min-h-screen flex flex-col">
      {hasTikTokEmbeds && (
        <Script
          src="https://www.tiktok.com/embed.js"
          strategy="lazyOnload"
        />
      )}
      <header className="pt-10 pb-8 border-b border-stone-200">
        <div className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors duration-200 tracking-wide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Work
          </Link>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-xs tracking-widest text-stone-400 uppercase mb-2">
                {project.year}
              </p>
              <h1 className="text-3xl md:text-4xl font-medium text-stone-800 tracking-wide lowercase">
                {project.name}
              </h1>
              {project.tagline && (
                <p className="mt-3 text-sm text-stone-500 leading-relaxed max-w-xl tracking-wide">
                  {project.tagline}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <nav
            aria-label="Table of contents"
            className="lg:w-48 shrink-0"
          >
            <div className="lg:sticky lg:top-10">
              <p className="text-xs tracking-widest text-stone-400 uppercase mb-4">
                Contents
              </p>
              <ul className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto pb-2 lg:pb-0 -mx-1 px-1">
                {project.sections.map((section) => (
                  <li key={section.id} className="shrink-0">
                    <a
                      href={`#${section.id}`}
                      className="block text-sm text-stone-500 hover:text-stone-800 transition-colors duration-200 tracking-wide whitespace-nowrap lg:whitespace-normal py-1 lg:py-1.5 border-l-2 border-transparent hover:border-stone-300 lg:pl-3"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="flex-1 min-w-0">
            {/* Hero image — now inside the article column so it aligns with Overview */}
            {project.image && (
              <div className="relative rounded-3xl overflow-hidden w-full aspect-[2/1] bg-stone-900 ring-1 ring-inset ring-stone-900/10 mb-12">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 900px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
            )}

            <article>
              <div className="space-y-16">

              {project.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <h2 className="text-lg font-medium text-stone-800 tracking-wide mb-4">
                    {section.title}
                  </h2>

                  {section.gallery ? (
                    <div className="space-y-10">
                      {/* Live Product subheading */}
                      {section.gallery.liveProduct && (
                        <div>
                          <h3 className="text-sm font-medium text-stone-600 tracking-wide mb-3">
                            Live Product
                          </h3>
                          <LiveProductPreview
                            liveProduct={section.gallery.liveProduct}
                            projectName={project.name}
                          />
                        </div>
                      )}

                      {/* In Action subheading */}
                      {section.gallery.items && section.gallery.items.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-stone-600 tracking-wide mb-3">
                            In Action
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {section.gallery.items.map((item, i) =>
                              isTikTokItem(item) ? (
                                <TikTokEmbed
                                  key={i}
                                  cite={item.cite}
                                  videoId={item.videoId}
                                />
                              ) : (
                                <div
                                  key={i}
                                  className="relative rounded-xl overflow-hidden aspect-square bg-stone-100 ring-1 ring-stone-200/60"
                                >
                                  <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-500 leading-relaxed tracking-wide">
                      {section.content}
                    </p>
                  )}
                </section>
              ))}
            </div>
            </article>
          </div>
        </div>
      </div>

      <footer className="border-t border-stone-200 mt-auto py-10">
        <div className="px-8 md:px-16 lg:px-24 max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-stone-500 hover:text-stone-800 transition-colors duration-200 tracking-wide"
          >
            ← All projects
          </Link>
          <p className="text-xs text-stone-400">Lucas Xie © 2026</p>
        </div>
      </footer>
    </div>
  );
}
