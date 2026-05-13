export type PendingCartAction = {
  sku: string;
  quantity?: number;
  coupon_code?: string;
};

const PENDING_CART_ACTION_KEY = "pending_cart_action";

export const setPendingCartAction = (action: PendingCartAction) => {
  try {
    sessionStorage.setItem(PENDING_CART_ACTION_KEY, JSON.stringify(action));
  } catch {
    // Ignore storage errors in private mode or restricted environments.
  }
};

export const getPendingCartAction = (): PendingCartAction | null => {
  try {
    const raw = sessionStorage.getItem(PENDING_CART_ACTION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PendingCartAction;
    if (!parsed?.sku || typeof parsed.sku !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearPendingCartAction = () => {
  try {
    sessionStorage.removeItem(PENDING_CART_ACTION_KEY);
  } catch {
    // Ignore storage errors in private mode or restricted environments.
  }
};

export const consumePendingCartAction = (): PendingCartAction | null => {
  const action = getPendingCartAction();
  if (action) clearPendingCartAction();
  return action;
};
