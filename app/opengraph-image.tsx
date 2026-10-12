import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The preview card shown when the site's link is shared (Instagram, iMessage, Slack, X...).
export const alt = "Lucas Xie: i design apps and websites.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COVER = 420; // the album cover, in px
const DISC = Math.round(COVER * 0.935);
const k = COVER / 300; // the cover artwork was drawn on a 300px grid

export default async function Image() {
  const asset = (name: string) => readFile(join(process.cwd(), "assets/og", name));
  const [archivo, mono, photo] = await Promise.all([
    asset("ArchivoBlack-Regular.ttf"),
    asset("DMMono-Regular.ttf"),
    asset("cover-base.jpg"),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const top = (size.height - COVER) / 2;
  const left = 80;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F4F1EA", position: "relative" }}>
        {/* Record sliding out from behind the cover */}
        <div
          style={{
            position: "absolute",
            left: left + COVER * 0.46,
            top: top + (COVER - DISC) / 2,
            width: DISC,
            height: DISC,
            borderRadius: DISC,
            background: "#1C1A1B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[0.86, 0.72, 0.58].map((r) => (
            <div
              key={r}
              style={{
                position: "absolute",
                width: DISC * r,
                height: DISC * r,
                borderRadius: DISC,
                border: "1px solid rgba(242,240,235,0.08)",
              }}
            />
          ))}
          <div
            style={{
              width: DISC * 0.4,
              height: DISC * 0.4,
              borderRadius: DISC,
              background: "#3E5AA8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 10, background: "#F4F1EA" }} />
          </div>
        </div>

        {/* The cover */}
        <div
          style={{
            position: "absolute",
            left,
            top,
            width: COVER,
            height: COVER,
            display: "flex",
            boxShadow: "0 24px 48px -24px rgba(28,25,27,0.55)",
          }}
        >
          <img src={photoSrc} width={COVER} height={COVER} alt="" style={{ position: "absolute", left: 0, top: 0 }} />
          <div
            style={{
              position: "absolute",
              left: 12 * k,
              top: 4,
              fontFamily: "Archivo Black",
              fontSize: 54 * k,
              letterSpacing: -2.7 * k,
              color: "#1C191B",
              lineHeight: 1,
            }}
          >
            lucas xie
          </div>
          <div
            style={{
              position: "absolute",
              left: 14 * k,
              top: 279 * k,
              fontFamily: "DM Mono",
              fontSize: 10 * k,
              color: "#F2F0EB",
            }}
          >
            LX-001 · 2026
          </div>
        </div>

        {/* Line + address */}
        <div
          style={{
            position: "absolute",
            left: 720,
            top: 0,
            bottom: 0,
            right: 60,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Archivo Black",
              fontSize: 50,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: "#1C191B",
            }}
          >
            <span>i design apps</span>
            <span>and websites.</span>
          </div>
          <div style={{ marginTop: 28, fontFamily: "DM Mono", fontSize: 24, color: "#8A847A" }}>lucasxie.me</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Black", data: archivo, style: "normal", weight: 400 },
        { name: "DM Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
