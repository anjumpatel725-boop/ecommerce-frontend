import { useState } from "react";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrl: ""
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const addProduct = async () => {
    try {
      const res = await fetch("https://ecommerce-backend-production-075f.up.railway.app/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
      });

      if (res.ok) {
        alert("Product Added Successfully");
      } else {
        alert("Failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Add Product</h1>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <br /><br />

      <input name="description" placeholder="Description" onChange={handleChange} />
      <br /><br />

      <input name="price" placeholder="Price" onChange={handleChange} />
      <br /><br />

      <input name="stockQuantity" placeholder="Stock" onChange={handleChange} />
      <br /><br />

      <input name="imageUrl" placeholder="Image URL" onChange={handleChange} />
      <br /><br />

      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}