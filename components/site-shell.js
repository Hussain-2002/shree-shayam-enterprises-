"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { categories, rupee, shopHref } from "@/lib/data";
import { useCart } from "./cart-provider";

export function SiteShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const {
    count,
    cart,
    subtotal,
    cartOpen,
    setCartOpen,
    toast,
    order,
    setOrder,
    updateQty,
    removeItem,
    checkout,
  } = useCart();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header
        count={count}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onOpenCart={() => setCartOpen(true)}
        onNavigate={() => setMenuOpen(false)}
      />
      <main id="main">{children}</main>
      <Footer />
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

function Header({ count, menuOpen, onToggleMenu, onOpenCart, onNavigate }) {
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
        <Link className="logo" href="/" onClick={onNavigate}>
          <BrandName />
        </Link>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Shop">
          <Link href="/shop" onClick={onNavigate}>
            Shop
          </Link>
          <Link href="/shop/dresses" onClick={onNavigate}>
            Dresses
          </Link>
          <Link href="/shop/lowers" onClick={onNavigate}>
            Lowers
          </Link>
          <Link href="/shop/bangles" onClick={onNavigate}>
            Bangles
          </Link>
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

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="logo footer-logo">
            <BrandName />
          </p>
          <p>A demo shop for clothes, shoes, bed sheets, and home things.</p>
        </div>
        <div>
          <p className="eyebrow">Visit</p>
          {categories.map((item) => (
            <Link key={item.id} href={shopHref(item.id)}>
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <p className="eyebrow">Note</p>
          <p>
            Product photographs are sample pictures saved with this demo.
            Prices, sizes, and names are sample data too.
          </p>
        </div>
      </div>
    </footer>
  );
}

function CartDrawer({ cart, subtotal, order, onClose, onQty, onRemove, onCheckout, onBrowse }) {
  const router = useRouter();

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function browse() {
    onBrowse();
    router.push("/shop");
  }

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
            <button type="button" className="btn" onClick={browse}>
              Keep browsing
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="order-note">
            <h3>Your bag is empty.</h3>
            <p>Suits, shoes, bed sheets, and more are waiting in the shop.</p>
            <button type="button" className="btn" onClick={browse}>
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
