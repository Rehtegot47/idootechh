import { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import Footer from "../Footer";
import "./notfound.css";

export default function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="nf-page">
      <SEO title="404" description="Page not found." path="*" />
      <div className="nf-container">
        <p className="nf-eyebrow">404</p>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-desc">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="nf-btn">
          Back to home
        </Link>
      </div>
      <Footer />
    </main>
  );
}
