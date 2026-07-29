"use client";

import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: "chicken-cheese" | "beef";
  title: string;
  description: string;
  image: string;
  accent: string;
};

const products: Product[] = [
  {
    id: "chicken-cheese",
    title: "Самса курица + сыр",
    description: "Нежная курица и тянущийся сыр в хрустящем тесте.",
    image: "/samsa-chicken-cheese-real.jpg",
    accent: "#f5c46a",
  },
  {
    id: "beef",
    title: "Самса говядина",
    description: "Сочная говядина с луком — сытный классический вкус.",
    image: "/samsa-beef-real.jpg",
    accent: "#e6a17b",
  },
];

export default function Home() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [delivery, setDelivery] = useState<"pickup" | "courier">("pickup");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const cartItems = useMemo(
    () => products.filter((product) => (quantities[product.id] ?? 0) > 0),
    [quantities],
  );
  const itemCount = Object.values(quantities).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  function changeQuantity(productId: Product["id"], amount: number) {
    setSubmitted(false);
    setQuantities((current) => {
      const nextAmount = Math.max(0, (current[productId] ?? 0) + amount);
      return { ...current, [productId]: nextAmount };
    });
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      setMessage("Пожалуйста, укажите имя и телефон — так мы сможем подтвердить заказ.");
      return;
    }
    setMessage("");
    setSubmitted(true);
  }

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <nav className="nav container" aria-label="Основная навигация">
          <a className="brand" href="#top" aria-label="insta-samsa — наверх">
            <span className="brand-mark">i</span>
            <span>insta<br />samsa</span>
          </a>
          <div className="nav-actions">
            <a href="#menu">Меню</a>
            <a className="cart-link" href="#order">
              Заказ <span>{itemCount}</span>
            </a>
          </div>
        </nav>

        <div id="top" className="hero-grid container">
          <div className="hero-copy">
            <p className="eyebrow"><span /> выпечка с характером</p>
            <h1 id="hero-title">Самса,<br /><em>в которую</em><br />влюбляешься.</h1>
            <p className="hero-text">
              Румяная корочка, щедрая начинка и тот самый аромат, который остаётся в памяти.
            </p>
            <div className="hero-switcher" role="group" aria-label="Быстрый выбор самсы">
              <p>Выберите свою самсу</p>
              <div>
                {products.map((product) => {
                  const quantity = quantities[product.id] ?? 0;
                  return (
                    <button
                      type="button"
                      key={product.id}
                      className={quantity ? "hero-option is-chosen" : "hero-option"}
                      onClick={() => changeQuantity(product.id, 1)}
                    >
                      <span className="option-samsa" aria-hidden="true" />
                      <span>{product.id === "chicken-cheese" ? "Курица + сыр" : "Говядина"}</span>
                      <b>{quantity ? `${quantity} шт.` : "+"}</b>
                    </button>
                  );
                })}
              </div>
            </div>
            <a className="button button-dark" href="#order">Оформить заказ <span>→</span></a>
            <p className="availability">Готовим каждый день · 10:00–20:00</p>
          </div>
          <div className="hero-photo-wrap" aria-label="Свежая выпечка">
            <div className="hero-sticker">insta<br />samsa</div>
            <div className="hero-photo">
              <img
                src="/samsa-beef-real.jpg"
                alt="Румяная свежая выпечка"
              />
            </div>
            <div className="hero-mini-photo" aria-hidden="true">
              <img src="/samsa-platter-cc.jpg" alt="" />
            </div>
            <p className="hero-side-note">хрустящее<br />тесто · сочная<br />начинка</p>
          </div>
          <div className="hero-food-elements" aria-hidden="true">
            <div className="rolling-pin" />
            <div className="flour">
              <i /><i /><i /><i /><i /><i /><i />
            </div>
            <div className="meat-piece"><i /><i /><i /></div>
            <div className="mini-samsas"><i /><i /><i /></div>
          </div>
        </div>
        <div className="hero-sun" aria-hidden="true" />
      </section>

      <section id="menu" className="menu-section container" aria-labelledby="menu-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> выберите вкус</p>
            <h2 id="menu-title">Ваша самса<br /><em>сегодня</em></h2>
          </div>
          <p className="section-intro">Выберите одну или несколько начинок. Мы всё бережно соберём.</p>
        </div>

        <div className="product-grid">
          {products.map((product, index) => {
            const quantity = quantities[product.id] ?? 0;
            return (
              <article className="product-card" key={product.id}>
                <div className="product-image" style={{ backgroundColor: product.accent }}>
                  <span className="product-number">0{index + 1}</span>
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="product-content">
                  <div>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                  </div>
                  {quantity === 0 ? (
                    <button className="add-button" onClick={() => changeQuantity(product.id, 1)}>
                      Добавить <span>+</span>
                    </button>
                  ) : (
                    <div className="quantity-picker" aria-label={`Количество: ${product.title}`}>
                      <button onClick={() => changeQuantity(product.id, -1)} aria-label="Убрать одну">−</button>
                      <strong>{quantity}</strong>
                      <button onClick={() => changeQuantity(product.id, 1)} aria-label="Добавить ещё одну">+</button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="order" className="order-section">
        <div className="container order-grid">
          <div className="order-intro">
            <p className="eyebrow eyebrow-light"><span /> почти готово</p>
            <h2>Соберём ваш<br /><em>заказ</em></h2>
            <p>Оставьте контакты — уточним время и приготовим самсу к вашему приходу.</p>
            <div className="order-ornament" aria-hidden="true">✦</div>
          </div>

          <div className="order-card">
            <div className="order-card-header">
              <h3>Ваш заказ</h3>
              <span aria-live="polite">{itemCount ? `${itemCount} шт.` : "пусто"}</span>
            </div>
            {cartItems.length > 0 ? (
              <ul className="cart-list">
                {cartItems.map((product) => (
                  <li key={product.id}>
                    <span>{product.title}</span>
                    <div className="inline-quantity">
                      <button onClick={() => changeQuantity(product.id, -1)} aria-label={`Убрать ${product.title}`}>−</button>
                      <b>{quantities[product.id]}</b>
                      <button onClick={() => changeQuantity(product.id, 1)} aria-label={`Добавить ${product.title}`}>+</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-cart">Выберите начинку выше — здесь появится ваш заказ.</p>
            )}

            <form onSubmit={submitOrder}>
              <fieldset disabled={itemCount === 0}>
                <legend>Как получить заказ?</legend>
                <div className="delivery-choice">
                  <button
                    type="button"
                    className={delivery === "pickup" ? "selected" : ""}
                    onClick={() => setDelivery("pickup")}
                  >Самовывоз</button>
                  <button
                    type="button"
                    className={delivery === "courier" ? "selected" : ""}
                    onClick={() => setDelivery("courier")}
                  >Доставка</button>
                </div>
                <label>
                  Ваше имя
                  <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Например, Анна" autoComplete="name" />
                </label>
                <label>
                  Телефон
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 900 000-00-00" type="tel" autoComplete="tel" />
                </label>
                {message && <p className="form-message" role="alert">{message}</p>}
                <button className="button button-primary" type="submit">Оформить заказ <span>→</span></button>
              </fieldset>
            </form>
            {submitted && (
              <div className="confirmation" role="status">
                <strong>Спасибо, {customerName}!</strong>
                <span>Заявка на {itemCount} шт. принята. Скоро свяжемся с вами для подтверждения.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="footer container">
        <a className="brand footer-brand" href="#top"><span className="brand-mark">i</span><span>insta<br />samsa</span></a>
        <p>Тёплая самса для хорошего дня.</p>
        <div className="footer-links">
          <a href="https://commons.wikimedia.org/wiki/File:Sambusa_-_traditional_Tajik_pies_with_meat.jpg" target="_blank" rel="noreferrer">Фото: Parvision, CC BY-SA 4.0</a>
          <a href="#top">Наверх ↑</a>
        </div>
      </footer>
    </main>
  );
}
