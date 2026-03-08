import { useState } from "react";
import { Product, OrderItem } from "@/types";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface Props {
  products: Product[];
  onSubmitOrder: (customerName: string, items: OrderItem[], comment: string) => Promise<void> | void;
}

export default function CustomerCatalogPage({ products, onSubmitOrder }: Props) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [comment, setComment] = useState("");
  const [step, setStep] = useState<"browse" | "checkout" | "success">("browse");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);
  const cartItems = products
    .filter((p) => cart[p.id] > 0)
    .map((p) => ({ ...p, qty: cart[p.id] }));

  const setQty = (id: string, qty: number) => {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, qty) }));
  };

  const handleOrder = async () => {
    if (!customerName.trim() || cartItems.length === 0) return;
    const items: OrderItem[] = cartItems.map((item) => ({
      productId: item.id,
      productName: item.name,
      volume: item.volume,
      unit: item.unit,
      quantity: item.qty,
    }));
    await onSubmitOrder(customerName.trim(), items, comment);
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="animate-scale-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Icon name="CheckCircle" size={28} className="text-green-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Заявка отправлена!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Сборщик получил уведомление и приступит к работе
        </p>
        <button
          onClick={() => {
            setCart({});
            setCustomerName("");
            setComment("");
            setStep("browse");
          }}
          className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Оформить ещё заявку
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Каталог товаров</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Выберите товары и укажите количество</p>
        </div>
        {cartCount > 0 && (
          <button
            onClick={() => setStep("checkout")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Icon name="ShoppingCart" size={16} />
            Оформить заявку
            <span className="bg-white/20 rounded px-1.5 text-xs">{cartCount}</span>
          </button>
        )}
      </div>

      {step === "checkout" ? (
        <div className="animate-fade-in max-w-lg">
          <button
            onClick={() => setStep("browse")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <Icon name="ArrowLeft" size={14} />
            Назад к каталогу
          </button>
          <div className="bg-card border border-border rounded-xl p-5 mb-4">
            <h3 className="font-semibold mb-4">Состав заявки</h3>
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0 text-sm">
                  <span>{item.name}</span>
                  <div className="text-muted-foreground">
                    {item.volume} л × <span className="text-foreground font-medium">{item.qty} шт</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Ваше имя / организация</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="ИП Иванов или ООО Сервис"
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring mb-3"
              />
              <label className="block text-xs text-muted-foreground mb-1.5">Комментарий (необязательно)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Пожелания к заявке..."
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>
          </div>
          <button
            onClick={handleOrder}
            disabled={!customerName.trim()}
            className={cn(
              "w-full py-2.5 rounded-md text-sm font-medium transition-colors",
              customerName.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
          >
            Отправить заявку сборщику
          </button>
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию..."
              className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-xl p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-sm"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="Droplets" size={14} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm leading-tight">{product.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{product.volume} л</div>
                  </div>
                </div>

                {/* Qty control */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(product.id, (cart[product.id] || 0) - 1)}
                    className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <Icon name="Minus" size={13} />
                  </button>
                  <span className="flex-1 text-center text-sm font-medium">
                    {cart[product.id] || 0}
                  </span>
                  <button
                    onClick={() => setQty(product.id, (cart[product.id] || 0) + 1)}
                    className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    <Icon name="Plus" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}