import React from "react";
import { GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import "./CartBadge.css";

const CartBadge = () => {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <Link to="/cart" className="position-relative text-decoration-none">
      <GiShoppingCart color="green" size={31} />
      {cartCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill cartcount">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;