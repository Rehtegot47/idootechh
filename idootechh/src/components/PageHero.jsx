import { Link } from "react-router-dom";
import "./PageHero.css";

/**
 * @param {{
 *   eyebrow: string,
 *   title: import("react").ReactNode,
 *   description: string,
 *   image: { src: string, alt: string },
 *   badge?: string,
 *   actions?: Array<{ to: string, label: string, variant?: "primary" | "ghost" }>,
 *   imageSide?: "left" | "right",
 * }} props
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  badge,
  actions,
  imageSide = "right",
}) {
  return (
    <header className={`pg-hero pg-hero--${imageSide}`}>
      <div className="pg-hero__decor pg-hero__decor--a" aria-hidden="true" />
      <div className="pg-hero__decor pg-hero__decor--b" aria-hidden="true" />

      <div className="pg-hero__container">
        <div className="pg-hero__content">
          <p className="pg-hero__eyebrow">
            <span className="pg-hero__eyebrow-dot" />
            {eyebrow}
          </p>
          <h1 className="pg-hero__title">{title}</h1>
          <p className="pg-hero__desc">{description}</p>

          {actions && actions.length > 0 && (
            <div className="pg-hero__actions">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`pg-hero__btn pg-hero__btn--${action.variant || "primary"}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="pg-hero__visual">
          <div className="pg-hero__card">
            <img src={image.src} alt={image.alt} loading="eager" />
          </div>
          {badge && (
            <div className="pg-hero__badge">
              <span className="pg-hero__badge-dot" />
              {badge}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
