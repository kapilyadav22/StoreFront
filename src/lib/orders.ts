import { promises as fs } from "fs";
import path from "path";

export type OrderItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  totalCents: number;
  provider: "stripe" | "justpay" | "unknown";
  createdAt: string;
};

const ORDERS_FILE = path.join(process.cwd(), "src", "data", "orders.json");

async function ensureFile(): Promise<void> {
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    const dir = path.dirname(ORDERS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(ORDERS_FILE, JSON.stringify([]), "utf8");
  }
}

export async function readOrders(): Promise<Order[]> {
  await ensureFile();
  const raw = await fs.readFile(ORDERS_FILE, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function addOrder(order: Omit<Order, "id" | "createdAt">): Promise<Order> {
  const orders = await readOrders();
  const full: Order = {
    ...order,
    id: `ord_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
  };
  orders.unshift(full);
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
  return full;
}


