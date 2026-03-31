interface WishlistStatCardProps {
  totalWishlistItems: number;
}

const WishlistStatCard = ({ totalWishlistItems }: WishlistStatCardProps) => (
  <div className="rounded-lg border bg-card p-3 text-center">
    <p className="text-xs text-muted-foreground">Wishlist</p>
    <p className="text-xl font-semibold">{totalWishlistItems}</p>
  </div>
);

export default WishlistStatCard;
