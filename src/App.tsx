import BlochSphere from "../BlochSphere";

const projectTags = [
  "Zero Noise Extrapolation (ZNE)",
  "State Preparation and Measurement (SPAM)",
  "NVIDIA Frameworks CUDA/Ising",
  "Python",
  "Qiskit",
  "Rust",
];

const skillSections = [
  {
    title: "Languages",
    items: ["Python", "Rust", "JavaScript / TypeScript", "Qiskit"],
  },
  {
    title: "Frameworks & Tools",
    items: ["Qiskit", "CUDA", "Ising models", "Research tooling"],
  },
  {
    title: "Specializations",
    items: ["Quantum Computing", "Error Mitigation", "Algorithm Design", "Hybrid Systems"],
  },
  {
    title: "Other Skills",
    items: ["System Design", "Technical Leadership", "Collaboration", "Research Communication"],
  },
];

const experience = [
  {
    title: "President",
    subtitle: "Quantum Computing Club · Ensign College",
    status: "Present",
    description:
      "Lead collaboration, create space for others to grow, and help organize quantum learning and project work.",
    bullets: ["Organize club initiatives", "Support member growth", "Bridge research and implementation"],
  },
  {
    title: "Capstone Project Lead",
    subtitle: "Anecho · 2026",
    status: "Active",
    description:
      "Building a NISQ-era error mitigation engine with SPAM characterization, ensemble slicing, ZNE, CUDA, and Ising-based calibration.",
    bullets: ["Research error mitigation methods", "Design the implementation stack", "Prepare paper and publication materials"],
  },
  {
    title: "Quantum Computing Learner",
    subtitle: "Independent research · Since June 2025",
    status: "Ongoing",
    description:
      "Learning, building, and applying quantum computing ideas through technical projects and self-directed research.",
    bullets: ["Study Rust and Qiskit capabilities", "Develop practical quantum workflows", "Connect classical and quantum tools"],
  },
];

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          <button className="brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            
           <a href="/" className="logo-group">
  <span className="brand-mark">ψ</span> 
  <span className="logo-text">EFSL</span>
