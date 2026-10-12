import { notFound } from "next/navigation";
import { ProductView } from "@/components/product-view";
import { findProduct, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.blurb };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) notFound();
  return <ProductView product={product} />;
}
