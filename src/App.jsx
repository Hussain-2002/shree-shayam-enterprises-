import { useEffect, useMemo, useState } from "react";
import {
  categories,
  categoryLabel,
  findProduct,
  heroImage,
  products,
  rupee,
  storyImage,
} from "./data";

const CART_KEY = "shree-shyam-cart";

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [page, setPage] = useState("home");
  const [category, setCategory] = useState("all");
  const [productId, setProductId] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const activeProduct = findProduct(productId);

  function goHome() {
    setPage("home");
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }

  function goShop(nextCategory = "all") {
    setCategory(nextCategory);
    setPage("shop");
    setQuery("");
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }

  function openProduct(id) {
    setProductId(id);
    setPage("product");
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }

  function addToCart(product, size, qty = 1) {
    setCart((current) => {
      const key = `${product.id}-${size}`;
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, qty: Math.min(8, item.qty + qty) } : item
        );
      }
      return [
        ...current,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          qty,
        },
      ];
    });
    setOrder(null);
    setToast(`${product.name} added to your bag`);
  }

  function updateQty(key, qty) {
    setCart((current) =>
      current.map((item) => (item.key === key ? { ...item, qty } : item))
    );
  }

  function removeItem(key) {
    setCart((current) => current.filter((item) => item.key !== key));
  }

  function checkout() {
    if (!cart.length) return;
    setOrder({
      id: `SSE${Date.now().toString().slice(-6)}`,
      pieces: count,
      total: subtotal,
    });
    setCart([]);
  }

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header
        count={count}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onHome={goHome}
        onShop={goShop}
        onOpenCart={() => setCartOpen(true)}
      />
      <main id="main">
        {page === "home" && (
          <Home onShop={goShop} onOpenProduct={openProduct} />
        )}
        {page === "shop" && (
          <Shop
            category={category}
            query={query}
            sort={sort}
            onCategory={setCategory}
            onQuery={setQuery}
            onSort={setSort}
            onOpenProduct={openProduct}
          />
        )}
        {page === "product" && activeProduct && (
          <ProductPage
            product={activeProduct}
            onShop={goShop}
            onOpenProduct={openProduct}
            onAdd={addToCart}
          />
        )}
        {page === "product" && !activeProduct && (
          <section className="wrap empty-page">
            <h1>That piece is not in the studio.</h1>
            <button type="button" className="btn" onClick={() => goShop("all")}>
              Back to the shop
            </button>
          </section>
        )}
      </main>
      <Footer onShop={goShop} />
      {cartOpen && (
        <CartDrawer
          cart={cart}
          subtotal={subtotal}
          order={order}
          onClose={() => setCartOpen(false)}
          onQty={updateQty}
          onRemove={removeItem}
          onCheckout={checkout}
          onBrowse={() => {
            setCartOpen(false);
            setOrder(null);
            goShop("all");
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <span>{toast}</span>
          <button type="button" onClick={() => setCartOpen(true)}>
            View bag
          </button>
        </div>
      )}
    </>
  );
}

function Header({ count, menuOpen, onToggleMenu, onHome, onShop, onOpenCart }) {
  return (
    <header className="site-header">
      <p className="announce">
        Demo boutique · sample prices in rupees · checkout does not charge a card
      </p>
      <div className="nav wrap">
        <button
          type="button"
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={onToggleMenu}
        >
          <span />
          <span />
        </button>
        <button type="button" className="logo" onClick={onHome}>
          <BrandName />
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Shop">
          <button type="button" onClick={() => onShop("all")}>
            Shop
          </button>
          <button type="button" onClick={() => onShop("dresses")}>
            Dresses
          </button>
          <button type="button" onClick={() => onShop("lowers")}>
            Lowers
          </button>
          <button type="button" onClick={() => onShop("bangles")}>
            Bangles
          </button>
        </nav>
        <button
          type="button"
          className="bag-btn"
          onClick={onOpenCart}
          aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
        >
          <svg className="bag-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6.2 7.5h11.6l-.9 12.2H7.1L6.2 7.5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M9 7.5V6.4a3 3 0 0 1 6 0v1.1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span>{count}</span>
        </button>
      </div>
    </header>
  );
}

