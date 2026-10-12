import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap empty-page">
      <h1>That page is not in the shop.</h1>
      <Link className="btn" href="/shop">
        Back to the shop
      </Link>
    </section>
  );
}
