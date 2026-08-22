import { Slider, type SlideItem } from "@/components/home/Slider";
import { VerseShowcase } from "@/components/home/VerseShowcase";
import { VERSE_WORLDS } from "@/components/home/verse-worlds";

/* Glue between the plain-data world list and the carousel.
   Adding a world never touches this file — append to verse-worlds.ts instead. */
const slides: SlideItem[] = VERSE_WORLDS.map(({ id, label, ...showcase }) => ({
  id,
  label,
  content: <VerseShowcase {...showcase} id={id} />,
}));

export function VerseWorlds() {
  return <Slider items={slides} ariaLabel="Featured verses" />;
}
