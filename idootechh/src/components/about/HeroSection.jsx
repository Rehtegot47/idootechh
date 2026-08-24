import { Link } from "react-router-dom";
import "./about.css";

export default function HeroSection() {
  return (
    <header className="idt-hero">
      {/* Background image layer */}
      <div className="idt-hero__bg" aria-hidden="true" />
      <div className="idt-hero__overlay" aria-hidden="true" />

      <div className="idt-hero__grid">
        {/* Left: Text Content */}
        <div className="idt-hero__content">
          <p className="idt-eyebrow">
            <EyebrowIcon /> About IdooTech
          </p>
          <h1 className="idt-h1">Innovating Every Day.</h1>
          <p className="idt-lede">
            We are a team of engineers, educators, and business experts
            building intelligent systems, software platforms, and
            future-ready learning programs that turn ideas into solutions
            that make lives smarter, simpler, and more connected.
          </p>

          <div className="idt-hero__actions">
            <Link className="idt-btn idt-btn--primary" to="/services">
              <ServicesIcon />
              Explore our services
            </Link>
            <Link className="idt-btn idt-btn--ghost" to="/contact">
              <ContactIcon />
              Get in touch
            </Link>
          </div>
        </div>

        {/* Right: Image card */}
        <div className="idt-hero__visual" aria-hidden="true">
          <div className="idt-hero__img-card">
            <img src="/IdooTech2.png" alt="IdooTech team collaborating" />
            <div className="idt-hero__img-badge">
              <span className="idt-hero__img-badge-dot" />
              Building the future together
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---- Icon helpers ---- */
function EyebrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