function Home({ onShop, onOpenProduct }) {
  const featured = products.filter((product) => product.badge);
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">The studio edit</p>
          <h1>Dresses, lowers, and bangles for the long afternoon.</h1>
          <p className="lede">
            A small demo shop of women’s clothes and jewellery. Every price is
            a sample, every photograph is from the open web, and the bag lives
            only in this browser.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn" onClick={() => onShop("dresses")}>
              Shop dresses
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => onShop("bangles")}
            >
              Shop bangles
            </button>
          </div>
          <dl className="hero-facts">
            <div>
              <dt>15</dt>
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
            <button
              type="button"
              className="cat"
              key={item.id}
              onClick={() => onShop(item.id)}
            >
              <Photo src={cover.image} alt="" />
              <span>
                <strong>{item.label}</strong>
                <em>{item.line}</em>
              </span>
            </button>
          );
        })}
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Marked this week</h2>
          <button type="button" className="text-link" onClick={() => onShop("all")}>
            See the full shop
          </button>
        </div>
        <div className="grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
          ))}
        </div>
      </section>

      <section className="story wrap">
        <figure>
          <Photo src={storyImage} alt="Woman in traditional Indian attire wearing gold bangles" />
        </figure>
        <div>
          <p className="eyebrow">How the edit is built</p>
          <h2>Three categories, nothing else.</h2>
          <p>
            Dresses for the day and the evening. Lowers — palazzos and straight
            pants — to wear under a short kurta or on their own. Bangles in the
            sizes people actually ask for.
          </p>
          <p>
            This is a front-end demo. Adding to the bag, changing a size, and
            placing an order all stay on your computer. Nothing is sent to a
            shop.
          </p>
          <button type="button" className="btn" onClick={() => onShop("lowers")}>
            Shop lowers
          </button>
        </div>
      </section>
    </>
  );
}

function Shop({ category, query, sort, onCategory, onQuery, onSort, onOpenProduct }) {
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

  const title =
    category === "all" ? "The full shop" : categoryLabel(category);

  return (
    <section className="wrap shop">
      <header className="shop-intro">
        <p className="eyebrow">Shree Shyam Enterprises</p>
        <h1>{title}</h1>
        <p>
          {category === "all"
            ? "Dresses, lowers, and bangles. Filter by what you came for."
            : categories.find((item) => item.id === category)?.line}
        </p>
      </header>
      <div className="toolbar">
        <div className="chips" role="tablist" aria-label="Filter by category">
          <button
            type="button"
            className={category === "all" ? "chip on" : "chip"}
            onClick={() => onCategory("all")}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              type="button"
              key={item.id}
              className={category === item.id ? "chip on" : "chip"}
              onClick={() => onCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="shop-search">Search</label>
          <input
            id="shop-search"
            type="search"
            placeholder="Try maroon, ikat, gold…"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
          />
        </form>
        <label className="sort">
          Sort
          <select value={sort} onChange={(event) => onSort(event.target.value)}>
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
          <p>Try a dress, a lower, or a bangle.</p>
          <button type="button" className="btn ghost" onClick={() => onQuery("")}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductPage({ product, onShop, onOpenProduct, onAdd }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setSize(product.sizes[0]);
    setQty(1);
  }, [product]);

  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  return (
    <article className="wrap pdp">
      <div className="pdp-photo">
        <Photo src={product.image} alt={product.name} />
      </div>
      <div className="pdp-copy">
        <button type="button" className="text-link" onClick={() => onShop(product.category)}>
          {categoryLabel(product.category)}
        </button>
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
            <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
              −
            </button>
            <span>{qty}</span>
            <button type="button" onClick={() => setQty((value) => Math.min(8, value + 1))} aria-label="Increase quantity">
              +
            </button>
          </div>
          <button type="button" className="btn" onClick={() => onAdd(product, size, qty)}>
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
            <ProductCard key={item.id} product={item} onOpen={onOpenProduct} />
          ))}
        </div>
      </section>
    </article>
  );
}

