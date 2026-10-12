"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { categoryLabel, products, rupee, shopHref } from "@/lib/data";
import { useCart } from "./cart-provider";
import { Photo } from "./photo";
import { ProductCard } from "./product-card";

export function ProductView({ product }) {
  const { addToCart } = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setSize(product.sizes[0]);
    setQty(1);
  }, [product.id, product.sizes]);

  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  return (
    <article className="wrap pdp">
      <div className="pdp-photo">
        <Photo src={product.image} alt={product.name} />
      </div>
      <div className="pdp-copy">
        <Link className="text-link" href={shopHref(product.category)}>
          {categoryLabel(product.category)}
        </Link>
        <h1>{product.name}</h1>
        <p className="price">{rupee(product.price)}</p>
        <p className="lede">{product.blurb}</p>
        <p>{product.details}</p>
        <fieldset className="sizes">
          <legend>{product.category === "bangles" ? "Bangle size" : "Size"}</legend>
          <div>
            {product.sizes.map((option) => (
              <button
                type="button"
                key={option}
                className={option === size ? "size on" : "size"}
                aria-pressed={option === size}
                onClick={() => setSize(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="buy-row">
          <div className="stepper" aria-label="Quantity">
            <button
              type="button"
              onClick={() => setQty((value) => Math.max(1, value - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span>{qty}</span>
            <button
              type="button"
              onClick={() => setQty((value) => Math.min(8, value + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button type="button" className="btn" onClick={() => addToCart(product, size, qty)}>
            Add to bag · {rupee(product.price * qty)}
          </button>
        </div>
        <dl className="specs">
          <div>
            <dt>Colour</dt>
            <dd>{product.color}</dd>
          </div>
          <div>
            <dt>Material</dt>
            <dd>{product.material}</dd>
          </div>
          <div>
            <dt>Care</dt>
            <dd>{product.care}</dd>
          </div>
        </dl>
      </div>
      <section className="related">
        <h2>More {categoryLabel(product.category).toLowerCase()}</h2>
        <div className="grid">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </article>
  );
}
