import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import Footer from "../Footer";
import PageHero from "../PageHero";
import "./portfolio.css";

export default function PortfolioPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="p-page">
      <SEO title="Portfolio" description="Explore platforms built by IdooTech - from e-commerce and hospitality booking to school SaaS, robotics tooling, and client portals." path="/portfolio" />
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
    <PageHero
      eyebrow="Our Work"
      title={<>Platforms we&apos;ve <span className="pg-hero__title-accent">shipped</span>.</>}
      description="From e-commerce and hospitality booking to school SaaS, robotics tooling, and client portals - here's a look at what we've built."
      image={{ src: "/home-stats.jpg", alt: "Illuminated world map representing the reach of IdooTech's shipped platforms" }}
      badge="A growing library of real, shipped work"
      imageSide="left"
      actions={[
        { to: "/contact", label: "Start a project", variant: "primary" },
        { to: "/services", label: "Explore services", variant: "ghost" },
      ]}
    />
  );
}

/* ============ PROJECTS ============ */
const PROJECTS = [
  {
    title: "AdireByIfe",
    tag: "E-commerce · Client",
    desc: "A full e-commerce platform for a Nigerian Adire-textile fashion house - product catalog, custom & bulk orders, corporate gifting, and WhatsApp-based ordering.",
    image: { src: "/portfolio-shots/adirebyife.jpg", alt: "AdireByIfe online shop showing Adire fabric products" },
    link: "https://adirebyife.com",
  },
  {
    title: "QuickBooking",
    tag: "Travel & Hospitality",
    desc: "A nationwide hotel, apartment, and event-venue booking platform with live availability, an admin dashboard, and an AI trip concierge.",
    image: { src: "/portfolio-shots/quickbooking.jpg", alt: "QuickBooking homepage showing property search and booking" },
    link: "https://quickbooking.org",
  },
  {
    title: "Silver Tongue Consult",
    tag: "Client Website",
    desc: "A voice-coaching and communication-excellence consultancy site - built for Silver Tongue Consult, with course enrolment and event details.",
    image: { src: "/portfolio-shots/silvertongue.jpg", alt: "Silver Tongue Consult homepage" },
    link: "https://silvertongueconsult.web.app",
  },
  {
    title: "MindForge",
    tag: "EdTech · Robotics",
    desc: "A youth robotics and STEM learning platform - courses, robot-building kits, and a mentorship community for young makers.",
    image: { src: "/portfolio-shots/mindforge.jpg", alt: "MindForge homepage for youth robotics education" },
    link: "https://mind-forge-frontend-8qms.vercel.app",
  },
  {
    title: "EaziSchool CBT",
    tag: "EdTech SaaS",
    desc: "A multi-tenant computer-based testing system for schools - each school gets its own isolated database and subdomain.",
    image: { src: "/portfolio-shots/eazischoolcbt.jpg", alt: "EaziSchool CBT sign-in screen" },
    link: "https://cbt.eazischool.com",
  },
  {
    title: "Jakapams Staff Portal",
    tag: "Client · Internal Tools",
    desc: "A staff records portal built for Jakapams Foods Nigeria Ltd to manage employee registration and secure admin access.",
    image: { src: "/portfolio-shots/jakapams.jpg", alt: "Jakapams Foods staff records portal sign-in screen" },
    link: "https://idootech.com.ng/jakapams/",
  },
  {
    title: "Accelerator Hive",
    tag: "Real Estate",
    desc: "A real-estate development platform with property listings, a realtor portal, and relocation services for clients across Nigeria.",
    image: { src: "/portfolio-shots/acceleratorhive.jpg", alt: "Accelerator Hive real estate homepage" },
    link: "https://acceleratorhive.com",
  },
  {
    title: "Viva Homes",
    tag: "Hospitality",
    desc: "A hospitality and luxury-living brand site covering serviced apartments, resorts, and a lifestyle academy.",
    image: { src: "/portfolio-shots/vivahomes.jpg", alt: "Viva Homes hospitality homepage" },
    link: "https://vivahomes.ng",
  },
  {
    title: "AM Africa Computer World",
    tag: "EdTech · Training",
    desc: "A tech training academy site with course enrolment, a training hub, and a built-in CBT/school-management system.",
    image: { src: "/portfolio-shots/amafrica.jpg", alt: "AM Africa Computer World training lab" },
    link: "https://amafrica.com.ng",
  },
  {
    title: "TIM - EduTech Program",
    tag: "Education",
    desc: "IdooTech's flagship EduTech program - teaching coding, robotics, AI, and digital graphics to 4,000+ students across Nigeria.",
    image: { src: "/idoo1.jpg", alt: "Student using a VR headset as part of the TIM program" },
  },
  {
    title: "GuruYard",
    tag: "EdTech · Web & Mobile",
    desc: "AM Africa's grassroots tech e-learning platform - course categories and enrolment on a Laravel backend, with a companion Flutter mobile app.",
    image: { src: "/portfolio-shots/guruyard.jpg", alt: "GuruYard homepage - Your Grassroot TECH E-Learning Platform" },
    link: "https://dev.amafrica.com.ng/",
  },
  {
    title: "Arduino & ESP32 Communicator",
    tag: "Robotics · Desktop App",
    desc: "A cross-platform Electron app for discovering and communicating with Arduino and ESP32 devices over Wi-Fi and Bluetooth.",
    poster: { variant: "arduino", icon: "robotics" },
  },
  {
    title: "Robotics & IoT Prototyping Lab",
    tag: "Robotics · IoT",
    desc: "A growing lab of hands-on robotics and embedded builds - a robotic arm, Wi-Fi & Bluetooth-controlled rovers, a talking robot assistant, smart-home and traffic-light automation, and assistive tech like obstacle-sensing goggles for the visually impaired.",
    poster: { variant: "roboticslab", icon: "robotics" },
  },
  {
    title: "LodgePoint",
    tag: "In Development",
    desc: "A hotel-booking platform being built - listings, pricing plans, and a full booking flow.",
    image: { src: "/portfolio-shots/lodgepoint.jpg", alt: "LodgePoint hotel booking website design" },
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
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="p-projects" id="projects" ref={ref}>
      <div className="p-container">
        <div className="p-grid">
          {PROJECTS.map((proj) => (
            <ProjectCard key={proj.title} proj={proj} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ proj }) {
  const Wrapper = proj.link ? "a" : "div";
  const wrapperProps = proj.link
    ? { href: proj.link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper className="p-card reveal-up" {...wrapperProps}>
      <div className="p-card__media">
        {proj.image ? (
          <img src={proj.image.src} alt={proj.image.alt} loading="lazy" />
        ) : (
          <div className={`p-card__poster p-card__poster--${proj.poster.variant}`}>
            <ProjectIcon name={proj.poster.icon} />
            <span className="p-card__poster-name">{proj.title}</span>
            {proj.tag === "In Development" && (
              <span className="p-card__poster-badge">Coming Soon</span>
            )}
          </div>
        )}
      </div>
      <div className="p-card__body">
        <span className="p-card__tag">{proj.tag}</span>
        <h3 className="p-card__title">{proj.title}</h3>
        <p className="p-card__desc">{proj.desc}</p>
        {proj.link && (
          <span className="p-card__link">
            Visit site <ArrowIcon />
          </span>
        )}
      </div>
    </Wrapper>
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
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProjectIcon({ name }) {
  if (name === "marketplace") {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 9l1.5-5h15L21 9M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18M9 13a3 3 0 0 0 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "robotics") {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 8V5a3 3 0 0 1 6 0v3M9 12h.01M15 12h.01M8 18v2M16 18v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 21v-8h5a1 1 0 0 1 1 1v7M8 8h1M8 12h1M8 16h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