function ProductCard({ product, onOpen }) {
  return (
    <article className="card">
      <button type="button" className="card-hit" onClick={() => onOpen(product.id)}>
        <span className="card-photo">
          {product.badge && <em className="badge">{product.badge}</em>}
          <Photo src={product.image} alt={product.name} />
        </span>
        <span className="card-meta">
          <small>{categoryLabel(product.category)}</small>
          <strong>{product.name}</strong>
          <span>{rupee(product.price)}</span>
        </span>
      </button>
    </article>
  );
}

function CartDrawer({
  cart,
  subtotal,
  order,
  onClose,
  onQty,
  onRemove,
  onCheckout,
  onBrowse,
}) {
  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="drawer-root">
      <button type="button" className="backdrop" aria-label="Close bag" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title">
        <header className="drawer-head">
          <h2 id="bag-title">{order ? "Order placed" : "Your bag"}</h2>
          <button type="button" onClick={onClose} aria-label="Close bag">
            Close
          </button>
        </header>
        {order ? (
          <div className="order-note">
            <p className="eyebrow">Demo only</p>
            <h3>Thank you. This order was not charged.</h3>
            <p>
              Reference <strong>{order.id}</strong> · {order.pieces}{" "}
              {order.pieces === 1 ? "piece" : "pieces"} · {rupee(order.total)}
            </p>
            <p>Nothing left this browser. Use it to show the flow, then keep browsing.</p>
            <button type="button" className="btn" onClick={onBrowse}>
              Keep browsing
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="order-note">
            <h3>Your bag is empty.</h3>
            <p>Dresses, lowers, and bangles are waiting in the shop.</p>
            <button type="button" className="btn" onClick={onBrowse}>
              Browse the edit
            </button>
          </div>
        ) : (
          <>
            <ul className="lines">
              {cart.map((item) => (
                <li key={item.key}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                    <p>Size {item.size}</p>
                    <div className="line-actions">
                      <div className="stepper">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name}`}
                          onClick={() => onQty(item.key, Math.max(1, item.qty - 1))}
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name}`}
                          onClick={() => onQty(item.key, Math.min(8, item.qty + 1))}
                        >
                          +
                        </button>
                      </div>
                      <button type="button" className="text-link" onClick={() => onRemove(item.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="line-price">{rupee(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <footer className="drawer-foot">
              <p>
                <span>Subtotal</span>
                <strong>{rupee(subtotal)}</strong>
              </p>
              <small>Shipping is free in this demo. No payment is taken.</small>
              <button type="button" className="btn" onClick={onCheckout}>
                Place demo order
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

function Footer({ onShop }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="logo footer-logo">
            <BrandName />
          </p>
          <p>A demo boutique for dresses, lowers, and bangles.</p>
        </div>
        <div>
          <p className="eyebrow">Visit</p>
          <button type="button" onClick={() => onShop("dresses")}>
            Dresses
          </button>
          <button type="button" onClick={() => onShop("lowers")}>
            Lowers
          </button>
          <button type="button" onClick={() => onShop("bangles")}>
            Bangles
          </button>
        </div>
        <div>
          <p className="eyebrow">Note</p>
          <p>
            Photographs are served from Unsplash. Prices, sizes, and product
            names are sample data for this demo.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Photo({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="photo-fallback">{alt || "Shree Shyam Enterprises"}</span>;
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
}

function BrandName() {
  return (
    <>
      <span className="mark" aria-hidden="true" />
      <span className="logo-words">
        Shree Shyam
        <small>Enterprises</small>
      </span>
    </>
  );
}
