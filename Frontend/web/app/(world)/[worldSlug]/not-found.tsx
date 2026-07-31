import Link from "next/link";

export default function WorldNotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__body">This world does not exist or is not open yet.</p>
      <Link href="/" className="not-found__link">
        Return to the Multiverse
      </Link>
    </div>
  );
}
