import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BlochSphere from "../../BlochSphere";

const projectTags = [
  "Zero Noise Extrapolation (ZNE)",
  "State Preparation and Measurement (SPAM)",
  "CUDA (NVIDIA)",
  "Ising Model Calibration",
  "Python",
  "Qiskit",
  "Rust",
];

const skillSections = [
  {
    title: "Languages",
    items: ["Python", "Rust", "TypeScript", "Qiskit", "Java (Learning)"],
  },
  {
    title: "Frameworks & Tools",
    items: ["Qiskit", "CUDA", "Ising Models", "AI Agents & LLM APIs", "Research Tooling"],
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

function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "article" | "aside";
  className?: string;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as as any;
  return (
    <Tag ref={ref} className={`reveal${visible ? " is-visible" : ""} ${className}`.trim()} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero shell" id="home">
        <Reveal as="div" className="hero-copy">
          <p className="eyebrow">Quantum computing · AI systems · software engineering</p>
          <h1 className="heading-quantum" data-text="E. F. Souza Lima">E. F. Souza Lima</h1>
          <p className="subtitle">Computer Science student building real systems in quantum computing and AI.</p>
          <p className="lede">
            I build working projects at the intersection of quantum computing, AI, and classical software — including an error mitigation engine and a voice-driven research assistant — while studying Computer Science and leading my school's Quantum Computing Club.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">View Projects</a>
            <a className="button button-secondary" href="#contact">Contact</a>
          </div>
        </Reveal>

        <Reveal as="aside" delay={150} className="bloch-panel" aria-label="Bloch sphere illustration">
          <BlochSphere className="bloch-widget" />
        </Reveal>
      </section>

      <section className="section section-alt" id="about">
        <Reveal as="div" className="shell section-header">
          <span className="section-index">01</span>
          <div className="section-heading">
            <p className="eyebrow"><span className="ket-bracket" aria-hidden="true">⟨</span>About<span className="ket-bracket" aria-hidden="true">⟩</span></p>
            <h2 className="heading-quantum" data-text="About Me">About Me</h2>
          </div>
        </Reveal>

        <div className="shell about-grid">
          <Reveal as="article" className="card bio-card">
            <div className="portrait" aria-hidden="false" />
            <div className="fact-list">
              <div>
                <span>Location</span>
                <strong>Salt Lake City, Utah, USA</strong>
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
                <strong>Python · Rust · TypeScript · Qiskit</strong>
              </div>
            </div>
          </Reveal>

          <Reveal as="article" delay={120} className="bio-copy">
            <p>
              I’m Eduardo, originally from Salvador, Bahia, Brazil. I’ve always been drawn to technology as a way to solve meaningful problems, build useful systems, and contribute to the future in a practical way.
            </p>
            <p>
              My work sits at the intersection of quantum computing, AI, and classical computing. I began my quantum journey in June last year, and since then I’ve been learning, building, and applying those ideas through my technical work and projects.
            </p>
            <p>
              Today, I serve as president of the Quantum Computing Club at Ensign College, where I value thoughtful leadership, collaboration, and creating space for others to grow.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" id="projects">
        <Reveal as="div" className="shell section-header">
          <span className="section-index">02</span>
          <div className="section-heading">
            <p className="eyebrow"><span className="ket-bracket" aria-hidden="true">⟨</span>Projects<span className="ket-bracket" aria-hidden="true">⟩</span></p>
            <h2 className="heading-quantum" data-text="Featured Projects">Featured Projects</h2>
          </div>
        </Reveal>

        <div className="shell project-grid">
          <Reveal as="article" className="card project-card featured">
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
              <li>Write a research paper and publish findings with an ORCID record</li>
              <li>Expand Rust and Qiskit capabilities</li>
            </ul>
            <div className="link-row">
              <Link to="/projects/anecho">Read the full write-up →</Link>
              <a href="https://github.com/CosmicLM/anecho">GitHub →</a>
            </div>
          </Reveal>

          <Reveal as="article" delay={120} className="card project-card">
            <div className="card-head">
              <div>
                <h3>Florinda</h3>
                <p className="project-meta">Voice-driven AI research assistant for Linux</p>
              </div>
              <span className="badge active">Active</span>
            </div>
            <p>
              Florinda is a Jarvis-style research assistant built for Linux and Hyprland. It runs a recursive, session-based AI agent that supports multiple providers (Gemini, OpenAI-compatible, and Anthropic), understands your active window and workspace, and brings quantum tooling directly into a hands-free workflow.
            </p>
            <h4>Tech Stack</h4>
            <div className="tag-row">
              <span className="tag">Python</span>
              <span className="tag">Linux / Hyprland</span>
              <span className="tag">Qiskit Visualization</span>
              <span className="tag">Speech / TTS</span>
              <span className="tag">Multi-Provider AI (Gemini · OpenAI · Anthropic)</span>
            </div>
            <h4>Key Achievements</h4>
            <ul className="clean-list">
              <li>Built a recursive session-based agent architecture with a configurable system prompt</li>
              <li>Shipped voice activation, text-to-speech, and hands-free web search</li>
              <li>Integrated live Qiskit circuit visualization and generation into the assistant</li>
              <li>Added a skill-creation system so the assistant can extend its own capabilities</li>
            </ul>
            <div className="link-row">
              <Link to="/projects/florinda">Read the full write-up →</Link>
              <a href="https://github.com/CosmicLM/florinda-ai">GitHub →</a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" id="skills">
        <Reveal as="div" className="shell section-header">
          <span className="section-index">03</span>
          <div className="section-heading">
            <p className="eyebrow"><span className="ket-bracket" aria-hidden="true">⟨</span>Skills<span className="ket-bracket" aria-hidden="true">⟩</span></p>
            <h2 className="heading-quantum" data-text="Skills & Expertise">Skills & Expertise</h2>
          </div>
        </Reveal>

        <div className="shell skills-grid">
          {skillSections.map((section, index) => (
            <Reveal as="article" delay={index * 90} className="card skill-card" key={section.title}>
              <h3>{section.title}</h3>
              <ul className="clean-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" id="experience">
        <Reveal as="div" className="shell section-header split">
          <div className="section-heading-group">
            <span className="section-index">04</span>
            <div className="section-heading">
              <p className="eyebrow"><span className="ket-bracket" aria-hidden="true">⟨</span>Experience<span className="ket-bracket" aria-hidden="true">⟩</span></p>
              <h2 className="heading-quantum" data-text="Experience">Experience</h2>
            </div>
          </div>
          <p className="section-note">Lead: Quantum Computing Club · Capstone: Anecho</p>
        </Reveal>

        <div className="shell experience-list">
          {experience.map((item, index) => (
            <Reveal as="article" delay={index * 90} className="card experience-card" key={item.title}>
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
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-alt" id="contact">
        <Reveal as="div" className="shell section-header">
          <span className="section-index">05</span>
          <div className="section-heading">
            <p className="eyebrow"><span className="ket-bracket" aria-hidden="true">⟨</span>Contact<span className="ket-bracket" aria-hidden="true">⟩</span></p>
            <h2 className="heading-quantum" data-text="Let's Connect">Let's Connect</h2>
          </div>
        </Reveal>

        <Reveal as="div" className="shell contact-card card">
          <p>
            I’m always interested in collaborating on interesting projects or discussing quantum computing, error mitigation, and software engineering. Feel free to reach out.
          </p>
          <div className="link-row contact-links">
            <a href="mailto:edsouzalb@gmail.com">Email</a>
            <a href="https://github.com/CosmicLM">GitHub</a>
            <a href="https://www.linkedin.com/in/edusouzalima">LinkedIn</a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
