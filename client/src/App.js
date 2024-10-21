import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Importing ProtectedRoute
import "./App.css";
import Logout from "./pages/Logout";
import AdminPage from "./pages/AdminPage";
import Layout from "./components/Layout";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const [orders, setOrders] = useState(() => {
    const storedOrders = localStorage.getItem("orders");
    return storedOrders ? JSON.parse(storedOrders) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || null;
  });

  // Fetch login status from the backend when the app loads
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/user/authenticate"); // Backend endpoint
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.authenticated);
          setUserRole(data.role);

          // Persist login state and user role
          localStorage.setItem("isLoggedIn", data.authenticated);
          localStorage.setItem("userRole", data.role);

          // If the user is logged in, restore cart and orders from local storage
          if (data.authenticated) {
            const storedCartItems = localStorage.getItem("cartItems");
            const storedOrders = localStorage.getItem("orders");
            if (storedCartItems) {
              setCartItems(JSON.parse(storedCartItems));
            }
            if (storedOrders) {
              setOrders(JSON.parse(storedOrders));
            }
          }
        } else {
          // Clear login state and user role if authentication fails
          setIsLoggedIn(false);
          setUserRole(null);
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userRole");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
        setUserRole(null);

        // Clear login state and user role on error
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
      }
    };

    checkLoginStatus();
  }, []);

  // Update local storage when cart items change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Update local storage when orders change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Function to add items to the cart
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  // Function to remove items from the cart
  const handleRemoveFromCart = (product) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== product.id)
    );
  };

  // Function to checkout items from the cart
  const handleCheckout = (item) => {
    setOrders((prevOrders) => [...prevOrders, item]); // Add item to orders
    handleRemoveFromCart(item); // Remove item from cart after checkout
  };

  // Function to cancel an order
  const handleCancelOrder = (order) => {
    setOrders((prevOrders) =>
      prevOrders.filter((item) => item.id !== order.id)
    );
  };

  // Function to handle user login
  const handleLogin = (role) => {
    // Persist login state and user role
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);

    // Set login state to true and update user role
    setIsLoggedIn(true);
    setUserRole(role);
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      // Call backend to logout
      await fetch("/logout", { method: "POST" });

      // Clear login state and user role from local storage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");

      // Reset login state and user role
      setIsLoggedIn(false);
      setUserRole(null);

      // Optionally clear cart and orders on logout
      localStorage.removeItem("cartItems");
      localStorage.removeItem("orders");

      // Clear cart items in state
      setCartItems([]);

      // Clear orders in state
      setOrders([]);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="App">
      <Router>
        <Layout
          cartItems={cartItems}
          orders={orders}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          userRole={userRole}
        ></Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={<ProductsPage onAddToCart={handleAddToCart} />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage
                  cartItems={cartItems}
                  onRemoveFromCart={handleRemoveFromCart}
                  onCheckout={handleCheckout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage orders={orders} onCancelOrder={handleCancelOrder} />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

// Wrap App component in Router
export default App;
