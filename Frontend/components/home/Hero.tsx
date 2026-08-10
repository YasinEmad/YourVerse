import Image from "next/image";
import { HeroTitle } from "./HeroTitle";
import { UnderTitleLottie } from "./UnderTitleLottie";

export function Hero() {
  return (
    <section className="relative mb-[clamp(4rem,11vw,7rem)] flex flex-col items-center text-center">
      <div
        className="relative mb-1 grid aspect-[3/2] w-[clamp(15rem,32vw,24rem)] place-items-center"
        aria-hidden="true"
      >
        <Image
          src="/assets/logo.png"
          alt="Yourverse"
          width={480}
          height={480}
          priority
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_28px_rgba(185,168,247,0.35)]"
        />
      </div>

      <HeroTitle />
      <div className="flex w-full items-center gap-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#8b7cf6]/30" />
        <UnderTitleLottie />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#8b7cf6]/30" />
      </div>
    </section>
  );
}
