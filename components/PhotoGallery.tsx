import Image from "next/image";

// `big` spans the full row, `wide` half of it, `small` a quarter. `focus` is the CSS object-position used when cropping.
// Give big photos their `ratio` (width / height); they're shown at that shape, or 3:2 if it's taller.
export type Photo = {
  src: string;
  alt: string;
  size: "big" | "wide" | "small";
  focus?: string;
  ratio?: number;
};

type Tile = { photo: Photo; span: number };

// Packs photos into rows of `cols` columns, in order. A photo that doesn't fit starts a new row, and any row left
// short is filled by widening its tiles, so every row ends flush.
function pack(photos: Photo[], cols: number): Tile[][] {
  const want = { big: cols, wide: Math.ceil(cols / 2), small: 1 };
  const rows: Tile[][] = [];
  let row: Tile[] = [];
  let used = 0;
  const close = () => {
    for (let extra = cols - used, k = row.length - 1; extra > 0; extra--, k = (k - 1 + row.length) % row.length) {
      row[k].span++;
    }
    rows.push(row);
    row = [];
    used = 0;
  };
  photos.forEach((photo) => {
    const span = want[photo.size];
    if (used + span > cols) close();
    row.push({ photo, span });
    used += span;
    if (used === cols) close();
  });
  if (row.length) close();
  return rows;
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  return (
    <>
      <Grid rows={pack(photos, 4)} cols={4} height={210} className="hidden md:flex" />
      <Grid rows={pack(photos, 2)} cols={2} height={170} className="flex md:hidden" />
    </>
  );
}

function Grid({
  rows,
  cols,
  height,
  className,
}: {
  rows: Tile[][];
  cols: number;
  height: number;
  className: string;
}) {
  return (
    <div className={`flex-col gap-3 ${className}`}>
      {rows.map((row, r) => {
        const big = row.length === 1 && row[0].photo.size === "big" ? row[0].photo : null;
        if (big) return <Featured key={r} photo={big} />;
        return (
          <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, height }}>
            {row.map(({ photo, span }) => (
              <figure
                key={photo.src}
                className="relative m-0 overflow-hidden bg-[#2B2F36]"
                style={{ gridColumn: `span ${span} / span ${span}` }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: photo.focus ?? "50% 35%" }}
                  sizes={`(max-width: 768px) ${Math.round((span / cols) * 100)}vw, ${Math.round((span / cols) * 760)}px`}
                />
              </figure>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// A featured photo: full row width, cropped only lightly so the whole moment fits.
function Featured({ photo }: { photo: Photo }) {
  return (
    <figure className="relative m-0 overflow-hidden bg-[#2B2F36]" style={{ aspectRatio: Math.max(photo.ratio ?? 4 / 3, 3 / 2) }}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover"
        style={{ objectPosition: photo.focus ?? "50% 30%" }}
        sizes="(max-width: 800px) 100vw, 760px"
      />
    </figure>
  );
}
