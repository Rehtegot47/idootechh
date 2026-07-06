import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import AboutPage from "./components/about/AboutPage";
import "./App.css";

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="app-nav">
      <Link to="/" className="app-nav__logo">
        Idoo<span>Tech</span>
      </Link>
      <div className="app-nav__links">
        <Link to="/" className={isHome ? "active" : ""}>Home</Link>
        <Link to="/about" className={!isHome ? "active" : ""}>About</Link>
      </div>
    </nav>
  );
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App
