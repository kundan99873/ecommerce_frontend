interface OrdersStatCardProps {
  totalOrders: number;
}

const OrdersStatCard = ({ totalOrders }: OrdersStatCardProps) => (
  <div className="rounded-lg border bg-card p-3 text-center">
    <p className="text-xs text-muted-foreground">Orders</p>
    <p className="text-xl font-semibold">{totalOrders}</p>
  </div>
);

export default OrdersStatCard;
