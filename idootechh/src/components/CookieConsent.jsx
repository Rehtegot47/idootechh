import { useState } from "react";

const STORAGE_KEY = "idootech_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent">
      <p className="cookie-consent__text">
        This website uses cookies to improve your experience. By continuing to browse, you agree to our use of cookies.
      </p>
      <button className="cookie-consent__btn" onClick={accept}>
        Accept
      </button>
    </div>
  );
}
