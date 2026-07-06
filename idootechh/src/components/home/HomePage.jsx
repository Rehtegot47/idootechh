import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./home.css";

function Reveal({ children, delay = 0, type = "up" }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`h-reveal h-reveal--${type}${delay ? ` h-reveal--delay-${delay}` : ""}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="h-page">
      <Hero />
      <Offerings />
      <AboutTeaser />
      <CTA />
      <SiteFooter />
    </main>
  );
}

/* ============ HERO ============ */
const HERO_IMAGES = ["/HOME1.jpg", "/HOME (2).jpg", "/HOME (3).jpg"];

function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-hero">
      <div className="h-hero__slides" aria-hidden="true">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`h-hero__slide${i === current ? " is-active" : ""}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
        <div className="h-hero__overlay" aria-hidden="true" />
      </div>
      <div className="h-hero__content">
        <Reveal>
          <p className="h-hero__tag">Innovating Every Day</p>
        </Reveal>
        <Reveal delay={1}>
          <h1 className="h-hero__title">
            Technology that
            <br />
            <span className="h-hero__title-accent">empowers</span> and
            <br />
            <span className="h-hero__title-accent">scales</span>.
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p className="h-hero__desc">
            We build intelligent systems, SaaS platforms, and future-ready
            learning programs — turning bold ideas into real solutions for
            businesses, schools, and communities.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <div className="h-hero__actions">
            <a className="h-btn h-btn--primary" href="#offerings">
              What we do
            </a>
            <Link className="h-btn h-btn--outline" to="/about">
              About us
            </Link>
          </div>
        </Reveal>
      </div>
      <div className="h-hero__dots" aria-hidden="true">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`h-hero__dot${i === current ? " is-active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ============ OFFERINGS ============ */
const OFFERINGS = [
  { num: "01", category: "Branding", title: "Brand Identity & Strategy", desc: "Crafting unique brand identities, positioning, and messaging that resonate with your audience and set you apart." },
  { num: "02", category: "Branding", title: "Visual Design & Guidelines", desc: "Comprehensive visual systems including logos, typography, colour palettes, and brand guidelines for consistency." },
  { num: "03", category: "Designing", title: "UI/UX Design", desc: "User-centred interfaces and seamless experiences across web and mobile platforms, backed by research and testing." },
  { num: "04", category: "Designing", title: "Graphic & Motion Design", desc: "Engaging visual content, illustrations, and motion graphics that communicate your message with impact." },
  { num: "05", category: "Cyber Security", title: "Security Audits & Assessments", desc: "Thorough vulnerability assessments, penetration testing, and compliance audits to protect your infrastructure." },
  { num: "06", category: "Cyber Security", title: "Threat Monitoring & Protection", desc: "Real-time monitoring, incident response, and proactive defence strategies to safeguard your digital assets." },
];

function Offerings() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".h-fade").forEach((el) =>
            el.classList.add("is-visible")
          );
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="h-offerings" id="offerings" ref={ref}>
      <div className="h-container">
        <Reveal>
          <p className="h-label">What We Do</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="h-section-title">
            Six services, three disciplines.
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="h-section-desc">
            From brand strategy to cyber defence, we deliver end-to-end
            capabilities that help organisations thrive in a digital world.
          </p>
        </Reveal>

        <div className="h-offerings__grid">
          {OFFERINGS.map((o, i) => (
            <Reveal key={o.num} delay={(i % 3) + 1}>
              <div className="h-offering">
                <span className="h-offering__category">{o.category}</span>
                <h3 className="h-offering__title">{o.title}</h3>
                <p className="h-offering__desc">{o.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ ABOUT TEASER ============ */
function AboutTeaser() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".h-fade").forEach((el) =>
            el.classList.add("is-visible")
          );
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="h-teaser" ref={ref}>
      <div className="h-container">
        <div className="h-teaser__card">
          <Reveal>
            <p className="h-label h-label--light">Who We Are</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="h-teaser__title">
              Built on the belief that technology should empower, not
              complicate.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="h-teaser__desc">
              IdooTech bridges the gap between innovation and practical
              application. We are a team of engineers, educators, and
              strategists who design, teach, and build — together.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <Link to="/about" className="h-btn h-btn--primary">
              Learn our story
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============ CTA ============ */
function CTA() {
  return (
    <section className="h-cta">
      <div className="h-container">
        <div className="h-cta__inner">
          <Reveal>
            <h2 className="h-cta__title">
              Let&apos;s build something great together.
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="h-cta__desc">
              Whether you need a platform, a learning program, or a technology
              strategy — reach out and let&apos;s talk.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <div className="h-cta__actions">
              <a className="h-btn h-btn--primary" href="mailto:info@idootech.com.ng">
                <MailIcon /> Get in touch
              </a>
              <a className="h-btn h-btn--outline" href="tel:+2348169891512">
                <PhoneIcon /> Call us
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
function SiteFooter() {
  return (
    <footer className="h-footer">
      <div className="h-container">
        <Reveal>
          <div className="h-footer__top">
            <div>
              <h3 className="h-footer__logo">
                Idoo<span>Tech</span>
              </h3>
              <p className="h-footer__tagline">
                Innovating Every Day.
              </p>
            </div>
            <div className="h-footer__links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <a href="mailto:info@idootech.com.ng">Contact</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="h-footer__bottom">
            <p>&copy; {new Date().getFullYear()} IdooTech. All rights reserved.</p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

/* ============ ICONS ============ */
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
