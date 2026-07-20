"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Fond vidéo décoratif. Le poster (next/image `priority`) porte le LCP ; la
 * vidéo n'est montée qu'après hydratation puis fond en douceur une fois en
 * lecture réelle — jamais montée sous `prefers-reduced-motion`.
 */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [motionOk, setMotionOk] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {motionOk && (
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          poster={poster}
          onPlaying={() => setPlaying(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-1000",
            playing ? "opacity-100" : "opacity-0",
          )}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
