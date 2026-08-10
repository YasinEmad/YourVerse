"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function UnderTitleLottie() {
  return (
    <div className="pointer-events-none h-28 w-28" aria-hidden="true">
      <DotLottieReact
        src="https://lottie.host/4b89b99b-f05c-4b4d-ac86-53ce76929cc2/NiD676YY1c.lottie"
        loop
        autoplay
        renderConfig={{ quality: 100, freezeOnOffscreen: true }}
        useFrameInterpolation
      />
    </div>
  );
}
