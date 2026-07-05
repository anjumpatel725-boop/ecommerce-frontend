import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Address.css";
export default function Address() {

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [addresses, setAddresses] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    house: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: ""
  });

  const loadAddresses = async () => {
    try {

      const res = await axios.get(
        `https://ecommerce-backend-production-075f.up.railway.app/api/address/${userId}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setAddresses(res.data);

    } catch(err){
      console.log(err);
    }
  };

  useEffect(()=>{
      loadAddresses();
  },[]);

  const saveAddress = async () => {

  // Validation
  if (
    !form.fullName.trim() ||
    !form.mobile.trim() ||
    !form.house.trim() ||
    !form.street.trim() ||
    !form.city.trim() ||
    !form.state.trim() ||
    !form.country.trim() ||
    !form.pincode.trim()
  ) {
    alert("All fields are mandatory.");
    return;
  }

  // Mobile Validation
  if (!/^[0-9]{10}$/.test(form.mobile)) {
    alert("Mobile number must be exactly 10 digits.");
    return;
  }

  // Pincode Validation
  if (!/^[0-9]{6}$/.test(form.pincode)) {
    alert("Pincode must be exactly 6 digits.");
    return;
  }

  try {

    await axios.post(
      `https://ecommerce-backend-production-075f.up.railway.app/api/address/${userId}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Address Saved");

    setForm({
      fullName: "",
      mobile: "",
      house: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: ""
    });

    loadAddresses();

  } catch (err) {
    console.log(err);
    alert("All fields are mandatory.");
  }
};
  const deleteAddress = async(id)=>{

      await axios.delete(
          `https://ecommerce-backend-production-075f.up.railway.app/api/address/${id}`,
          {
              headers:{
                  Authorization:`Bearer ${token}`
              }
          }
      );

      loadAddresses();

  };

  return (

<>
<Navbar/>

<div className="address-page">

<h1>My Address</h1>

<input
required
placeholder="Full Name"
value={form.fullName}
onChange={(e)=>setForm({...form,fullName:e.target.value})}
/>

<input
required
placeholder="Mobile"
value={form.mobile}
onChange={(e)=>setForm({...form,mobile:e.target.value})}
/>

<input
required
placeholder="House / Flat"
value={form.house}
onChange={(e)=>setForm({...form,house:e.target.value})}
/>

<input
required
placeholder="Street"
value={form.street}
onChange={(e)=>setForm({...form,street:e.target.value})}
/>

<input
required
placeholder="City"
value={form.city}
onChange={(e)=>setForm({...form,city:e.target.value})}
/>

<input
required
placeholder="State"
value={form.state}
onChange={(e)=>setForm({...form,state:e.target.value})}
/>

<input
required
placeholder="Country"
value={form.country}
onChange={(e)=>setForm({...form,country:e.target.value})}
/>

<input
required
placeholder="Pincode"
value={form.pincode}
onChange={(e)=>setForm({...form,pincode:e.target.value})}
/>

<button onClick={saveAddress}>
Save Address
</button>

<hr/>

{addresses.map((a)=>(

<div key={a.id} className="address-card">

<h3>{a.fullName}</h3>

<p>{a.mobile}</p>

<p>{a.house}</p>

<p>{a.street}</p>

<p>{a.city}</p>

<p>{a.state}</p>

<p>{a.country}</p>

<p>{a.pincode}</p>

<button onClick={()=>deleteAddress(a.id)}>
Delete
</button>

</div>

))}

</div>

<Footer/>
</>

  );

}