</a>
          </button>

          <nav className="site-nav" aria-label="Primary">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero shell" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Quantum computing · software engineering · research</p>
            <h1>E. F. Souza Lima</h1>
            <p className="subtitle">Software Engineer specializing in Quantum Computing and Error Mitigation.</p>
            <p className="lede">
              I build practical systems at the intersection of quantum computing and classical software, with a focus on research-driven implementation and usable tools.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">View Projects</a>
              <a className="button button-secondary" href="#contact">Contact</a>
            </div>
          </div>

          <aside className="bloch-panel" aria-label="Bloch sphere illustration">
            <BlochSphere className="bloch-widget" />
          </aside>
        </section>

        <section className="section section-alt" id="about">
          <div className="shell section-header">
            <p className="eyebrow">01 / About</p>
            <h2>About Me</h2>
          </div>

          <div className="shell about-grid">
            <article className="card bio-card">
              <div className="portrait" aria-hidden="false" />
              <div className="fact-list">
                <div>
                  <span>Location</span>
                  <strong>Salvador, Bahia, Brazil</strong>
                </div>
                <div>
                  <span>Focus</span>
                  <strong>Quantum + Classical Computing</strong>
                </div>
                <div>
                  <span>Role</span>
                  <strong>President, Quantum Computing Club</strong>
                </div>
                <div>
                  <span>Stack</span>
                  <strong>Python · Rust · Qiskit</strong>
                </div>
              </div>
            </article>

            <article className="bio-copy">
              <p>
                I’m Eduardo, originally from Salvador, Bahia, Brazil. I’ve always been drawn to technology as a way to solve meaningful problems, build useful systems, and contribute to the future in a practical way.
              </p>
              <p>
                My work sits at the intersection of quantum computing and classical computing. I began my quantum journey in June last year, and since then I’ve been learning, building, and applying those ideas through my technical work and projects.
              </p>
              <p>
                Today, I serve as president of the Quantum Computing Club at Ensign College, where I value thoughtful leadership, collaboration, and creating space for others to grow.
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="shell section-header">
            <p className="eyebrow">02 / Projects</p>
            <h2>Featured Projects</h2>
          </div>

          <div className="shell project-grid">
            <article className="card project-card featured">
              <div className="card-head">
                <div>
                  <h3>Anecho</h3>
                  <p className="project-meta">NISQ era error mitigation engine</p>
                </div>
                <span className="badge active">Active</span>
              </div>
              <p>
                Anecho is my 2026 capstone project and the project I am actively working on. It uses State Preparation and Measurement (SPAM) characterization, ensemble slicing, and ZNE to optimize circuits, with CUDA and Ising calibration to improve overall results.
              </p>
              <h4>Tech Stack</h4>
              <div className="tag-row">
                {projectTags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
              <h4>Current Goals</h4>
              <ul className="clean-list">
                <li>Research topics and apply them in Anecho</li>
                <li>Write a research paper and publish on OCRID</li>
                <li>Expand Rust and Qiskit capabilities</li>
              </ul>
              <div className="link-row">
                <a href="https://github.com/CosmicLM/anecho">GitHub →</a>
                <a href="https://efsouzalima.dev/anecho">Live Demo →</a>
              </div>
            </article>

            <article className="card project-card">
              <div className="card-head">
                <div>
                  <h3>HyprAI</h3>
                  <p className="project-meta">AI assistant for quantum development</p>
                </div>
                <span className="badge">Prototype</span>
              </div>
              <p>
                AI assistant concept designed to guide and aid quantum development workflows.
              </p>
              <h4>Tech Stack</h4>
              <div className="tag-row">
                <span className="tag">AI tooling</span>
                <span className="tag">Quantum workflows</span>
              </div>
              <h4>Key Achievements</h4>
              <ul className="clean-list">
                <li>Focused the concept on practical developer support</li>
                <li>Explored integration points for quantum tooling</li>
              </ul>
              <div className="link-row">
                <a href="https://github.com/your-repo">GitHub →</a>
              </div>
            </article>

            <article className="card project-card">
              <div className="card-head">
                <div>
                  <h3>Quantum Circuits</h3>
                  <p className="project-meta">Ongoing experimentation</p>
                </div>
                <span className="badge">Ongoing</span>
              </div>
              <p>
                Exploration of quantum circuit design, implementation, and the practical significance of the results.
              </p>
              <h4>Tech Stack</h4>
              <div className="tag-row">
                <span className="tag">Python</span>
                <span className="tag">Research</span>
              </div>
              <div className="link-row">
                <a href="https://github.com/your-repo">GitHub →</a>
              </div>
            </article>
          </div>
        </section>

        <section className="section section-alt" id="skills">
          <div className="shell section-header">
            <p className="eyebrow">03 / Skills</p>
            <h2>Skills & Expertise</h2>
          </div>

          <div className="shell skills-grid">
            {skillSections.map((section) => (
              <article className="card skill-card" key={section.title}>
                <h3>{section.title}</h3>
                <ul className="clean-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="experience">
          <div className="shell section-header split">
            <div>
              <p className="eyebrow">04 / Experience</p>
              <h2>Experience</h2>
            </div>
            <p className="section-note">Lead: Quantum Computing Club · Capstone: Anecho</p>
          </div>

          <div className="shell experience-list">
            {experience.map((item) => (
              <article className="card experience-card" key={item.title}>
                <div className="experience-top">
                  <div>
                    <h3>{item.title}</h3>
                    <p className="project-meta">{item.subtitle}</p>
                  </div>
                  <span className="badge">{item.status}</span>
                </div>
                <p>{item.description}</p>
                <ul className="clean-list">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-alt" id="contact">
          <div className="shell section-header">
            <p className="eyebrow">05 / Contact</p>
            <h2>Let's Connect</h2>
          </div>

          <div className="shell contact-card card">
            <p>
              I’m always interested in collaborating on interesting projects or discussing quantum computing, error mitigation, and software engineering. Feel free to reach out.
            </p>
            <div className="link-row contact-links">
              <a href="mailto:your.email@example.com">Email</a>
              <a href="https://github.com/your-github">GitHub</a>
              <a href="https://linkedin.com/in/your-linkedin">LinkedIn</a>
              <a href="https://twitter.com/your-twitter">X / Twitter</a>
            </div>
          </div>
        </section>
      </main>

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