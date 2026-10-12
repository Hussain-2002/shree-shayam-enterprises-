import Link from "next/link";
import { categoryLabel, rupee } from "@/lib/data";
import { Photo } from "./photo";

export function ProductCard({ product }) {
  return (
    <article className="card">
      <Link className="card-hit" href={`/product/${product.id}`}>
        <span className="card-photo">
          {product.badge && <em className="badge">{product.badge}</em>}
          <Photo src={product.image} alt={product.name} />
        </span>
        <span className="card-meta">
          <small>{categoryLabel(product.category)}</small>
          <strong>{product.name}</strong>
          <span>{rupee(product.price)}</span>
        </span>
      </Link>
    </article>
  );
}
