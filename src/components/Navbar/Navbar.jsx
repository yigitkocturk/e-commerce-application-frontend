import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

const categories = ['Tüm Kategoriler', 'Spor', 'Bot', 'Terlik', 'Klasik'];
const genders = ['Erkek', 'Kadın', 'Çocuk'];
const brands = ['Tüm Markalar', 'Nike', 'Adidas', 'Puma', 'Jordan', 'Polo', 'Lumberjack', 'Crocs'];

const Navbar = ({ cartItemCount }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedGender = queryParams.get("gender");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const getNavItemStyle = (item) => {
    return {
      backgroundColor: selectedGender === item ? "#F0F0F0" : "transparent",
      borderRadius: "10px",
    };
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link to="/" className="navbar-brand">
        Ayakkabı Kutusu
      </Link>
      <button
        className="navbar-toggler collapsed"
        type="button"
        data-toggle="collapse"
        data-target="#navbarsExample06"
        aria-controls="navbarsExample06"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="navbar-collapse collapse" id="navbarsExample06">
        <ul className="navbar-nav mr-auto">
          {genders.map((gender) => (
            <li className="nav-item" key={gender} style={getNavItemStyle(gender)}>
              <Link
                to={{
                  pathname: "/productlist",
                  search: `?gender=${encodeURIComponent(gender)}`,
                }}
                className="nav-link"
              >
                {gender}
              </Link>
            </li>
          ))}
        </ul>
        {/* Sadece mobilde görünecek alan */}
        <div className="d-lg-none">
          <div className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="categoryDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Kategoriler
            </a>
            <div className="dropdown-menu" aria-labelledby="categoryDropdown">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={{
                    pathname: "/productlist",
                    search: `?gender=${encodeURIComponent(selectedGender)}&category=${encodeURIComponent(category)}`,
                  }}
                  className="dropdown-item"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Link>
              ))}
            </div>
            {selectedCategory && (
              <div className="selected-item-box">
                Seçilen Kategori: {selectedCategory}
              </div>
            )}
          </div>
          <div className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="brandDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Markalar
            </a>
            <div className="dropdown-menu" aria-labelledby="brandDropdown">
              {brands.map((brand) => (
                <Link
                  key={brand}
                  to={{
                    pathname: "/productlist",
                    search: `?gender=${encodeURIComponent(selectedGender)}&brand=${encodeURIComponent(brand)}`,
                  }}
                  className="dropdown-item"
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand}
                </Link>
              ))}
            </div>
            {selectedBrand && (
              <div className="selected-item-box">
                Seçilen Marka: {selectedBrand}
              </div>
            )}
          </div>
        </div>
        <form className="form-inline my-2 my-md-0">
          <div className="input-group">
            <div className="cart-icon ml-2">
              <Link to="/cart" className="btn btn-outline-dark">
                <FontAwesomeIcon icon={faShoppingCart} />
                <span className="cart-item-count">{cartItemCount}</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
