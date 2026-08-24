import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import "./App.css";

const HomePage = lazy(() => import("./components/home/HomePage"));
const AboutPage = lazy(() => import("./components/about/AboutPage"));
const ContactPage = lazy(() => import("./components/contact/ContactPage"));
const ServicesPage = lazy(() => import("./components/services/ServicesPage"));
const PortfolioPage = lazy(() => import("./components/portfolio/PortfolioPage"));
const FAQPage = lazy(() => import("./components/faq/FAQPage"));
const NotFoundPage = lazy(() => import("./components/notfound/NotFoundPage"));

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__spinner" />
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Defer to avoid react-hooks/set-state-in-effect sync warning
    queueMicrotask(() => setMenuOpen(false));
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className="app-nav">
      <Link to="/" className="app-nav__logo">
        <img src="/IdooTechLogo1.png" alt="IdooTech" />
      </Link>
      <button
        className={`app-nav__toggle ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`app-nav__overlay ${menuOpen ? "is-visible" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`app-nav__links ${menuOpen ? "is-open" : ""}`}>
        <Link to="/" className={path === "/" ? "active" : ""}>Home</Link>
        <Link to="/about" className={path === "/about" ? "active" : ""}>About</Link>
        <Link to="/services" className={path === "/services" ? "active" : ""}>Services</Link>
        <Link to="/portfolio" className={path === "/portfolio" ? "active" : ""}>Portfolio</Link>
        <Link to="/faq" className={path === "/faq" ? "active" : ""}>FAQ</Link>
        <Link to="/contact" className={path === "/contact" ? "active" : ""}>Contact</Link>
      </div>
    </nav>
  );
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <CookieConsent />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App
