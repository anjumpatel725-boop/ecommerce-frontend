import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import "../styles/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");

    let url = "https://ecommerce-backend-qh4p.onrender.com/api/products";

    if (search && search.trim() !== "") {
      url = `https://ecommerce-backend-qh4p.onrender.com/api/products/filter?keyword=${search}`;
    }

    fetch(url)
  .then((res) => {
    if (!res.ok) {
      throw new Error("API failed");
    }
    return res.json();
  })
  .then((data) => {
    setProducts(Array.isArray(data) ? data : []);
  })
  .catch((err) => {
    console.log(err);
    setProducts([]);
  });
  }, [location.search]);

  return (
    <>
      <Navbar />
      <HeroBanner />

<div style={{marginTop:"30px"}}>
    <div id="products-section" className="product-grid">
        {products.map((product,index)=>(

            <ProductCard
                key={index}
                product={product}
            />

        ))}
    </div>
</div>

      <Footer />
    </>
  );
}