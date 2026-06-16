/**
 * BlochSphere.tsx — Interactive 3D Bloch Sphere (Simplified)
 * Design: Minimal elegant — clean sphere, state vector, essential elements only
 * Uses Three.js for WebGL rendering with mouse-drag interaction
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface BlochSphereProps {
  theta?: number; // polar angle (0 = |0>, π = |1>)
  phi?: number;   // azimuthal angle
  interactive?: boolean;
  className?: string;
}

export default function BlochSphere({
  theta: initialTheta = Math.PI / 4,
  phi: initialPhi = Math.PI / 6,
  interactive = true,
  className = "",
}: BlochSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    stateVector: THREE.ArrowHelper;
    animFrame: number;
    isDragging: boolean;
    prevMouse: { x: number; y: number };
    sphereGroup: THREE.Group;
    theta: number;
    phi: number;
    autoRotate: boolean;
  } | null>(null);

  const [stateLabel, setStateLabel] = useState({ theta: initialTheta, phi: initialPhi });

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(480, 480, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(2.8, 1.8, 2.8);
    camera.lookAt(0, 0, 0);

    // ── Group for rotation ────────────────────────────────────
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // ── Sphere (simple wireframe outline) ────────────────────
    const sphereGeo = new THREE.SphereGeometry(1, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x73614a,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    sphereGroup.add(new THREE.Mesh(sphereGeo, sphereMat));

    // ── Equator line (single reference circle) ────────────────
    const eqPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      eqPoints.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    const eqLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(eqPoints),
      new THREE.LineBasicMaterial({ color: 0x73614a, transparent: true, opacity: 0.3 })
    );
    sphereGroup.add(eqLine);

    // ── Vertical axis ────────────────────────────────────────
    const axisLen = 1.35;
    const axisYPoints = [
      new THREE.Vector3(0, -axisLen, 0),
      new THREE.Vector3(0, axisLen, 0),
    ];
    const axisY = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(axisYPoints),
      new THREE.LineBasicMaterial({ color: 0x73614a, transparent: true, opacity: 0.25 })
    );
    sphereGroup.add(axisY);

    // ── Pole markers (simple dots) ────────────────────────────
    const dotGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const dotMat0 = new THREE.MeshBasicMaterial({ color: 0x73614a });
    const dotMat1 = new THREE.MeshBasicMaterial({ color: 0xb8956a });
    const dot0 = new THREE.Mesh(dotGeo, dotMat0);
    dot0.position.set(0, 1, 0);
    const dot1 = new THREE.Mesh(dotGeo, dotMat1);
    dot1.position.set(0, -1, 0);
    sphereGroup.add(dot0, dot1);

    // ── State Vector (main visual element) ────────────────────
    const arrowDir = new THREE.Vector3(
      Math.sin(initialTheta) * Math.cos(initialPhi),
      Math.cos(initialTheta),
      Math.sin(initialTheta) * Math.sin(initialPhi)
    ).normalize();

    const stateVector = new THREE.ArrowHelper(
      arrowDir,
      new THREE.Vector3(0, 0, 0),
      0.95,
      0x73614a,
      0.2,
      0.1
    );
    (stateVector.line.material as THREE.LineBasicMaterial).color.set(0x73614a);
    sphereGroup.add(stateVector);

    // ── Ambient light ─────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // ── State ─────────────────────────────────────────────────
    let theta = initialTheta;
    let phi = initialPhi;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let autoRotate = true;

    const updateStateVector = (t: number, p: number) => {
      const dir = new THREE.Vector3(
        Math.sin(t) * Math.cos(p),
        Math.cos(t),
        Math.sin(t) * Math.sin(p)
      ).normalize();
      stateVector.setDirection(dir);
      setStateLabel({ theta: t, phi: p });
    };

    // ── Mouse/Touch interaction ───────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      sphereGroup.rotation.y += dx * 0.008;
      sphereGroup.rotation.x += dy * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      autoRotate = false;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      sphereGroup.rotation.y += dx * 0.008;
      sphereGroup.rotation.x += dy * 0.008;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    if (interactive) {
      renderer.domElement.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd);
    }

    // ── Animation loop ────────────────────────────────────────
    let frame = 0;
    const animate = () => {
      const animFrame = requestAnimationFrame(animate);
      sceneRef.current!.animFrame = animFrame;

      frame++;
      // Slow precession of the state vector
      if (!isDragging) {
        phi += 0.004;
        theta = initialTheta + Math.sin(frame * 0.005) * 0.15;
        updateStateVector(theta, phi);
        if (autoRotate) {
          sphereGroup.rotation.y += 0.003;
        }
      }

      renderer.render(scene, camera);
    };

    const animFrame = requestAnimationFrame(animate);

    sceneRef.current = {
      renderer, scene, camera, stateVector, animFrame,
      isDragging, prevMouse, sphereGroup, theta, phi, autoRotate,
    };

    return () => {
      cancelAnimationFrame(animFrame);
      if (interactive) {
        renderer.domElement.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        renderer.domElement.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
      }
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  const alpha2 = Math.cos(stateLabel.theta / 2) ** 2;
  const beta2 = Math.sin(stateLabel.theta / 2) ** 2;

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", display: "block", overflow: "hidden" }}
    >
      <div
        ref={mountRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: interactive ? "grab" : "default" }}
      />

      {/* State readout overlay */}
      <div style={{ position: "absolute", left: "1rem", bottom: "1rem", zIndex: 1, pointerEvents: "none", fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", lineHeight: 1.45, letterSpacing: "0.08em" }}>
        <div style={{ color: "oklch(0.50 0.02 40)" }}>// quantum state</div>
        <div style={{ color: "oklch(0.45 0.08 50)" }}>
          |ψ⟩ = {alpha2.toFixed(3)}|0⟩ + {beta2.toFixed(3)}|1⟩
        </div>
        <div style={{ color: "oklch(0.50 0.02 40)" }}>
          θ = {stateLabel.theta.toFixed(3)} rad &nbsp; φ = {(stateLabel.phi % (Math.PI * 2)).toFixed(3)} rad
        </div>
      </div>

      {/* Pole labels */}
      <div style={{ position: "absolute", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 1, pointerEvents: "none", fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.08em", color: "oklch(0.45 0.08 50)" }}>
        |0⟩
      </div>
      <div style={{ position: "absolute", bottom: "4rem", left: "50%", transform: "translateX(-50%)", zIndex: 1, pointerEvents: "none", fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.08em", color: "oklch(0.50 0.02 40)" }}>
        |1⟩
      </div>

      {interactive && (
        <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 1, pointerEvents: "none", fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.08em", color: "oklch(0.50 0.02 40)" }}>
          drag to rotate
        </div>
      )}
    </div>
  );
}
