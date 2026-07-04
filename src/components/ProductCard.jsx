import "../styles/card.css";

export default function ProductCard({ product }) {
  const addToCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId) {
        alert("Please login first");
        return;
      }

      const response = await fetch(
        `https://ecommerce-backend-production-075f.up.railway.app/api/cart/add?userId=${userId}&productId=${product.id}&quantity=1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        console.log("Cart API Status:", response.status);
        throw new Error("Failed");
      }

      const message = await response.text();
      alert(message);

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log(error);
      alert("Failed to add cart");
    }
  };

 return (
  <div className="product-card">
    <img
      src={product.imageUrl}
      alt={product.name}
      className="product-image"
    />

    <h3>{product.name}</h3>
    <p>{product.description}</p>
    <p>₹{product.price}</p>
    <p>Stock: {product.stockQuantity}</p>

    {product.stockQuantity > 0 ? (
      <button className="cart-btn" onClick={addToCart}>
        Add to Cart
      </button>
    ) : (
      <button className="cart-btn" disabled>
        Out of Stock
      </button>
    )}
  </div>
);
}
