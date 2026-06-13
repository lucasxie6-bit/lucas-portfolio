"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { LiveProduct } from "@/data/projects";

interface LiveProductPreviewProps {
  liveProduct: LiveProduct;
  projectName: string;
}

export default function LiveProductPreview({
  liveProduct,
  projectName,
}: LiveProductPreviewProps) {
  const { href, embedUrl, src, title } = liveProduct;
  const iframeSrc = embedUrl ?? href;
  const iframeTitle = title ?? `${projectName} live site`;
  const [embedBlocked, setEmbedBlocked] = useState(false);

  const handleIframeLoad = useCallback(
    (event: React.SyntheticEvent<HTMLIFrameElement>) => {
      const iframe = event.currentTarget;

      try {
        const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
        if (!doc || doc.body?.childElementCount === 0) {
          setEmbedBlocked(true);
        }
      } catch {
        // Cross-origin load — embed is working
        setEmbedBlocked(false);
      }
    },
    [],
  );

  return (
    <div className="space-y-3">
      <div className="relative w-full h-[480px] md:h-[560px] rounded-2xl overflow-hidden bg-stone-100 ring-1 ring-stone-200/60">
        {!embedBlocked ? (
          <iframe
            src={iframeSrc}
            title={iframeTitle}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
            loading="lazy"
            onLoad={handleIframeLoad}
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 relative flex flex-col items-center justify-center gap-4 bg-stone-50 p-6 text-center">
            {src ? (
              <Image
                src={src}
                alt={`${projectName} site preview`}
                fill
                className="object-cover opacity-40"
                sizes="(max-width: 1280px) 100vw, 800px"
              />
            ) : null}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <p className="text-sm text-stone-500 max-w-xs">
                This site can&apos;t be previewed here. Open it in a new tab to
                explore.
              </p>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-stone-800 bg-white px-4 py-2 rounded-full ring-1 ring-stone-200/80 hover:ring-stone-400/60 transition-all duration-200"
              >
                Open site ↗
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors duration-200 tracking-wide"
        >
          Open site ↗
        </a>
      </div>
    </div>
  );
}
