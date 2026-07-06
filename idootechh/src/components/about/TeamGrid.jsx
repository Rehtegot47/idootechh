import { useEffect, useRef } from "react";
import "./about.css";

const TEAM = [
  {
    title: "Engineers and Developers",
    desc: "Full software development lifecycle across web, mobile, desktop, server, and embedded applications.",
    icon: "code",
  },
  {
    title: "Robotics and AI Specialists",
    desc: "Design and deployment of intelligent systems, plus applied machine learning for real-world problems.",
    icon: "spark",
  },
  {
    title: "Educators and Trainers",
    desc: "Run TIM, our EduTech program - teaching coding, robotics, AI, and digital graphics to future innovators.",
    icon: "book",
  },
  {
    title: "Business and Strategy Experts",
    desc: "IT consultancy and advisory work that guides digital transformation and operational efficiency.",
    icon: "compass",
  },
  {
    title: "UI/UX Designer",
    desc: "Creates the user experience and interface of the software and hardware.",
    icon: "Hero",
  },
  {
    title: "Cyber Security",
    desc: "Protects the software from cyber threats, and develops secure software and hardware.",
    icon: "padlock",
  },
];

export default function TeamGrid() {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="idt-section" id="team" ref={sectionRef}>
      <div className="idt-container">
        <p className="idt-eyebrow idt-reveal">
          <TeamIcon /> Who We Are
        </p>
        <h2 className="idt-h2 idt-reveal idt-reveal--delay-1">
          One team, Six disciplines.
        </h2>
        <p className="idt-p idt-reveal idt-reveal--delay-2" style={{ maxWidth: 600, marginBottom: 0 }}>
          IdooTech is built from people who design, teach, and build -
          together.
        </p>

        <div className="idt-team__grid">
          {TEAM.map((member, i) => (
            <TeamCard key={member.title} {...member} delay={(i % 4) + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ title, desc, icon, delay }) {
  return (
    <div className={`idt-team-card idt-reveal idt-reveal--delay-${delay}`}>
      <div className="idt-team-card__body">
        <span className="idt-team-card__icon">
          <Icon name={icon} />
        </span>
        <h3 className="idt-team-card__title">{title}</h3>
        <p className="idt-team-card__desc">{desc}</p>
      </div>
    </div>
  );
}

function Icon({ name }) {
  switch (name) {
    case "code":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M8 6 3 12l5 6M16 6l5 6-5 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "compass":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path
            d="m15 9-4 2-2 4 4-2 2-4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Hero":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="15" cy="15" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "padlock":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" />
          <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 10v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function TeamIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
