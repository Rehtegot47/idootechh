import { useEffect, useRef, useState } from "react";
import SEO from "../SEO";
import Footer from "../Footer";
import PageHero from "../PageHero";
import "./contact.css";

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="c-page">
      <SEO title="Contact" description="Have a project in mind? Get in touch with IdooTech. We'd love to hear from you." path="/contact" />
      <Hero />
      <ContactSection />
      <Footer />
    </main>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <PageHero
      eyebrow="Get in Touch"
      title="Let's start a conversation."
      description="Have a project in mind, a question, or just want to say hello? We'd love to hear from you."
      image={{ src: "/contact.jpg", alt: "Colleagues talking in a modern office, representing IdooTech's team ready to connect" }}
      imageSide="left"
    />
  );
}

/* ============ CONTACT ============ */
function ContactSection() {
  const ref = useRef(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".reveal-up").forEach((el) =>
            el.classList.add("is-visible")
          );
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.target);
    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      if (res.ok) {
        setStatus("success");
        e.target.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="c-contact" id="contact" ref={ref}>
      <div className="c-container">
        <div className="c-contact__grid">
          <div className="c-contact__form-wrap reveal-up">
            <h2 className="c-h2">Send us a message</h2>
            {status === "success" ? (
              <div className="c-form__success">
                <p>Thanks for reaching out! We'll get back to you shortly.</p>
              </div>
            ) : (
              <form className="c-form" onSubmit={handleSubmit}>
                <div className="c-form__row">
                  <div className="c-form__group">
                    <label htmlFor="name">Your Name</label>
                    <input id="name" name="name" type="text" required placeholder="John Doe" />
                  </div>
                  <div className="c-form__group">
                    <label htmlFor="email">Your Email</label>
                    <input id="email" name="email" type="email" required placeholder="john@example.com" />
                  </div>
                </div>
                <div className="c-form__group">
                  <label htmlFor="subject">Subject</label>
                  <input id="subject" name="subject" type="text" required placeholder="How can we help?" />
                </div>
                <div className="c-form__group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" required placeholder="Tell us about your project..." />
                </div>
                <button type="submit" className="c-btn c-btn--primary" disabled={status === "sending"}>
                  <SendIcon /> {status === "sending" ? "Sending..." : "Send message"}
                </button>
                {status === "error" && (
                  <p className="c-form__error">Something went wrong. Please try again or email us directly.</p>
                )}
              </form>
            )}
          </div>

          <div className="c-contact__info reveal-up reveal--delay-2">
            <h2 className="c-h2">Contact info</h2>
            <p className="c-contact__sub">
              Reach out through any of the channels below.
            </p>

            <div className="c-info__cards">
              <InfoCard icon="mail" label="Email" value="info@idootech.com.ng" href="mailto:info@idootech.com.ng" />
              <InfoCard icon="whatsapp" label="WhatsApp" value="+234 816 989 1512" href="https://wa.me/2348169891512" />
              <InfoCard icon="globe" label="Website" value="www.idootech.com.ng" href="https://www.idootech.com.ng" />
            </div>
          </div>
        </div>

        <div className="c-map reveal-up reveal--delay-3">
          <iframe
            title="IdooTech location"
            src="https://maps.google.com/maps?q=Satellite+Town+Lagos+Nigeria&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: 16 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, label, value, href }) {
  return (
    <a href={href} className="c-info-card" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
      <span className="c-info-card__icon">
        <InfoIcon name={icon} />
      </span>
      <div>
        <p className="c-info-card__label">{label}</p>
        <p className="c-info-card__value">{value}</p>
      </div>
    </a>
  );
}

/* ============ ICONS ============ */
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon({ name }) {
  switch (name) {
    case "mail":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" fill="currentColor" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12h20M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
