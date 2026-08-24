import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SEO from "../SEO";
import Footer from "../Footer";
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
      <SEO title="Home" description="We build intelligent systems, SaaS platforms, and future-ready learning programs turning bold ideas into real solutions for businesses, schools, and communities." path="/" />
      <Hero />
      <StatsBar />
      <Services />
      <About />
      <Portfolio />
      <Process />
      <CTA />
      <Footer />
    </main>
  );
}

/* ============ HERO ============ */
const SLIDES = [
  {
    tag: "Innovating Every Day",
    title: (
      <>
        Technology that <br />
        <span className="h-hero__title-accent">empowers</span> and <br />
        <span className="h-hero__title-accent">scales</span>.
      </>
    ),
    desc: "We build intelligent systems, SaaS platforms, and future-ready learning programs turning bold ideas into real solutions for businesses, schools, and communities.",
    img: "/idoo1.jpg",
    imgSide: "right",
    badge: { num: "10,000+", text: "Users Reached" },
    cta: [
      { label: "What we do", href: "#services", primary: true },
      { label: "About us", to: "/about", primary: false },
    ],
  },
  {
    tag: "Intelligence Integrated",
    title: (
      <>
        AI that <span className="h-hero__title-accent">thinks</span> <br />
        with you, not <br />
        <span className="h-hero__title-accent">for</span> you.
      </>
    ),
    desc: "We embed machine learning, LLMs, and computer vision into your workflows — turning raw data into decisions and automating what slows you down.",
    img: "/idoo2.jpg",
    imgSide: "left",
    cta: [
      { label: "Explore AI", href: "/services#ai", primary: true },
      { label: "Learn more", to: "/services", primary: false },
    ],
  },
  {
    tag: "Hardware Meets Software",
    title: (
      <>
        Robotics that <br />
        <span className="h-hero__title-accent">move</span> <br />
        the future.
      </>
    ),
    desc: "From educational kits to industrial automation, we design robotic systems that teach, build, and solve real-world problems across industries.",
    img: "/idoo3.jpg",
    imgSide: "right",
    cta: [
      { label: "Explore Robotics", href: "/services#robotics", primary: true },
      { label: "Our process", to: "/services", primary: false },
    ],
  },
];

