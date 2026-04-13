import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// Determine API URL based on environment
const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? "http://localhost:5001"
  : "";

function App() {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [authPage, setAuthPage] = useState("login"); // "login" or "register"
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Menu state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: ""
  });

  // Set up axios default auth header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ================= AUTH FUNCTIONS =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth?action=login`, {
        email: authForm.email,
        password: authForm.password,
      });
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setAuthForm({ name: "", email: "", password: "" });
    } catch (err) {
      setAuthError(err?.response?.data?.message || "Login failed");
    }
    setAuthLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth?action=register`, {
        name: authForm.name,
        email: authForm.email,
        password: authForm.password,
      });
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setAuthForm({ name: "", email: "", password: "" });
    } catch (err) {
      setAuthError(err?.response?.data?.message || "Registration failed");
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCart([]);
  };

const MENU_ITEMS = [
  { id: 1, name: "Pepperoni Pizza", price: 12.99, category: "Pizza", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/767e8a3eff44e4fd65e42f72b1172d754776bd60.jpg" },
  { id: 2, name: "Chicken Pizza", price: 14.99, category: "Pizza", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/11f64022920e67e70bfce7f5652e8f218805964f.jpg" },
  { id: 3, name: "Cheese Pizza", price: 10.99, category: "Pizza", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/2ffa21344a948fad41ea63f879d621758c5e4f17.jpg" },
  { id: 4, name: "Veggie Burger", price: 8.99, category: "Burger", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/86bb2dba7ad690ecb78e0ee0cbebe3d0bc8babdf.jpg" },
  { id: 5, name: "Mac n Cheese Burger", price: 11.99, category: "Burger", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/9143d657619617dc7c3e071119ad978f28861295.jpg" },
  { id: 6, name: "Maharaja Burger", price: 13.99, category: "Burger", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/aef232279f55715a091313c5fd36e9a10a9561f2.jpg" },
  { id: 7, name: "Penne Pasta", price: 9.99, category: "Pasta", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4eb81c48a7d25882e2ec2b480e8a1428d38f2296.jpg" },
  { id: 8, name: "Boiled Pasta", price: 7.99, category: "Pasta", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/fe3d0baff283210e1a201e414988cd996cc05476.jpg" },
  { id: 9, name: "Pasta Pomodoro", price: 10.99, category: "Pasta", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/5560b2ec73e15ae03cc379a326df5feb497a2247.jpg" },
  { id: 10, name: "Chicken Curry", price: 11.99, category: "Indian", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c4f11c18a9db4f4a0c8fff974130e08a456b55a8.jpg" },
  { id: 11, name: "Veg Curry", price: 9.99, category: "Indian", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/23e3edf29a575233e4d14d46fc4e3f658128a0ae.jpg" },
  { id: 12, name: "Chicken Tikka Masala", price: 13.99, category: "Indian", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/169e4aceee22536b1bbf44c2170085ac9a3a7054.jpg" },
  { id: 13, name: "Chinese Noodles", price: 8.99, category: "Chinese", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/25681a8425e374140c94e5243567bdd92b084e47.jpg" },
  { id: 14, name: "Braised Beef Noodles", price: 12.99, category: "Chinese", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/aee6b1d5910c9182626f746a5357551dbd6db98e.jpg" },
  { id: 15, name: "Peanut Sauce Noodles", price: 10.99, category: "Chinese", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c69e5acfb9ff3c961a929c5c9ee771b55e314965.jpg" },
  { id: 16, name: "Chocolate Mousse Cake", price: 6.99, category: "Dessert", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/3ad748a2fe2b4a5689721c7919cadd0d22429b31.jpg" },
  { id: 17, name: "Strawberry Cake", price: 7.99, category: "Dessert", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4b1c649b91f4ff5832a4415378fedf6e85b6ec6a.jpg" },
  { id: 18, name: "Ice Cream Cake", price: 8.99, category: "Dessert", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/8d3f97873401ca86ee1e6396480c83d3226ac71e.jpg" },
  { id: 19, name: "Chef Salad", price: 9.99, category: "Salad", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/cebc160193282dc6cdd6082bd51ddde9509ec60c.jpg" },
  { id: 20, name: "Garden Salad", price: 7.99, category: "Salad", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0fdbe5b52775ff7caa84a7fcd8f9f69ab47e3614.jpg" },
  { id: 21, name: "Chopped Salad", price: 8.99, category: "Salad", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/29ca5bd570135aebc6c5d6353e2e774ecd970354.jpg" },
  { id: 22, name: "Fried Chicken Basket", price: 12.99, category: "Chicken", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/717e516f9250e73477d37c3a9086ef4e08b0dd69.jpg" },
  { id: 23, name: "Buffalo Wings", price: 10.99, category: "Chicken", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/6491073773828c099761be81dc95a51efd338c49.jpg" },
  { id: 24, name: "Konkani Fried Chicken", price: 13.99, category: "Chicken", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/67258c02828f889e1e1505d4b969bf8161efb826.jpg" },
  { id: 25, name: "Nigiri Sushi", price: 14.99, category: "Sushi", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/e50f902189f8435cb8b5c5d5e0ca2304d2e4006f.jpg" },
  { id: 26, name: "Maki Sushi Rolls", price: 12.99, category: "Sushi", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/3a24e27af25f5c72992334308c22de165ac69568.jpg" },
  { id: 27, name: "Beef Tacos", price: 9.99, category: "Tacos", image: "https://upload.wikimedia.org/wikipedia/commons/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg" },
  { id: 28, name: "Chicken Tacos", price: 10.99, category: "Tacos", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/43b7c4d2c3f4efe1737a8a3446078a05e11f998e.jpg" },
  { id: 29, name: "Arrachera Tacos", price: 11.99, category: "Tacos", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/2f1747ff6bee70d64bd8108f8e6558ddca428d15.jpg" },
  { id: 30, name: "Veggie Wrap", price: 8.99, category: "Wraps", image: "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0fdbe5b52775ff7caa84a7fcd8f9f69ab47e3614.jpg" }
];


 const categories = [
  "All",
  "Pizza",
  "Burger",
  "Indian",
  "Chinese",
  "Dessert",
  "Chicken",
  "Sushi",
  "Tacos",
  "Wraps",
  "Salad"
];


 const filteredItems = useMemo(() => {
  return MENU_ITEMS.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || item.category === category)
  );
 }, [search, category]);


 const addToCart = (item) => {
  setCart([...cart, item]);
};


 const total = cart.reduce((sum, item) => sum + item.price, 0);


 const placeOrder = () => {
  if (cart.length === 0) return alert("Cart is empty!");
  setShowOrderForm(true);
};


// ✅ FIXED CONFIRM ORDER WITH BETTER ALERTS
const confirmOrder = async () => {
  try {
    const payload = {
      customer,
      items: cart,
      total
    };

    console.log("Sending:", payload);

    const res = await axios.post(`${API_URL}/api/order`, payload);

    // ✅ SUCCESS ALERT WITH ORDER DETAILS
    alert(
      `🎉 Order Placed Successfully!\n\n` +
      `Name: ${customer.name}\n` +
      `Phone: ${customer.phone}\n` +
      `Address: ${customer.address}\n` +
      `Total Items: ${cart.length}\n` +
      `Total Price: ₹${total.toFixed(2)}\n\n` +
      `Thank you for your order!`
    );

    setCart([]);
    setCustomer({ name: "", phone: "", address: "" });
    setShowOrderForm(false);

  } catch (err) {
    console.log("ERROR:", err);
    
    // ✅ ERROR ALERT WITH DETAILS
    alert(
      `❌ Order Failed!\n\n` +
      `${err?.response?.data?.message || err.message || "Backend not reachable"}`
    );
  }
};

  // ================= LOGIN / REGISTER PAGE =================
  if (!token) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">🍔 Food Ordering System</h2>
                <h4 className="text-center mb-3">
                  {authPage === "login" ? "Login" : "Register"}
                </h4>

                {authError && (
                  <div className="alert alert-danger py-2">{authError}</div>
                )}

                <form onSubmit={authPage === "login" ? handleLogin : handleRegister}>
                  {authPage === "register" && (
                    <input
                      className="form-control mb-3"
                      type="text"
                      placeholder="Full Name"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      required
                    />
                  )}

                  <input
                    className="form-control mb-3"
                    type="email"
                    placeholder="Email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    required
                  />

                  <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="Password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    required
                    minLength={6}
                  />

                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={authLoading}
                  >
                    {authLoading
                      ? "Please wait..."
                      : authPage === "login"
                      ? "Login"
                      : "Register"}
                  </button>
                </form>

                <p className="text-center mt-3 mb-0">
                  {authPage === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => { setAuthPage("register"); setAuthError(""); }}
                      >
                        Register
                      </span>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => { setAuthPage("login"); setAuthError(""); }}
                      >
                        Login
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN APP (AUTHENTICATED) =================
  return (
    <div className="container py-4">

      {/* NAVBAR WITH USER INFO AND LOGOUT */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">🍔 Food Ordering System</h2>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-secondary">{user?.role}</span>
          <span className="fw-bold">{user?.name}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>


      <input
        className="form-control my-3"
        placeholder="Search food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      <select
        className="form-select mb-3"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map(c => <option key={c}>{c}</option>)}
      </select>


      <div className="card p-3 mb-3">
        <h5>🛒 Cart: {cart.length}</h5>
        <h6>Total: ₹{total.toFixed(2)}</h6>


        <button className="btn btn-success" onClick={placeOrder}>
          Place Order
        </button>
      </div>


      <div className="row">
        {filteredItems.map(item => (
          <div key={item.id} className="col-md-3 mb-3">
            <div className="card">
              <img src={item.image} height="150" style={{ objectFit: "cover" }} />
              <div className="card-body">
                <h6>{item.name}</h6>
                <p>₹{item.price}</p>
                <button className="btn btn-primary w-100" onClick={() => addToCart(item)}>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* ORDER MODAL */}
      {showOrderForm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">


          <div className="bg-white p-4 rounded" style={{ width: "400px" }}>


            <h4>Enter Details</h4>


            <input className="form-control my-2"
              placeholder="Name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />


            <input className="form-control my-2"
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />


            <textarea className="form-control my-2"
              placeholder="Address"
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            />


            <button className="btn btn-success w-100 mt-2" onClick={confirmOrder}>
              Confirm Order
            </button>


            <button className="btn btn-danger w-100 mt-2" onClick={() => setShowOrderForm(false)}>
              Cancel
            </button>


          </div>


        </div>
      )}


    </div>
  );
}


export default App;
