"use client";

import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: "chicken-cheese" | "beef";
  title: string;
  description: string;
  tag: string;
  image: string;
  tone: "sun" | "tomato";
};

type Confirmation = {
  customerName: string;
  lastName: string;
  itemCount: number;
};

const products: Product[] = [
  {
    id: "chicken-cheese",
    title: "Курица + сыр",
    description: "Нежная курица и тянущийся сыр в хрустящем тесте.",
    tag: "самая уютная",
    image: "/samsa-chicken-cheese-real.jpg",
    tone: "sun",
  },
  {
    id: "beef",
    title: "Говядина",
    description: "Сочная говядина с луком — тот самый сытный вариант.",
    tag: "заряжает",
    image: "/samsa-beef-real.jpg",
    tone: "tomato",
  },
];

export default function Home() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = useMemo(
    () => products.filter((product) => (quantities[product.id] ?? 0) > 0),
    [quantities],
  );
  const itemCount = Object.values(quantities).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  function changeQuantity(productId: Product["id"], amount: number) {
    setConfirmation(null);
    setQuantities((current) => {
      const nextAmount = Math.max(0, (current[productId] ?? 0) + amount);
      return { ...current, [productId]: nextAmount };
    });
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customerName.trim() || !lastName.trim()) {
      setMessage("Укажите имя и фамилию — так поймём, чей это заказ.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setConfirmation(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          lastName,
          items: cartItems.map((product) => ({
            id: product.id,
            quantity: quantities[product.id],
          })),
        }),
      });
      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "Не удалось отправить заказ.");
      }

      setConfirmation({
        customerName: customerName.trim(),
        lastName: lastName.trim(),
        itemCount,
      });
      setQuantities({});
      setCustomerName("");
      setLastName("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось отправить заказ. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <nav className="nav container" aria-label="Основная навигация">
          <a className="brand" href="#top" aria-label="insta-samsa — наверх">
            <span className="brand-mark" aria-hidden="true">◒</span>
            <span>insta<br />samsa</span>
          </a>
          <div className="nav-actions">
            <a href="#menu">Меню</a>
            <a className="cart-link" href="#order">
              Корзина <span>{itemCount}</span>
            </a>
          </div>
        </nav>

        <div className="hero-grid container">
          <div className="hero-copy">
            <p className="kicker"><span>✦</span> план на перерыв готов</p>
            <h1 id="hero-title">Соберём<br /><em>самса-брейк</em><br />за пару кликов.</h1>
            <p className="hero-text">
              Когда хочется отвлечься, похрустеть и обсудить всё, кроме работы.
            </p>
            <a className="hero-link" href="#menu">Выбрать начинку <span>↓</span></a>
            <p className="hero-note">Две любимые начинки · одна общая причина сделать перерыв</p>
          </div>

          <div className="hero-collage" aria-label="Свежая самса и нарисованные детали">
            <div className="route-line route-line-one" aria-hidden="true" />
            <div className="route-line route-line-two" aria-hidden="true" />
            <div className="photo-burst" aria-hidden="true" />
            <div className="hero-photo">
              <img src="/samsa-beef-real.jpg" alt="Румяная самса с говядиной" />
            </div>
            <div className="hero-chip chip-yellow">хруст<br />на паузе</div>
            <div className="hero-chip chip-blue">обед<br />заслужен</div>
            <div className="hero-mini-photo" aria-hidden="true">
              <img src="/samsa-platter-cc.jpg" alt="" />
            </div>
            <div className="drawn-pin" aria-hidden="true"><i /><i /></div>
            <div className="flour-cloud" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
            <div className="samsa-squad" aria-hidden="true"><i /><i /><i /></div>
          </div>
        </div>
      </section>

      <section className="break-map container" aria-labelledby="break-map-title">
        <div className="map-heading">
          <p className="kicker"><span>✦</span> быстрый маршрут</p>
          <h2 id="break-map-title">От «что бы съесть?»<br />до <em>счастливого брейка.</em></h2>
        </div>
        <div className="map-stops" aria-label="Как собрать заказ">
          <article className="map-stop map-stop-yellow">
            <span className="map-icon" aria-hidden="true">◢</span>
            <div><b>Выбираем</b><p>берём любимую начинку</p></div>
          </article>
          <span className="map-dots" aria-hidden="true">······</span>
          <article className="map-stop map-stop-blue">
            <span className="map-icon" aria-hidden="true">+</span>
            <div><b>Собираем</b><p>добавляем в общий заказ</p></div>
          </article>
          <span className="map-dots" aria-hidden="true">······</span>
          <article className="map-stop map-stop-tomato">
            <span className="map-icon" aria-hidden="true">✦</span>
            <div><b>Хрустит</b><p>начинается нормальный перерыв</p></div>
          </article>
        </div>
      </section>

      <section className="menu-section" id="menu" aria-labelledby="menu-title">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="kicker"><span>✦</span> сегодня в меню</p>
              <h2 id="menu-title">Выбирайте<br /><em>свою самсу.</em></h2>
            </div>
            <p className="section-intro">Можно взять один вкус. Можно оба. Никто не осудит.</p>
          </div>

          <div className="product-grid">
            {products.map((product) => {
              const quantity = quantities[product.id] ?? 0;
              return (
                <article className={`product-card product-card-${product.tone}`} key={product.id}>
                  <div className="product-image">
                    <span className="product-tag">{product.tag}</span>
                    <span className="product-scribble" aria-hidden="true">✦</span>
                    <img src={product.image} alt={`Самса ${product.title.toLowerCase()}`} />
                  </div>
                  <div className="product-content">
                    <div>
                      <p className="product-kicker">самса</p>
                      <h3>{product.title}</h3>
                      <p>{product.description}</p>
                    </div>
                    {quantity === 0 ? (
                      <button className="add-button" onClick={() => changeQuantity(product.id, 1)}>
                        Добавить в брейк <span>+</span>
                      </button>
                    ) : (
                      <div className="quantity-picker" aria-label={`Количество: Самса ${product.title}`}>
                        <button onClick={() => changeQuantity(product.id, -1)} aria-label="Убрать одну">−</button>
                        <strong>{quantity}<small> шт.</small></strong>
                        <button onClick={() => changeQuantity(product.id, 1)} aria-label="Добавить ещё одну">+</button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="order" className="order-section" aria-labelledby="order-title">
        <div className="container order-grid">
          <div className="order-intro">
            <p className="kicker kicker-light"><span>✦</span> почти у цели</p>
            <h2 id="order-title">Ваш<br /><em>самса-брейк</em></h2>
            <p>Оставьте имя и фамилию — заказ сразу улетит в общий список.</p>
            <div className="order-doodle" aria-hidden="true">
              <span>◢</span><i>····</i><span>✦</span>
            </div>
          </div>

          <div className="order-card">
            <div className="order-card-header">
              <div><p>собираем</p><h3>Ваша корзина</h3></div>
              <span aria-live="polite">{itemCount ? `${itemCount} шт.` : "пусто"}</span>
            </div>
            {cartItems.length > 0 ? (
              <ul className="cart-list">
                {cartItems.map((product) => (
                  <li key={product.id}>
                    <span>{product.title}</span>
                    <b>× {quantities[product.id]}</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-cart">Выберите начинку выше — здесь появится ваш брейк.</p>
            )}

            <form onSubmit={submitOrder}>
              <fieldset disabled={itemCount === 0} aria-label="Контакты для заказа">
                <div className="name-fields">
                  <label>
                    Имя
                    <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Например, Аня" autoComplete="given-name" />
                  </label>
                  <label>
                    Фамилия
                    <input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Например, Смирнова" autoComplete="family-name" />
                  </label>
                </div>
                {message && <p className="form-message" role="alert">{message}</p>}
                <button className="button button-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Отправляем…" : "Оформить самса-брейк"} <span>→</span>
                </button>
              </fieldset>
            </form>
            {confirmation && (
              <div className="confirmation" role="status">
                <span aria-hidden="true">✦</span>
                <div><strong>Готово, {confirmation.customerName} {confirmation.lastName}!</strong><p>В общий список добавлено: {confirmation.itemCount} шт.</p></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="footer container">
        <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true">◒</span><span>insta<br />samsa</span></a>
        <p>Самса любит перерывы. И людей тоже.</p>
        <div className="footer-links">
          <a href="https://commons.wikimedia.org/wiki/File:Sambusa_-_traditional_Tajik_pies_with_meat.jpg" target="_blank" rel="noreferrer">Фото еды</a>
          <a href="#top">Наверх ↑</a>
        </div>
      </footer>
    </main>
  );
}
