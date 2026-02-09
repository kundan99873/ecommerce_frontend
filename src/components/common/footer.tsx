import { Link } from "react-router";
import { useAuth } from "@/context/authContext";

const Footer = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <footer className="border-t bg-secondary/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold mb-3">LUMIÈRE</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Curated essentials for the modern wardrobe. Quality materials, timeless design.
            </p>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold mb-3">Shop</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/products" className="block hover:text-primary transition-colors">All Products</Link>
              <Link to="/products?category=Clothing" className="block hover:text-primary transition-colors">Clothing</Link>
              <Link to="/products?category=Shoes" className="block hover:text-primary transition-colors">Shoes</Link>
              <Link to="/products?category=Bags" className="block hover:text-primary transition-colors">Bags</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold mb-3">Account</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block hover:text-primary transition-colors">My Account</Link>
                  <Link to="/orders" className="block hover:text-primary transition-colors">Orders</Link>
                  <Link to="/wishlist" className="block hover:text-primary transition-colors">Wishlist</Link>
                  <button onClick={logout} className="block hover:text-primary transition-colors text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block hover:text-primary transition-colors">Login</Link>
                  <Link to="/register" className="block hover:text-primary transition-colors">Register</Link>
                </>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold mb-3">Support</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>help@lumiere.com</p>
              <p>Free shipping on orders $100+</p>
              <p>30-day returns</p>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          © 2025 Lumière. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
