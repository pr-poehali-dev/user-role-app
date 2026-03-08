import { useState } from "react";
import { Product, Order } from "@/types";

const SAMPLE_PRODUCTS: Product[] = [
  { id: "1", name: "Моторное масло 5W-30", volume: 4, unit: "л", createdAt: "2026-03-01" },
  { id: "2", name: "Антифриз G12+", volume: 5, unit: "л", createdAt: "2026-03-02" },
  { id: "3", name: "Тормозная жидкость DOT4", volume: 0.5, unit: "л", createdAt: "2026-03-03" },
  { id: "4", name: "Жидкость ГУР", volume: 1, unit: "л", createdAt: "2026-03-04" },
  { id: "5", name: "Омыватель стёкол", volume: 5, unit: "л", createdAt: "2026-03-05" },
];

const SAMPLE_ORDERS: Order[] = [
  {
    id: "ЗАЯ-001",
    customerName: "ИП Смирнов",
    items: [
      { productId: "1", productName: "Моторное масло 5W-30", volume: 4, unit: "л", quantity: 3 },
      { productId: "2", productName: "Антифриз G12+", volume: 5, unit: "л", quantity: 2 },
    ],
    status: "new",
    createdAt: "2026-03-08T09:15:00",
  },
  {
    id: "ЗАЯ-002",
    customerName: "ООО АвтоСервис",
    items: [
      { productId: "3", productName: "Тормозная жидкость DOT4", volume: 0.5, unit: "л", quantity: 10 },
    ],
    status: "in_progress",
    createdAt: "2026-03-07T14:30:00",
  },
  {
    id: "ЗАЯ-003",
    customerName: "ИП Козлов",
    items: [
      { productId: "5", productName: "Омыватель стёкол", volume: 5, unit: "л", quantity: 6 },
    ],
    status: "completed",
    createdAt: "2026-03-06T11:00:00",
  },
];

export function useStore() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [notifications, setNotifications] = useState<string[]>([
    "Новая заявка от ИП Смирнов",
  ]);

  const addProduct = (name: string, volume: number) => {
    const product: Product = {
      id: Date.now().toString(),
      name,
      volume,
      unit: "л",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, name: string, volume: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name, volume } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addOrder = (order: Omit<Order, "id" | "createdAt" | "status">) => {
    const newOrder: Order = {
      ...order,
      id: `ЗАЯ-${String(orders.length + 1).padStart(3, "0")}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setNotifications((prev) => [`Новая заявка от ${order.customerName}`, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const clearNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    products,
    orders,
    notifications,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
    clearNotification,
  };
}
