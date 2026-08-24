import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__top">
          <div className="app-footer__brand">
            <h3 className="app-footer__logo">
              <img src="/IdooTechLogo1.png" alt="IdooTech" />
            </h3>
            <p className="app-footer__tagline">
              Innovating Every Day. Building intelligent systems, software
              platforms, and future-ready learning programs.
            </p>
          </div>
          <div className="app-footer__nav">
            <h4 className="app-footer__heading">Quick Links</h4>
            <div className="app-footer__links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/services">Services</Link>
              <Link to="/portfolio">Portfolio</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div className="app-footer__contact">
            <h4 className="app-footer__heading">Contact Us</h4>
            <ul className="app-footer__list">
              <li>
                <span className="app-footer__list-label">
                  <MailIcon /> Email
                </span>
                <a href="mailto:info@idootech.com.ng">info@idootech.com.ng</a>
              </li>
              <li>
                <span className="app-footer__list-label">
                  <GlobeIcon /> Website
                </span>
                <a href="https://www.idootech.com.ng" target="_blank" rel="noopener noreferrer">
                  www.idootech.com.ng
                </a>
              </li>
              <li>
                <span className="app-footer__list-label">
                  <PhoneIcon /> Phone
                </span>
                <a href="tel:+2348169891512">+234 816 989 1512</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="app-footer__social">
          <SocialLinks className="social-links--dark" />
        </div>
        <div className="app-footer__bottom">
          <p>&copy; {new Date().getFullYear()} IdooTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M2 12h20M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
