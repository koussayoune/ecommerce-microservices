const CATALOG_API = "http://localhost:8000";
const BASKET_API = "http://localhost:8001";

// Get all products from Catalog API
export async function getCatalog() {
  const res = await fetch(`${CATALOG_API}/api/v1/Catalog`);
  if (!res.ok) throw new Error("Failed to fetch catalog");
  return res.json();
}

// Add a product to the basket
export async function addToBasket(userId, body) {
  const res = await fetch(`${BASKET_API}/api/v1/Basket/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to add item to basket");
  return res.json();
}

// Get basket items for a user
export async function getBasket(userId) {
  const res = await fetch(`${BASKET_API}/api/v1/Basket/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch basket");
  return res.json();
}
