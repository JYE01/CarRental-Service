import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu } from "lucide-react";
import './Navbar.css';
import SearchBar from "../components/SearchBar";

const subTypeMap = {

};

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  // const { cart } = useCart();
  // const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleMouseEnter = (type) => setActiveDropdown(type);
  const handleMouseLeave = () => setActiveDropdown(null);

  return (
    <>
      <div className="topnav">
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={24} />
        </button>

        <Link to="/" className="logo-link">
          <img src="/UTSLogo.png" alt="Home Logo" className="logo" />
        </Link>

        <div className="nav-left">
          {Object.keys(subTypeMap).map((type) => (
            <div
              className="dropdown"
              key={type}
              onMouseEnter={() => handleMouseEnter(type)}
              onMouseLeave={handleMouseLeave}
            >
              <Link to={`/${type}`} className={location.pathname === `/${type}` ? "active" : ""}>
                {type}
              </Link>
              {activeDropdown === type && (
                <div className="dropdown-content">
                  {subTypeMap[type].map((subType) => (
                    <Link key={subType} to={`/${type}/${subType}`}>
                      {subType}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="nav-right">
          <SearchBar />
          {/* <Link to="/Cart" className={location.pathname === "/Cart" ? "active" : ""}>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
            <ShoppingCart size={18} style={{ verticalAlign: "middle", marginRight: "5px" }} />
            <span className="hide-on-mobile">Cart</span>
          </Link> */}
        </div>
      </div>

      <div className={`nav-mobile-dropdown ${isOpen ? "show" : ""}`}>
        {Object.keys(subTypeMap).map((type) => (
          <div key={type}>
            <Link to={`/${type}`}>{type}</Link>
            <div className="mobile-sub-links">
              {subTypeMap[type].map((subType) => (
                <Link key={subType} to={`/${type}/${subType}`} className="mobile-sub-link">
                  ↳ {subType}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Navbar