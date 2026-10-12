import { notFound } from "next/navigation";
import { Shop } from "@/components/shop";
import { categories, categoryLabel } from "@/lib/data";

export function generateStaticParams() {
  return [{ category: [] }, ...categories.map((item) => ({ category: [item.id] }))];
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const id = category?.[0] ?? "all";
  const title = id === "all" ? "The full shop" : categoryLabel(id);
  return { title };
}

export default async function ShopPage({ params }) {
  const { category: slug } = await params;
  if (slug && slug.length > 1) notFound();
  const category = slug?.[0] ?? "all";
  const known = category === "all" || categories.some((item) => item.id === category);
  if (!known) notFound();
  return <Shop category={category} />;
}
