import { Order, Product } from "@/types";
import Icon from "@/components/ui/icon";

interface Props {
  orders: Order[];
  products: Product[];
}

export default function StatsPage({ orders, products }: Props) {
  const completed = orders.filter((o) => o.status === "completed").length;
  const inProgress = orders.filter((o) => o.status === "in_progress").length;
  const newOrders = orders.filter((o) => o.status === "new").length;

  const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  const productStats: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      productStats[item.productName] = (productStats[item.productName] || 0) + item.quantity;
    });
  });
  const topProducts = Object.entries(productStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCount = topProducts[0]?.[1] || 1;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Статистика</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Сводная аналитика по продажам</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Всего заявок", value: orders.length, icon: "FileText", color: "text-foreground" },
          { label: "Новых", value: newOrders, icon: "Inbox", color: "text-orange-600" },
          { label: "В работе", value: inProgress, icon: "Zap", color: "text-blue-600" },
          { label: "Выполнено", value: completed, icon: "CheckCircle", color: "text-green-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-4">
            <Icon name={kpi.icon} size={16} className={`mb-2 ${kpi.color}`} />
            <div className="text-2xl font-semibold">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4 text-sm">Топ товаров по спросу</h3>
          {topProducts.length === 0 ? (
            <p className="text-muted-foreground text-sm">Нет данных</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate mr-2">{name}</span>
                    <span className="text-muted-foreground shrink-0">{count} шт</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4 text-sm">Общие показатели</h3>
          <div className="space-y-4">
            {[
              { label: "Товаров в каталоге", value: products.length },
              { label: "Единиц заказано", value: totalItems },
              { label: "Выполнение заявок", value: `${orders.length ? Math.round((completed / orders.length) * 100) : 0}%` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className="font-semibold text-sm">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
