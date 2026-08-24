import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import Footer from "../Footer";
import "./portfolio.css";

export default function PortfolioPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="p-page">
      <SEO title="Portfolio" description="Explore platforms built by IdooTech — from school management systems to EduTech programs and client portals." path="/portfolio" />
      <Hero />
      <Projects />
      <CTASection />
      <Footer />
    </main>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <section className="p-hero">
      <div className="p-hero__bg" aria-hidden="true" />
      <div className="p-hero__overlay" aria-hidden="true" />
      <div className="p-container">
        <div className="p-hero__grid">
          <div className="p-hero__visual">
            <img src="/portfolio.jpg" alt="IdooTech portfolio" width="520" height="390" />
          </div>
          <div className="p-hero__content">
            <p className="p-eyebrow reveal-up">Our Work</p>
            <h1 className="p-h1 reveal-up reveal--delay-1">
              Platforms we&apos;ve <span className="p-h1-accent">shipped</span>.
            </h1>
            <p className="p-hero__desc reveal-up reveal--delay-2">
              Every platform we build solves a real problem. Here are three we&apos;re most proud of.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ PROJECTS ============ */
const PROJECTS = [
  {
    title: "EduManage — School Management Platform",
    tag: "SaaS",
    desc: "A comprehensive school management system that streamlines admissions, attendance, grading, fee management, and parent-teacher communication. Built for secondary schools across Nigeria.",
    features: ["Student & staff record management", "Automated fee tracking & invoicing", "Real-time attendance & gradebooks", "Parent portal & SMS notifications", "Timetable & exam scheduling", "Analytics & performance reports"],
    year: "2024",
    client: "Multiple schools (Nigeria)",
    tech: "React, Node.js, PostgreSQL",
  },
  {
    title: "Client Portal — Web Portal Platform",
    tag: "Web App",
    desc: "A white-label client portal platform that enables businesses to manage projects, share files, communicate with clients, and track deliverables — all from a single dashboard.",
    features: ["Project & task management", "Secure file sharing & storage", "Client communication hub", "Invoice & payment tracking", "Custom branding per client", "Role-based access control"],
    year: "2024",
    client: "Various enterprise clients",
    tech: "Next.js, Express, MongoDB",
  },
  {
    title: "TIM — EduTech Program",
    tag: "Education",
    desc: "TIM (Technology, Innovation & Me) is IdooTech's flagship EduTech program. It teaches coding, robotics, AI, and digital graphics to students, equipping them with in-demand skills for the future.",
    features: ["Curriculum for ages 8–18", "Coding (Python, Scratch, Web)", "Robotics & hardware kits", "AI & machine learning basics", "Digital graphics & design", "Certification & project showcase"],
    year: "2023",
    client: "4,000+ students reached",
    tech: "Curriculum design, hands-on kits",
  },
];

function Projects() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".reveal-up").forEach((el) =>
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
    <section className="p-projects" id="projects" ref={ref}>
      <div className="p-container">
        {PROJECTS.map((proj) => (
          <div key={proj.title} className="p-project reveal-up">
            <div className="p-project__meta">
              <span className="p-project__tag">{proj.tag}</span>
              <span className="p-project__year">{proj.year}</span>
            </div>
            <h2 className="p-project__title">{proj.title}</h2>
            <p className="p-project__desc">{proj.desc}</p>

            <div className="p-project__details">
              <div className="p-project__detail">
                <span className="p-project__detail-label">Client</span>
                <span className="p-project__detail-value">{proj.client}</span>
              </div>
              <div className="p-project__detail">
                <span className="p-project__detail-label">Tech</span>
                <span className="p-project__detail-value">{proj.tech}</span>
              </div>
            </div>

            <ul className="p-project__features">
              {proj.features.map((f) => (
                <li key={f}>
                  <CheckIcon /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ CTA ============ */
function CTASection() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".reveal-up").forEach((el) =>
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
    <section className="p-cta" ref={ref}>
      <div className="p-container">
        <div className="p-cta__inner reveal-up">
          <div className="p-cta__content">
            <h2 className="p-cta__title">Want to build something similar?</h2>
            <p className="p-cta__desc">
              We&apos;d love to discuss your project and explore how we can help.
            </p>
            <div className="p-cta__actions">
              <Link to="/contact" className="p-btn p-btn--primary">
                Start a project
              </Link>
              <Link to="/services" className="p-btn p-btn--outline">
                See our services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ ICONS ============ */
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
