import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import Footer from "../Footer";
import PageHero from "../PageHero";
import "./faq.css";

export default function FAQPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="f-page">
      <SEO title="FAQ" description="Frequently asked questions about IdooTech's services, process, and more." path="/faq" />
      <Hero />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <PageHero
      eyebrow="FAQ"
      title={<>Frequently asked <span className="pg-hero__title-accent">questions</span>.</>}
      description="Everything you need to know about working with IdooTech."
      image={{ src: "/FAQ.jpg", alt: "Hand tapping a tablet surrounded by icons representing common questions" }}
      badge="Answers before you ask"
      actions={[
        { to: "/contact", label: "Still have questions?", variant: "primary" },
        { to: "/services", label: "View services", variant: "ghost" },
      ]}
    />
  );
}

/* ============ FAQ ============ */
const FAQS = [
  {
    q: "What services does IdooTech offer?",
    a: "We offer three core service areas: Software Development (custom platforms, web & mobile apps, SaaS), Integrated AI (AI/ML integration, LLMs, computer vision), and Robotics (robotics education, automation & embedded systems). Each area includes multiple specialised services. Visit our Services page for full details.",
  },
  {
    q: "How do I get started with a project?",
    a: "Simply head to our Contact page and fill out the form with details about your project. We'll review your request and schedule a discovery call to understand your goals, timeline, and budget before proposing a tailored solution.",
  },
  {
    q: "What is the typical project timeline?",
    a: "Timelines vary depending on the scope and complexity. A typical branding project takes 2-4 weeks, a UI/UX design project 3-6 weeks, and a full platform build 8-16 weeks. We'll provide a clear timeline during the proposal stage.",
  },
  {
    q: "Do you offer ongoing support after project completion?",
    a: "Yes. We offer maintenance and support packages tailored to each project. This includes updates, monitoring, security patches, and priority support. We'll discuss options before launch so you can choose what fits best.",
  },
  {
    q: "What industries do you work with?",
    a: "We've served over 10 industries including logistics, real estate, education, NGOs, and more. Our solutions are adaptable - we take time to understand your specific industry challenges before designing a solution.",
  },
  {
    q: "What is TIM - your EduTech program?",
    a: "TIM (Technology, Innovation & Me) is our flagship education program that teaches coding, robotics, AI, and digital graphics to students aged 8-18. It's designed to equip the next generation with in-demand technology skills.",
  },
  {
    q: "Can you work with our existing team or tools?",
    a: "Absolutely. We integrate with your existing workflows, tools, and team structure. Our goal is to complement your capabilities, not replace them. We'll assess your current setup and recommend the best approach.",
  },
  {
    q: "What is your pricing model?",
    a: "We offer project-based pricing for most engagements. After understanding your requirements, we provide a fixed-price proposal with clear deliverables and milestones. For ongoing work, we offer retainer packages.",
  },
];

function FAQSection() {
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
    <section className="f-faq" id="faq" ref={ref}>
      <div className="f-container">
        <div className="f-faq__list">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, answer, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`f-faq__item reveal-up reveal--delay-${(index % 3) + 1}${open ? " is-open" : ""}`}>
      <button className="f-faq__question" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{question}</span>
        <svg
          className="f-faq__chevron"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="f-faq__answer">
        <p>{answer}</p>
      </div>
    </div>
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
    <section className="f-cta" ref={ref}>
      <div className="f-container">
        <div className="f-cta__inner reveal-up">
          <h2 className="f-cta__title">Still have questions?</h2>
          <p className="f-cta__desc">We&apos;re happy to help. Reach out and we&apos;ll get back to you.</p>
          <div className="f-cta__actions">
            <Link to="/contact" className="f-btn f-btn--primary">
              Contact us
            </Link>
            <Link to="/services" className="f-btn f-btn--outline">
              View services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


