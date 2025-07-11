import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Squash as Hamburger } from "hamburger-react";
import HeaderCSS from "../css/Header.module.css";
import data from "../Data";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className={HeaderCSS.container}>
      {/* <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        <h1 style={{ fontWeight: "800" }}>{data.HeaderTitle}</h1>
      </Link> */}

      <Link
        to="/gallery"
        onClick={handleLinkClick}
        style={{ textDecoration: "none", color: "white" }}
      >
        <h1 style={{ fontWeight: "800" }}>{data.HeaderTitle}</h1>
      </Link>

      <div className={HeaderCSS.hamburger}>
        <Hamburger 
          toggled={menuOpen} 
          toggle={setMenuOpen}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        />
      </div>
      <nav className={`${HeaderCSS.nav} ${menuOpen ? HeaderCSS.navOpen : ""}`}>
        <ul>
        <li>
            <Link to="/home" onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/gallery" onClick={handleLinkClick}>
              Gallery
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={handleLinkClick}>
              About
            </Link>
          </li>
          <li>
            <Link to="/articles" onClick={handleLinkClick}>
              Articles
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
