import { useEffect, useRef } from "react";
import "./about.css";

const SERVICES = [
  {
    category: "Branding",
    items: [
      {
        title: "Brand Identity & Strategy",
        desc: "Crafting unique brand identities, positioning, and messaging that resonate with your audience and set you apart.",
        icon: "palette",
      },
      {
        title: "Visual Design & Guidelines",
        desc: "Comprehensive visual systems including logos, typography, colour palettes, and brand guidelines for consistency.",
        icon: "pen",
      },
    ],
  },
  {
    category: "Designing",
    items: [
      {
        title: "UI/UX Design",
        desc: "User-centred interfaces and seamless experiences across web and mobile platforms, backed by research and testing.",
        icon: "layout",
      },
      {
        title: "Graphic & Motion Design",
        desc: "Engaging visual content, illustrations, and motion graphics that communicate your message with impact.",
        icon: "play",
      },
    ],
  },
  {
    category: "Cyber Security",
    items: [
      {
        title: "Security Audits & Assessments",
        desc: "Thorough vulnerability assessments, penetration testing, and compliance audits to protect your infrastructure.",
        icon: "shield",
      },
      {
        title: "Threat Monitoring & Protection",
        desc: "Real-time monitoring, incident response, and proactive defence strategies to safeguard your digital assets.",
        icon: "lock",
      },
    ],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".idt-reveal").forEach((el) =>
              el.classList.add("is-visible")
            );
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="idt-section idt-section--tint" id="services" ref={sectionRef}>
      <div className="idt-container">
        <p className="idt-eyebrow idt-reveal">
          <ServicesIcon /> Our Services
        </p>
        <h2 className="idt-h2 idt-reveal idt-reveal--delay-1">
          Six services, three disciplines.
        </h2>
        <p className="idt-p idt-reveal idt-reveal--delay-2" style={{ maxWidth: 600, marginBottom: 0 }}>
          From brand strategy to cyber defence, we deliver end-to-end
          capabilities that help organisations thrive in a digital world.
        </p>

        {SERVICES.map((group, gi) => (
          <div key={group.category} className="idt-services__group idt-reveal idt-reveal--delay-3">
            <h3 className="idt-services__category">
              <CategoryIcon index={gi} /> {group.category}
            </h3>
            <div className="idt-services__grid">
              {group.items.map((svc, si) => (
                <ServiceCard key={svc.title} {...svc} delay={(si % 2) + 1} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ title, desc, icon, delay }) {
  return (
    <div className={`idt-service idt-reveal idt-reveal--delay-${delay}`}>
      <div className="idt-service__icon">
        <ServiceIcon name={icon} />
      </div>
      <h4 className="idt-service__title">{title}</h4>
      <p className="idt-service__desc">{desc}</p>
    </div>
  );
}

/* ============ ICONS ============ */
function ServicesIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CategoryIcon({ index }) {
  switch (index) {
    case 0:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
      );
    case 1:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 2:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

function ServiceIcon({ name }) {
  switch (name) {
    case "palette":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <circle cx="8" cy="10" r="1.5" fill="currentColor" />
          <circle cx="16" cy="10" r="1.5" fill="currentColor" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "pen":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "layout":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "play":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M10 8l6 4-6 4V8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" />
          <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
