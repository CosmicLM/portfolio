---
title: "SPAM Calibration Drift Under Repeated Shot Batching"
date: "2026-07-18"
type: "log"
status: "Resolved"
pillars: ["Anecho", "Error Mitigation"]
tags: ["spam", "calibration", "rust", "cuda"]
---

## Context

While profiling the SPAM (State Preparation and Measurement) calibration
pass in Anecho's Rust core, I noticed calibration matrices drifting by
~2-3% after long-running batches of micro-shots, even on the same backend
session.

## Investigation

Instrumented the calibration loop with a checkpoint dump every 500 shots:

```rust
fn checkpoint(cal: &CalibrationMatrix, step: usize) {
    if step % 500 == 0 {
        eprintln!("[cal] step={step} trace={:.6}", cal.trace());
    }
}
```

The trace was monotonically decreasing, which pointed at floating point
accumulation error rather than a hardware effect — the readout counts
were being folded into the matrix with `+=` across an f32 accumulator
instead of being re-derived from raw counts each pass.

## Fix

Switched the accumulator to f64 and rebuild the matrix from raw counts
on every calibration refresh instead of incrementally updating it:

```rust
let matrix = CalibrationMatrix::from_counts(&raw_counts); // f64 internally
```

## Result

Drift dropped below measurement noise floor (<0.1%) across a 10k-shot
soak test. Filed as a regression test in `tests/spam_soak.rs`.
