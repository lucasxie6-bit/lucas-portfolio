import { HomeScreen, Phone } from "@/components/SparkScreens";

// The spark wordmark over the home screen, the phone running off the bottom of the panel.
export default function SparkHero() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#262A55", containerType: "size" }}>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-[3%] text-center leading-none select-none"
        style={{ fontFamily: "var(--font-fraunces), serif", fontStyle: "italic", fontWeight: 400, fontSize: "16.5cqw", letterSpacing: "-0.02em", color: "#F1EDE4" }}
      >
        spark
      </span>
      <Phone dark className="hero-rise absolute left-[37cqw] top-[44%] w-[26cqw]">
        <HomeScreen />
      </Phone>
    </div>
  );
}
