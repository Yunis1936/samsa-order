import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the insta-samsa order page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>insta-samsa — заказать свежую самсу<\/title>/i);
  assert.match(html, /Соберём/);
  assert.match(html, /самса-брейк/);
  assert.match(html, /Курица \+ сыр/);
  assert.match(html, /Говядина/);
  assert.match(html, /Ваша корзина/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("keeps the ordering contract limited to two items and two name fields", async () => {
  const [page, route] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/orders/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /id: "chicken-cheese"/);
  assert.match(page, /id: "beef"/);
  assert.match(page, /Имя/);
  assert.match(page, /Фамилия/);
  assert.doesNotMatch(page, /Номер телефона|Способ доставки|Способ получения/);
  assert.match(page, /setQuantities\(\{\}\)/);
  assert.match(page, /setCustomerName\(""\)/);
  assert.match(page, /setLastName\(""\)/);
  assert.match(route, /GOOGLE_ORDERS_WEBHOOK_URL/);
  assert.match(route, /GOOGLE_ORDERS_WEBHOOK_SECRET/);
});