function Hero() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="h-hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        className="h-hero__swiper"
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className={`h-hero__slide h-hero__slide--${slide.imgSide}`}>
              {slide.imgSide === "left" && (
                <div className="h-hero__visual">
                  <img src={slide.img} alt={`IdooTech slide ${i + 1}`} />
                </div>
              )}
              <div className="h-hero__text">
                <p className="h-hero__tag">{slide.tag}</p>
                <h1 className="h-hero__title">{slide.title}</h1>
                <p className="h-hero__desc">{slide.desc}</p>
                <div className="h-hero__actions">
                  {slide.cta.map((btn) =>
                    btn.to ? (
                      <Link
                        key={btn.label}
                        className={`h-btn ${btn.primary ? "h-btn--primary" : "h-btn--outline"}`}
                        to={btn.to}
                      >
                        {btn.label}
                      </Link>
                    ) : (
                      <a
                        key={btn.label}
                        className={`h-btn ${btn.primary ? "h-btn--primary" : "h-btn--outline"}`}
                        href={btn.href}
                      >
                        {btn.label}
                      </a>
                    )
                  )}
                </div>
              </div>
              {slide.imgSide === "right" && (
                <div className="h-hero__visual">
                  <img src={slide.img} alt={`IdooTech slide ${i + 1}`} />
                  {slide.badge && (
                    <div className="h-hero__visual-badge">
                      <span className="h-hero__visual-badge-num">{slide.badge.num}</span>
                      <span className="h-hero__visual-badge-text">{slide.badge.text}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button ref={prevRef} className="h-hero__arrow h-hero__arrow--prev" aria-label="Previous slide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button ref={nextRef} className="h-hero__arrow h-hero__arrow--next" aria-label="Next slide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </section>
  );
}

/* ============ STATS BAR ============ */
const STATS = [
  { num: "10,000+", label: "Users Reached" },
  { num: "10+", label: "Industries Served" },
  { num: "3", label: "Platforms Built" },
  { num: "50+", label: "Projects Delivered" },
];

function StatsBar() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".h-reveal").forEach((el) =>
            el.classList.add("is-visible")
          );
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="h-stats" ref={ref}>
      <div className="h-container">
        <div className="h-stats__grid">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={(i % 4) + 1}>
              <div className="h-stat">
                <span className="h-stat__num">{s.num}</span>
                <span className="h-stat__label">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SERVICES ============ */
const SERVICE_CATEGORIES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Software Development",
    desc: "Custom web and mobile applications, SaaS platforms, and scalable backend systems built with modern architectures.",
    services: ["Web & Mobile Apps", "SaaS & API Development"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Integrated AI",
    desc: "Intelligent automation, machine learning models, and AI-powered features embedded into your existing workflows.",
    services: ["AI/ML Integration", "LLM & Computer Vision"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    title: "Robotics",
    desc: "Educational robotics programs, automation systems, and embedded solutions that bridge hardware with software.",
    services: ["Robotics Education", "Automation & Embedded Systems"],
  },
];

function Services() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".h-reveal").forEach((el) =>
            el.classList.add("is-visible")
          );
        }
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="h-services" id="services" ref={ref}>
      <div className="h-container">
        <Reveal>
          <p className="h-label">What We Do</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="h-section-title">
            Three core pillars, infinite possibilities.
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="h-section-desc">
            From code to cognition to hardware, we deliver end-to-end
            technology solutions that drive real-world impact.
          </p>
        </Reveal>
        <div className="h-services__grid">
          {SERVICE_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.title} delay={(i % 3) + 1}>
              <div className="h-service-card">
                <div className="h-service-card__icon">{cat.icon}</div>
                <h3 className="h-service-card__title">{cat.title}</h3>
                <p className="h-service-card__desc">{cat.desc}</p>
                <ul className="h-service-card__list">
                  {cat.services.map((s) => (
                    <li key={s}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {s}
                    </li>
                  ))}
                </ul>
                <Link to="/services" className="h-service-card__link">
                  Learn more
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ ABOUT ============ */
function About() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".h-reveal").forEach((el) =>
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
    <section className="h-about" ref={ref}>
      <div className="h-container">
        <div className="h-about__grid">
          <div className="h-about__text">
            <Reveal>
              <p className="h-label">Who We Are</p>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="h-about__title">
                Built on the belief that technology should empower, not
                complicate.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="h-about__desc">
                IdooTech bridges the gap between innovation and practical
                application. We are a team of engineers, educators, and
                strategists who design, teach, and build together.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="h-about__meta">
                <div className="h-about__meta-item">
                  <span className="h-about__meta-value">2023</span>
                  <span className="h-about__meta-label">Founded</span>
                </div>
                <div className="h-about__meta-item">
                  <span className="h-about__meta-value">Lagos</span>
                  <span className="h-about__meta-label">Nigeria</span>
                </div>
                <div className="h-about__meta-item">
                  <span className="h-about__meta-value">12+</span>
                  <span className="h-about__meta-label">Team Members</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={4}>
              <Link to="/about" className="h-btn h-btn--primary">
                Learn our story
              </Link>
            </Reveal>
          </div>
          <Reveal type="right">
            <div className="h-about__visual">
              <img src="/idoo2.jpg" alt="IdooTech team collaborating" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============ PORTFOLIO ============ */
const PROJECTS = [
  {
    title: "EduManage",
    tag: "SaaS",
    desc: "A comprehensive school management system that streamlines admissions, attendance, grading, fee management, and parent-teacher communication.",
    img: "/idoo1.jpg",
  },
  {
    title: "TIM — EduTech Program",
    tag: "Education",
    desc: "Our flagship program teaching coding, robotics, AI, and digital graphics to students, equipping them with in-demand skills for the future.",
    img: "/idoo2.jpg",
  },
  {
    title: "Client Web Portal",
    tag: "Web App",
    desc: "A white-label client portal that enables businesses to manage projects, share files, communicate with clients, and track deliverables.",
    img: "/idoo3.jpg",
  },
];

function Portfolio() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".h-reveal").forEach((el) =>
            el.classList.add("is-visible")
          );
        }
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="h-portfolio" ref={ref}>
      <div className="h-container">
        <Reveal>
          <p className="h-label">Our Work</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="h-section-title">
            Platforms we&apos;ve shipped.
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="h-section-desc">
            Every platform we build solves a real problem. Here are three we&apos;re
            most proud of.
          </p>
        </Reveal>
        <div className="h-portfolio__grid">
          {PROJECTS.map((proj, i) => (
            <Reveal key={proj.title} delay={(i % 3) + 1}>
              <div className="h-portfolio-card">
                <div className="h-portfolio-card__img">
                  <img src={proj.img} alt={proj.title} />
                  <span className="h-portfolio-card__tag">{proj.tag}</span>
                </div>
                <div className="h-portfolio-card__body">
                  <h3 className="h-portfolio-card__title">{proj.title}</h3>
                  <p className="h-portfolio-card__desc">{proj.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="h-portfolio__cta">
            <Link to="/portfolio" className="h-btn h-btn--outline">
              View all projects
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ PROCESS ============ */
const STEPS = [
  {
    num: "01",
    title: "Discovery",
    desc: "We start by understanding your challenge, your users, and your goals through research and conversation.",
  },
  {
    num: "02",
    title: "Design",
    desc: "We craft user-centred interfaces and brand systems that are both beautiful and functional.",
  },
  {
    num: "03",
    title: "Build",
    desc: "Our engineers develop robust, scalable platforms using modern technologies and best practices.",
  },
  {
    num: "04",
    title: "Launch",
    desc: "We deploy, monitor, and support your platform to ensure it performs at its best from day one.",
  },
];

function Process() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".h-reveal").forEach((el) =>
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
    <section className="h-process" ref={ref}>
      <div className="h-container">
        <Reveal>
          <p className="h-label">How We Work</p>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="h-section-title">
            From idea to launch, step by step.
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="h-section-desc">
            Our process is simple, transparent, and designed to deliver results
            at every stage.
          </p>
        </Reveal>
        <div className="h-process__grid">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={(i % 4) + 1}>
              <div className="h-process-step">
                <span className="h-process-step__num">{step.num}</span>
                <h3 className="h-process-step__title">{step.title}</h3>
                <p className="h-process-step__desc">{step.desc}</p>
              </div>
            </Reveal>
          ))}
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
