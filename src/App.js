import React from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Signup from "./components/userAuth/signup"; 
import Login from "./components/userAuth/loginPage";  // you can create later
import Cart from "./components/Cart/CartPage"
// import Dashboard from "./Dashboard"; 

function App() {
  return (
    <Router>
      <Routes>

        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />

        {/* Login Page (add later) */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Page (for logged-in users) */}
         <Route path="/" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
