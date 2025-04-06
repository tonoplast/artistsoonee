import React from "react";
import FooterCSS from "../css/Footer.module.css";
import data from "../Data";
import { FaGlobe, FaInstagram, FaFacebookF, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className={FooterCSS.footer}>
      <p>{data.FooterText}</p>
      <div className={FooterCSS.social}>
   
        {/* Instagram link */}
        <a
          href="https://instagram.com/Artistsoonee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={24} />
        </a>
        {/* Facebook link */}
        <a
          href="https://facebook.com/Artistsoonee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebookF size={24} />
        </a>
       {/* Generic website link */}
        <a
          href="https://www.adagp.fr/en/identities/carte-numerique/1164242"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGlobe size={24} />
        </a>
        {/* Email link */}
        <a href="mailto:www.artistsoon@gmail.com">
          <FaEnvelope size={24} />
        </a>
      </div>
      <p style={{ marginTop: "5px", fontSize: "12px" }}>
        Designed by{" "}
        <a
          href="https://github.com/tonoplast"
          style={{ textDecoration: "none", color: "#F4A261" }}
        >
          tonoplast
        </a>
      </p>
    </footer>
  );
}

export default Footer;
