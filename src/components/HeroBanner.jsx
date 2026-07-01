import "../styles/HeroBanner.css";

export default function HeroBanner() {
  const scrollToProducts = () => {
    const section = document.getElementById("products-section");

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero-banner">
      <div className="overlay">
        <h1>Welcome to Amazon Clone</h1>
        <p>Discover amazing deals on electronics</p>
        <button onClick={scrollToProducts}>
          Shop Now
        </button>
      </div>
    </div>
  );
}