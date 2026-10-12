"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { categories, categoryLabel, products, shopHref } from "@/lib/data";
import { ProductCard } from "./product-card";

export function Shop({ category }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setQuery("");
  }, [category]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const inCategory = category === "all" || product.category === category;
      if (!inCategory) return false;
      if (!needle) return true;
      return [product.name, product.category, product.color, product.material]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [category, query, sort]);

  const title = category === "all" ? "The full shop" : categoryLabel(category);

  return (
    <section className="wrap shop">
      <header className="shop-intro">
        <p className="eyebrow">Shree Shyam Enterprises</p>
        <h1>{title}</h1>
        <p>
          {category === "all"
            ? "Suits, bed sheets, shoes, kids’ clothes, and more. Filter by what you came for."
            : categories.find((item) => item.id === category)?.line}
        </p>
      </header>
      <div className="toolbar">
        <div className="chips" role="tablist" aria-label="Filter by category">
          <Link className={category === "all" ? "chip on" : "chip"} href="/shop">
            All
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              className={category === item.id ? "chip on" : "chip"}
              href={shopHref(item.id)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="shop-search">Search</label>
          <input
            id="shop-search"
            type="search"
            placeholder="Try saree, bed sheet, shoes…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
        <label className="sort">
          Sort
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      <p className="count">
        {visible.length} {visible.length === 1 ? "piece" : "pieces"}
      </p>
      {visible.length === 0 ? (
        <div className="empty-page">
          <h2>Nothing matches that.</h2>
          <p>Try a suit, a bed sheet, or shoes.</p>
          <button type="button" className="btn ghost" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
