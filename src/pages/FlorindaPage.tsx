import { Link } from "react-router-dom";

export default function FlorindaPage() {
  return (
    <article className="project-page shell">
      <Link to="/#projects" className="back-link">← Back to Projects</Link>

      <header className="project-hero">
        <div className="card-head">
          <p className="eyebrow">Personal Project · Ongoing</p>
          <span className="badge active">Active</span>
        </div>
        <h1>Florinda</h1>
        <p className="subtitle">A voice-driven, Jarvis-style research assistant built for Linux and Hyprland.</p>
        <p className="lede">
          Florinda runs as a recursive, session-based AI agent deeply integrated into a Hyprland desktop — activated by voice, aware of your active window and workspace, and built specifically to support quantum computing research without leaving your keyboard.
        </p>
        <div className="link-row">
          <a href="https://github.com/CosmicLM/florinda-ai">GitHub →</a>
        </div>
      </header>

      <section className="project-section">
        <h2>Overview</h2>
        <p>
          Florinda is a voice-activated research assistant designed specifically for Hyprland users, aimed at getting instant answers, running research, and managing tasks without breaking flow. Publicly the assistant is called "Florinda" — that's its name in the README and anything user-facing — while internally the codebase uses the short technical token <code>flora</code> for anything invisible to the end user: file names, environment variables, the systemd service, and the Docker container for its search backend.
        </p>
      </section>

      <section className="project-section">
        <h2>Architecture</h2>
        <p>
          The assistant is built around a recursive, session-based prompting model. The first prompt in any interaction is the user's own request; every prompt after that is treated as a "Session" — the AI can call itself again recursively, creating a new session each time it needs to continue reasoning or acting.
        </p>
        <p>
          Behavior is configured through two files: <code>INSTRUCTION.md</code>, the system prompt (with template variables like <code>$EOC</code> for command separation and <code>$SYS_INFO</code> for system context, to avoid unnecessary recursions), and <code>SESSION.md</code>, which runs as the "user prompt" for every recursion, carrying forward the previous session's info, the command that was executed, and its output.
        </p>
        <p>
          It supports multiple AI providers interchangeably — Gemini, any OpenAI-compatible endpoint, or Anthropic — configured through a single <code>.env</code> file alongside the voice model and dozens of other tunable settings (screen-watch interval, watcher cooldowns, timeouts).
        </p>
      </section>

      <section className="project-section">
        <h2>Tech Stack</h2>
        <div className="tag-row">
          <span className="tag">Python</span>
          <span className="tag">Linux / Hyprland</span>
          <span className="tag">Qiskit Visualization</span>
          <span className="tag">Speech / TTS</span>
          <span className="tag">Multi-Provider AI (Gemini · OpenAI · Anthropic)</span>
          <span className="tag">systemd</span>
          <span className="tag">Docker</span>
        </div>
      </section>

      <section className="project-section">
        <h2>What Works Today</h2>
        <ul className="clean-list">
          <li>Qiskit visualization and quantum circuit generation, called directly from voice commands</li>
          <li>Text-to-speech responses</li>
          <li>A notification status bar for at-a-glance assistant state</li>
          <li>Hands-free web search</li>
          <li>A skill-creation system that lets the assistant extend its own capabilities</li>
        </ul>
      </section>

      <section className="project-section">
        <h2>Under the Hood</h2>
        <p>
          Passive screen-awareness (context via OCR) uses <code>grim</code> on any wlroots compositor — Hyprland, Sway, river — with zero extra setup, and falls back automatically to the <code>org.freedesktop.portal.ScreenCast</code> D-Bus portal on GNOME, KDE, or X11 session managers. Window and workspace control still requires Hyprland specifically; portability for that piece hasn't happened yet.
        </p>
        <p>
          Installation is handled by an interactive installer that detects your distro (Arch, Debian, or Fedora) and desktop, installs system dependencies, sets up the Python venv, walks through picking an AI provider and voice model, brings up the search container, and installs the systemd service.
        </p>
      </section>

      <section className="project-section">
        <h2>Roadmap</h2>
        <ul className="roadmap-list">
          <li className="done">Voice activation, TTS, and hands-free web search</li>
          <li className="done">Qiskit circuit visualization and generation</li>
          <li className="done">Skill-creation system</li>
          <li>Full screen-watching support (currently landing)</li>
          <li>GNOME/Ubuntu &amp; Debian desktop support (Hyprland-specific pieces still need a portability pass)</li>
        </ul>
      </section>
    </article>
  );
}
