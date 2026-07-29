const PRODUCTS = {
  "chicken-cheese": "Самса курица + сыр",
  beef: "Самса говядина",
} as const;

type ProductId = keyof typeof PRODUCTS;

type OrderItem = {
  id?: unknown;
  quantity?: unknown;
};

type OrderRequest = {
  customerName?: unknown;
  lastName?: unknown;
  delivery?: unknown;
  items?: unknown;
};

function getText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && value in PRODUCTS;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.GOOGLE_ORDERS_WEBHOOK_URL;
  const webhookSecret = process.env.GOOGLE_ORDERS_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return Response.json(
      { error: "Приём заказов ещё настраивается. Попробуйте чуть позже." },
      { status: 503 },
    );
  }

  try {
    const payload = (await request.json()) as OrderRequest;
    const customerName = getText(payload.customerName, 60);
    const lastName = getText(payload.lastName, 60);
    const delivery = payload.delivery === "courier" ? "Доставка" : "Самовывоз";

    const items = Array.isArray(payload.items)
      ? payload.items.flatMap((item: OrderItem) => {
          if (!isProductId(item.id) || typeof item.quantity !== "number") return [];
          const quantity = Math.floor(item.quantity);
          if (quantity < 1 || quantity > 30) return [];
          return [{ id: item.id, quantity }];
        })
      : [];

    if (!customerName || !lastName || items.length === 0) {
      return Response.json({ error: "Проверьте состав заказа и контакты." }, { status: 400 });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        secret: webhookSecret,
        customerName,
        lastName,
        delivery,
        items,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script returned ${response.status}`);
    }

    const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
    if (!result?.ok) {
      throw new Error("Google Apps Script did not accept the order");
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Order delivery failed", error);
    return Response.json(
      { error: "Не удалось отправить заказ. Пожалуйста, попробуйте ещё раз." },
      { status: 502 },
    );
  }
}
