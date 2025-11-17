const BASKET_API = "http://localhost:8001";

export async function getBasket(userName) {
  const res = await fetch(`${BASKET_API}/api/v1/Basket?userName=${userName}`);
  if (!res.ok) throw new Error("Failed to fetch basket");
  return res.json();
}

export async function removeItemFromBasket(userName, productId) {
  const res = await fetch(`${BASKET_API}/api/v1/Basket/${userName}/item/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove item from basket");
  return res.json();
}

export async function clearBasket(userName) {
  const res = await fetch(`${BASKET_API}/api/v1/Basket/${userName}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to clear basket");
  return res.json();
}
