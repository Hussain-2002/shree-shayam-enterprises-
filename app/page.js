import Link from "next/link";
import { categories, heroImage, products, shopHref, storyImage } from "@/lib/data";
import { Photo } from "@/components/photo";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  const featured = products.filter((product) => product.badge);

  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">The studio edit</p>
          <h1>Suits, shoes, bed sheets, and things for the home.</h1>
          <p className="lede">
            A small demo shop for the whole family. Prices are samples, photos
            are from the open web, and the bag stays in this browser.
          </p>
          <div className="hero-actions">
            <Link className="btn" href="/shop/suits">
              Shop ladies suits
            </Link>
            <Link className="btn ghost" href="/shop/fabric">
              Shop bed sheets
            </Link>
          </div>
          <dl className="hero-facts">
            <div>
              <dt>{products.length}</dt>
              <dd>sample pieces</dd>
            </div>
            <div>
              <dt>XS–XL</dt>
              <dd>for clothes</dd>
            </div>
            <div>
              <dt>2.4–2.10</dt>
              <dd>bangle sizes</dd>
            </div>
          </dl>
        </div>
        <figure className="hero-photo">
          <Photo src={heroImage} alt="Woman in yellow and maroon traditional Indian attire" />
          <figcaption>Lehengas, kurtas, and gold — the edit this shop is built around.</figcaption>
        </figure>
      </section>

      <section className="wrap cats" aria-label="Categories">
        {categories.map((item) => {
          const cover = products.find((product) => product.category === item.id);
          return (
            <Link className="cat" key={item.id} href={shopHref(item.id)}>
              <Photo src={cover.image} alt="" />
              <span>
                <strong>{item.label}</strong>
                <em>{item.line}</em>
              </span>
            </Link>
          );
        })}
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Marked this week</h2>
          <Link className="text-link" href="/shop">
            See the full shop
          </Link>
        </div>
        <div className="grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="story wrap">
        <figure>
          <Photo src={storyImage} alt="Woman in traditional Indian attire wearing gold bangles" />
        </figure>
        <div>
          <p className="eyebrow">How the edit is built</p>
          <h2>Clothes for the family, and a few things for the house.</h2>
          <p>
            Ladies suits and sarees. Bed sheets and cotton cloth. Shoes,
            men’s t-shirts, kids’ clothes, and small things for the home.
            Dresses, lowers, and bangles are still here too.
          </p>
          <p>
            This is a front-end demo. Adding to the bag, changing a size, and
            placing an order all stay on your computer. Nothing is sent to a
            shop.
          </p>
          <Link className="btn" href="/shop/lowers">
            Shop lowers
          </Link>
        </div>
      </section>
    </>
  );
}
