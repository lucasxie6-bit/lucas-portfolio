interface TikTokEmbedProps {
  cite: string;
  videoId: string;
}

export default function TikTokEmbed({ cite, videoId }: TikTokEmbedProps) {
  return (
    <div className="relative rounded-xl overflow-hidden aspect-square bg-stone-100 ring-1 ring-stone-200/60 flex items-center justify-center">
      <blockquote
        className="tiktok-embed"
        cite={cite}
        data-video-id={videoId}
        style={{ maxWidth: "605px", minWidth: "325px" }}
      >
        <section />
      </blockquote>
    </div>
  );
}
