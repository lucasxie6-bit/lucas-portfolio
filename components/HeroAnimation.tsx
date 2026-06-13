'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function HeroAnimation() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/animations/walking-cat.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {
        // Silently fail if animation file isn't present yet
      });
  }, []);

  if (!animationData) return null;

  return (
    <div
      className="hidden md:block absolute top-6 right-8 lg:right-16 xl:right-24 pointer-events-none select-none"
      aria-hidden="true"
    >
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: 150, height: 150, opacity: 0.45 }}
      />
    </div>
  );
}
