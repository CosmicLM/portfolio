---
title: "Experiment: Dynamic Micro-Shot Slicing for ZNE Regressions"
date: "2026-07-25"
type: "experiment"
status: "In-Progress"
pillars: ["Anecho", "Zero Noise Extrapolation"]
tags: ["zne", "shots", "python", "ffi"]
---

## Hypothesis

Fixed shot budgets per noise-scale factor waste samples on low-variance
folds and under-sample high-variance ones. Slicing shot count dynamically
per fold, based on running variance, should tighten the ZNE regression
without increasing total shot count.

## Setup

- Backend: local Qiskit Aer simulator with injected depolarizing noise
- Baseline: fixed 4,096 shots per noise-scale factor (1x, 2x, 3x)
- Variant: adaptive slicing, 512-shot increments, cutoff at
  `stderr / mean < 0.02` or a 4,096-shot ceiling

```python
def adaptive_shots(circuit, backend, increment=512, ceiling=4096, tol=0.02):
    counts = Counter()
    total = 0
    while total < ceiling:
        counts.update(run(circuit, backend, shots=increment))
        total += increment
        if relative_stderr(counts) < tol:
            break
    return counts
```

## Early Results

Adaptive slicing converged in ~60% of the fixed shot budget on average
across 20 test circuits, with regression R² within 0.01 of the baseline.

## Open Questions

- Does the early-exit bias the tail of the noise-scale sweep, where
  variance is structurally higher regardless of convergence?
- Need to run this against real hardware queue latency, not just the
  simulator, before trusting the shot savings translate to wall-clock time.
