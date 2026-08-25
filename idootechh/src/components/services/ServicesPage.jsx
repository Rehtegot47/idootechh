import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import Footer from "../Footer";
import PageHero from "../PageHero";
import "./services.css";

export default function ServicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="s-page">
      <SEO title="Services" description="End-to-end capabilities across Software Development, Integrated AI, and Robotics to help organisations thrive in a digital world." path="/services" />
      <Hero />
      <Categories />
      <Process />
      <CTASection />
      <Footer />
    </main>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <PageHero
      eyebrow="What We Do"
      title={<>Technology that <span className="pg-hero__title-accent">builds, thinks, moves</span>.</>}
      description="From code to cognition to hardware, we deliver end-to-end technology solutions that drive real-world impact."
      image={{ src: "/services.jpg", alt: "Abstract visualization of IdooTech's connected software, AI, and automation services" }}
      badge="Software · AI · Robotics"
      actions={[
        { to: "/contact", label: "Start a project", variant: "primary" },
        { to: "/portfolio", label: "View our work", variant: "ghost" },
      ]}
    />
  );
}

/* ============ CATEGORIES ============ */
const CATEGORIES = [
  {
    id: "software",
    title: "Software Development",
    tagline: "Custom platforms built for scale and performance.",
    color: "green",
    services: [
      {
        title: "Web & Mobile Applications",
        desc: "Full-stack web and mobile apps, SaaS platforms, and APIs using modern architectures and best practices.",
        features: ["React, Next.js, Flutter, Node.js", "RESTful & GraphQL API design", "Database design & optimization", "Cloud deployment (AWS, GCP, Azure)", "CI/CD pipeline setup", "Performance monitoring & optimization"],
      },
      {
        title: "SaaS & Backend Systems",
        desc: "Scalable backend infrastructure, microservices, and white-label platforms tailored to your business model.",
        features: ["Microservice architecture", "Authentication & authorization", "Payment gateway integration", "Multi-tenant SaaS design", "Real-time data processing", "Database replication & sharding"],
      },
    ],
  },
  {
    id: "ai",
    title: "Integrated AI",
    tagline: "Intelligence woven into your workflows.",
    color: "purple",
    services: [
      {
        title: "AI/ML Integration",
        desc: "Embed intelligent automation, predictive models, and data pipelines into your existing products and operations.",
        features: ["Machine learning model deployment", "Natural language processing (NLP)", "Predictive analytics & forecasting", "Recommendation engines", "Anomaly detection systems", "Data pipeline engineering"],
      },
      {
        title: "LLM & Computer Vision",
        desc: "Leverage large language models and vision AI to build conversational agents, document intelligence, and visual recognition.",
        features: ["LLM fine-tuning & RAG pipelines", "Chatbot & virtual assistant development", "Document parsing & extraction", "Image classification & object detection", "OCR & document digitization", "Real-time video analysis"],
      },
    ],
  },
  {
    id: "robotics",
    title: "Robotics",
    tagline: "Where hardware meets intelligent software.",
    color: "green",
    services: [
      {
        title: "Robotics Education",
        desc: "Curriculum design, training programs, and hands-on kits that teach coding, electronics, and robotics to students of all levels.",
        features: ["Robotics curriculum design (K-12 & tertiary)", "Hands-on workshop facilitation", "IoT & embedded systems training", "Competition coaching (RoboRave, FLL)", "STEM lab setup & consulting", "Train-the-trainer programs"],
      },
      {
        title: "Automation & Embedded Systems",
        desc: "Custom automation solutions, embedded firmware, and IoT integrations for industrial and commercial applications.",
        features: ["Embedded firmware development (C, Rust)", "IoT sensor integration & dashboards", "Industrial automation (PLC, SCADA)", "Prototyping & PCB design", "Wireless communication (BLE, LoRa, Zigbee)", "Edge computing deployment"],
      },
    ],
  },
];

function Categories() {
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
      { threshold: 0.06 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="s-categories" id="categories" ref={ref}>
      <div className="s-container">
        {CATEGORIES.map((cat, i) => (
          <div key={cat.id} className="s-category" id={cat.id}>
            <div className="s-category__header reveal-up">
              <p className={`s-category__num s-category__num--${cat.color}`}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h2 className="s-category__title">{cat.title}</h2>
                <p className="s-category__tagline">{cat.tagline}</p>
              </div>
            </div>

            <div className="s-category__grid">
              {cat.services.map((svc) => (
                <div key={svc.title} className="s-service reveal-up">
                  <h3 className="s-service__title">{svc.title}</h3>
                  <p className="s-service__desc">{svc.desc}</p>
                  <ul className="s-service__features">
                    {svc.features.map((f) => (
                      <li key={f}>
                        <CheckIcon /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ PROCESS ============ */
const STEPS = [
  { num: "01", title: "Discovery", desc: "We learn about your business, goals, and challenges through in-depth consultation." },
  { num: "02", title: "Strategy", desc: "We craft a tailored roadmap with clear milestones, timelines, and deliverables." },
  { num: "03", title: "Design & Build", desc: "Our team executes with precision - designing, developing, and testing every detail." },
  { num: "04", title: "Launch & Support", desc: "We deploy, monitor, and provide ongoing support to ensure long-term success." },
];

function Process() {
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
    <section className="s-process" id="process" ref={ref}>
      <div className="s-container">
        <div className="s-process__grid-wrap">
          <div className="s-process__content">
            <p className="s-eyebrow reveal-up">How We Work</p>
            <h2 className="s-process__title reveal-up reveal--delay-1">
              From concept to reality in four steps.
            </h2>

            <div className="s-process__grid">
              {STEPS.map((step, i) => (
                <div key={step.num} className={`s-step reveal-up reveal--delay-${i + 1}`}>
                  <span className="s-step__num">0{i + 1}</span>
                  <div className="s-step__body">
                    <h3 className="s-step__title">{step.title}</h3>
                    <p className="s-step__desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="s-process__visual reveal-up reveal--delay-3">
            <img src="/idoo2.jpg" alt="IdooTech team collaborating" />
          </div>
        </div>
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
    <section className="s-cta" ref={ref}>
      <div className="s-container">
        <div className="s-cta__inner reveal-up">
          <h2 className="s-cta__title">Ready to get started?</h2>
          <p className="s-cta__desc">
            Tell us about your project and we&apos;ll put together a proposal
            tailored to your needs.
          </p>
          <div className="s-cta__actions">
            <Link to="/contact" className="s-btn s-btn--primary">
              Start a project
            </Link>
            <Link to="/portfolio" className="s-btn s-btn--outline">
              View our work
            </Link>
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
