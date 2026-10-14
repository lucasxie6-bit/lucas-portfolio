// The alvarez mark: the cream wordmark small and centred on the dark brand colour.
export default function AlvarezHero() {
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: "#2A2722", containerType: "size" }}>
      <span
        className="hero-rise leading-none select-none"
        style={{
          fontFamily: "var(--font-archivo-var), sans-serif",
          fontWeight: 600,
          fontStretch: "92%",
          fontSize: "15cqw",
          letterSpacing: "-0.04em",
          color: "#E8DEB0",
        }}
      >
        alvarez
      </span>
    </div>
  );
}
