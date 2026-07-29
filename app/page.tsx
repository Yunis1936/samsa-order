"use client";

import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: "chicken" | "cheese" | "beef";
  name: string;
  description: string;
  image: string;
  accent: string;
};

const products: Product[] = [
  {
    id: "chicken",
    name: "Курица",
    description: "Нежное филе, лук и щепотка ароматных специй.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
    accent: "#f5c46a",
  },
  {
    id: "cheese",
    name: "Сыр",
    description: "Тянущийся сыр и зелень в хрустящем слоёном тесте.",
    image:
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=900&q=85",
    accent: "#d9e7ae",
  },
  {
    id: "beef",
    name: "Говядина",
    description: "Сочная говядина с луком — сытный классический вкус.",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85",
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
          <a className="brand" href="#top" aria-label="Самса у дома — наверх">
            <span className="brand-mark">С</span>
            <span>самса<br />у дома</span>
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
            <p className="eyebrow"><span /> с пылу, с жару</p>
            <h1 id="hero-title">Самса,<br /><em>которую</em><br />ждут.</h1>
            <p className="hero-text">
              Румяная корочка, щедрая начинка и тот самый аромат свежей выпечки.
            </p>
            <a className="button button-dark" href="#menu">Выбрать начинку <span>↓</span></a>
            <p className="availability">Готовим каждый день · 10:00–20:00</p>
          </div>
          <div className="hero-photo-wrap" aria-label="Свежая выпечка">
            <div className="hero-sticker">свежая<br />выпечка</div>
            <div className="hero-photo">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1500&q=90"
                alt="Румяная свежая выпечка"
              />
            </div>
            <p className="hero-side-note">хрустящее<br />тесто · сочная<br />начинка</p>
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
                  <img src={product.image} alt={`Самса: ${product.name.toLowerCase()}`} />
                </div>
                <div className="product-content">
                  <div>
                    <h3>Самса с {product.name.toLowerCase()}</h3>
                    <p>{product.description}</p>
                  </div>
                  {quantity === 0 ? (
                    <button className="add-button" onClick={() => changeQuantity(product.id, 1)}>
                      Добавить <span>+</span>
                    </button>
                  ) : (
                    <div className="quantity-picker" aria-label={`Количество: самса с ${product.name.toLowerCase()}`}>
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
                    <span>Самса с {product.name.toLowerCase()}</span>
                    <div className="inline-quantity">
                      <button onClick={() => changeQuantity(product.id, -1)} aria-label={`Убрать самсу с ${product.name.toLowerCase()}`}>−</button>
                      <b>{quantities[product.id]}</b>
                      <button onClick={() => changeQuantity(product.id, 1)} aria-label={`Добавить самсу с ${product.name.toLowerCase()}`}>+</button>
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
        <a className="brand footer-brand" href="#top"><span className="brand-mark">С</span><span>самса<br />у дома</span></a>
        <p>Тёплая самса для хорошего дня.</p>
        <a href="#top">Наверх ↑</a>
      </footer>
    </main>
  );
}
