import { Link } from "react-router-dom";

export default function AnechoPage() {
  return (
    <article className="project-page shell">
      <Link to="/#projects" className="back-link">← Back to Projects</Link>

      <header className="project-hero">
        <div className="card-head">
          <p className="eyebrow">2026 Capstone Project · Early-Stage</p>
          <span className="badge">Early-Stage</span>
        </div>
        <h1>Anecho</h1>
        <p className="subtitle">"Silencing the noise in the NISQ era." A hardware-agnostic quantum error mitigation engine.</p>
        <p className="lede">
          Anecho aims to bridge the gap between noisy quantum hardware and reliable algorithmic results, starting with Zero-Noise Extrapolation (ZNE) techniques adaptable to both superconducting (IBM) and neutral-atom (PASQAL) architectures. It's my 2026 capstone project for the Quantum Computing Club at Ensign College.
        </p>
        <div className="link-row">
          <a href="https://github.com/CosmicLM/anecho">GitHub →</a>
        </div>
      </header>

      <section className="project-section">
        <div className="status-callout">
          <p className="eyebrow">Where It Actually Stands</p>
          <p>
            I want to be upfront about this one: Anecho is early. The repository right now is mostly scaffolding — a README, an empty test/notebook structure, and a single real script — rather than a finished mitigation pipeline. Everything below is organized around what's actually built versus what's on the roadmap, so it's clear which is which.
          </p>
        </div>
      </section>

      <section className="project-section">
        <h2>What's Built Today</h2>
        <p>
          The current codebase has one working piece: a baseline noise-measurement experiment. It builds a two-qubit Bell-state circuit in Qiskit, runs it on an ideal simulator (Qiskit Aer) and again on a noisy simulator modeled after IBM's real "Kyoto" backend (via <code>FakeKyoto</code>), and compares the resulting measurement counts. That comparison — ideal vs. noisy — is the baseline every future mitigation technique in Anecho will need to measurably improve on.
        </p>
        <div className="tag-row">
          <span className="tag">Python</span>
          <span className="tag">Qiskit</span>
          <span className="tag">Qiskit Aer</span>
          <span className="tag">Qiskit IBM Runtime (Fake Providers)</span>
        </div>
      </section>

      <section className="project-section">
        <h2>Roadmap</h2>
        <p>
          The project's stated goals, from its own README, none of which are implemented yet:
        </p>
        <ul className="roadmap-list">
          <li>Hardware-agnostic support: Qiskit first, with Pulser (work in progress) and Qadence planned</li>
          <li>Modular extrapolation: plug-and-play Linear, Polynomial, and Exponential folding for ZNE</li>
          <li>Calibration-aware mitigation: adjusting strategy based on a backend's daily T1/T2 properties</li>
        </ul>
      </section>

      <section className="project-section">
        <h2>Why This Approach</h2>
        <p>
          NISQ-era devices are noisy enough that raw circuit output is often unreliable without some form of post-processing correction. Zero-Noise Extrapolation works by deliberately running a circuit at several amplified noise levels, then extrapolating back to what the result would look like at zero noise — no extra hardware or calibration runs required beyond what the backend already exposes. Starting with a solid, reproducible noise baseline (the Bell-state experiment above) is the necessary first step before any extrapolation strategy can be validated.
        </p>
      </section>

      <section className="project-section">
        <h2>Current Goals</h2>
        <ul className="clean-list">
          <li>Get the baseline noise-characterization experiments solid before building extrapolation on top</li>
          <li>Research and implement the first working ZNE folding strategy</li>
          <li>Write a research paper and publish findings with an ORCID record</li>
        </ul>
      </section>
    </article>
  );
}
