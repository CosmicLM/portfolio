import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const navProjects = [
  {
    slug: "anecho",
    title: "Anecho",
    meta: "NISQ-era error mitigation engine",
  },
  {
    slug: "florinda",
    title: "Florinda",
    meta: "Voice-driven AI research assistant for Linux",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    // Bypass CSS `scroll-behavior: smooth` (which also intercepts scrollTo)
    // so route changes land at the top instantly, not via an animated scroll.
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.hash]);

  return (
    <>
      <div className="ambient-field" aria-hidden="true" />
      <div className="grid-field" aria-hidden="true" />
      <div className="grain-field" aria-hidden="true" />

      <header className="site-header">
        <div className="shell header-inner">
          <Link className="brand" to="/">
            <span className="logo-group">
              <span className="brand-mark">ψ</span>
              <span className="logo-text">EFSL</span>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <Link to="/#about">About</Link>

            <div className="nav-dropdown">
              <Link to="/#projects" aria-haspopup="true">
                Projects <span className="nav-dropdown-caret" aria-hidden="true">▾</span>
              </Link>
              <div className="nav-dropdown-panel">
                <div className="nav-dropdown-panel-inner">
                  {navProjects.map((project) => (
                    <Link
                      key={project.slug}
                      to={`/projects/${project.slug}`}
                      className="nav-dropdown-item"
                    >
                      <span className="nav-dropdown-item-title">{project.title}</span>
                      <span className="nav-dropdown-item-meta">{project.meta}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/#skills">Skills</Link>
            <Link to="/#experience">Experience</Link>
            <Link to="/logs">Logs</Link>
            <Link to="/#contact">Contact</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>E. F. Souza Lima · Quantum Computing & Software Engineering</p>
          <p>Built with React, TypeScript, and Three.js</p>
          <p>© 2026 E. F. Souza Lima</p>
        </div>
      </footer>
    </>
  );
}
