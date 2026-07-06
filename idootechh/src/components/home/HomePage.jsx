import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./home.css";

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`h-fade${delay ? ` h-fade--delay-${delay}` : ""}`}>
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
function Hero() {
  return (
    <section className="h-hero">
      <div className="h-hero__bg-pattern" aria-hidden="true" />
      <div className="h-hero__content">
        <FadeIn>
          <p className="h-hero__tag">Innovating Every Day</p>
        </FadeIn>
        <FadeIn delay={1}>
          <h1 className="h-hero__title">
            Technology that
            <br />
            <span className="h-hero__title-accent">empowers</span> and
            <br />
            <span className="h-hero__title-accent">scales</span>.
          </h1>
        </FadeIn>
        <FadeIn delay={2}>
          <p className="h-hero__desc">
            We build intelligent systems, SaaS platforms, and future-ready
            learning programs — turning bold ideas into real solutions for
            businesses, schools, and communities.
          </p>
        </FadeIn>
        <FadeIn delay={3}>
          <div className="h-hero__actions">
            <a className="h-btn h-btn--primary" href="#offerings">
              What we do
            </a>
            <Link className="h-btn h-btn--outline" to="/about">
              About us
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ============ OFFERINGS ============ */
const OFFERINGS = [
  {
    num: "01",
    title: "Software & SaaS",
    desc: "Full-stack web, mobile, and cloud-native platforms tailored to your operations.",
  },
  {
    num: "02",
    title: "Robotics & AI",
    desc: "Intelligent systems and applied machine learning that solve real-world problems.",
  },
  {
    num: "03",
    title: "EduTech & Training",
    desc: "Future-ready learning through TIM — teaching coding, robotics, AI, and digital skills.",
  },
  {
    num: "04",
    title: "Consulting & Strategy",
    desc: "IT advisory and digital transformation guidance to help you scale with confidence.",
  },
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
        <FadeIn>
          <p className="h-label">What We Do</p>
        </FadeIn>
        <FadeIn delay={1}>
          <h2 className="h-section-title">
            Four pillars, one purpose.
          </h2>
        </FadeIn>
        <FadeIn delay={2}>
          <p className="h-section-desc">
            Every capability we offer is designed to help you move forward —
            faster, smarter, and with more confidence.
          </p>
        </FadeIn>

        <div className="h-offerings__grid">
          {OFFERINGS.map((o, i) => (
            <FadeIn key={o.num} delay={(i % 2) + 1}>
              <div className="h-offering">
                <span className="h-offering__num">{o.num}</span>
                <h3 className="h-offering__title">{o.title}</h3>
                <p className="h-offering__desc">{o.desc}</p>
              </div>
            </FadeIn>
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
          <FadeIn>
            <p className="h-label h-label--light">Who We Are</p>
          </FadeIn>
          <FadeIn delay={1}>
            <h2 className="h-teaser__title">
              Built on the belief that technology should empower, not
              complicate.
            </h2>
          </FadeIn>
          <FadeIn delay={2}>
            <p className="h-teaser__desc">
              IdooTech bridges the gap between innovation and practical
              application. We are a team of engineers, educators, and
              strategists who design, teach, and build — together.
            </p>
          </FadeIn>
          <FadeIn delay={3}>
            <Link to="/about" className="h-btn h-btn--primary">
              Learn our story
            </Link>
          </FadeIn>
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
          <FadeIn>
            <h2 className="h-cta__title">
              Let&apos;s build something great together.
            </h2>
          </FadeIn>
          <FadeIn delay={1}>
            <p className="h-cta__desc">
              Whether you need a platform, a learning program, or a technology
              strategy — reach out and let&apos;s talk.
            </p>
          </FadeIn>
          <FadeIn delay={2}>
            <div className="h-cta__actions">
              <a className="h-btn h-btn--primary" href="mailto:info@idootech.com.ng">
                <MailIcon /> Get in touch
              </a>
              <a className="h-btn h-btn--outline" href="tel:+2348169891512">
                <PhoneIcon /> Call us
              </a>
            </div>
          </FadeIn>
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
        <div className="h-footer__bottom">
          <p>&copy; {new Date().getFullYear()} IdooTech. All rights reserved.</p>
        </div>
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
