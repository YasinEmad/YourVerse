import Link from "next/link";

export default function WorldNotFound() {
  return (
    <div className="grid min-h-dvh place-items-center content-center gap-4 bg-base-bg px-6 py-6 text-center text-base-text">
      <h1 className="font-heading m-0 text-6xl">404</h1>
      <p className="m-0 opacity-75">This world does not exist or is not open yet.</p>
      <Link href="/" className="mt-4 text-base-text underline underline-offset-4">
        Return to the Multiverse
      </Link>
    </div>
  );
}
