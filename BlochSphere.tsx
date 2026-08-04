/**
 * BlochSphere.tsx — Interactive 3D Bloch Sphere
 * Three orthogonal great circles + a softly lit translucent volume,
 * closer to a textbook Bloch sphere diagram than a wireframe globe.
 * Uses Three.js for WebGL rendering with mouse-drag interaction.
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

interface BlochSphereProps {
  theta?: number; // polar angle (0 = |0>, π = |1>)
  phi?: number;   // azimuthal angle
  interactive?: boolean;
  className?: string;
}

const LINE_COLOR = 0x7d5634;
const LINE_COLOR_STRONG = 0x5f401f;
const CREAM = 0xfff8ef;
const POLE_BOTTOM = 0xb99267;

function createGlowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,248,239,1)");
  gradient.addColorStop(0.4, "rgba(255,248,239,0.5)");
  gradient.addColorStop(1, "rgba(255,248,239,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function makeCircle(plane: (a: number) => THREE.Vector3, color: number, opacity: number, segments = 96) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    points.push(plane((i / segments) * Math.PI * 2));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geometry, material);
}

export default function BlochSphere({
  theta: initialTheta = Math.PI / 4,
  phi: initialPhi = Math.PI / 6,
  interactive = true,
  className = "",
}: BlochSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [stateLabel, setStateLabel] = useState({ theta: initialTheta, phi: initialPhi });
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    // ── Renderer ──────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const initialRect = el.getBoundingClientRect();
    renderer.setSize(initialRect.width || 480, initialRect.height || 480, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(2.8, 1.8, 2.8);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.DirectionalLight(0xfff3e6, 0.9);
    keyLight.position.set(3, 4, 2);
    scene.add(keyLight);

    // ── Soft atmospheric glow behind the sphere ────────────────
    const glowTexture = createGlowTexture();
    const aura = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: LINE_COLOR,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    aura.scale.set(3.2, 3.2, 1);
    aura.position.set(0, 0, -0.6);
    scene.add(aura);

    // ── Group for rotation ────────────────────────────────────
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // ── Soft translucent volume (lit, gives the sphere depth) ──
    // depthWrite is off: this is a thin translucent "shell" and must never
    // occlude the arrow/trail/glow behind it via the depth buffer, even
    // though it's nearly transparent.
    const volumeGeo = new THREE.SphereGeometry(1, 48, 32);
    const volumeMat = new THREE.MeshStandardMaterial({
      color: CREAM,
      transparent: true,
      opacity: 0.07,
      roughness: 0.65,
      metalness: 0,
      depthWrite: false,
    });
    sphereGroup.add(new THREE.Mesh(volumeGeo, volumeMat));

    // ── Wireframe web (base texture, under the great circles) ──
    const wireGeo = new THREE.SphereGeometry(1, 16, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: LINE_COLOR,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    sphereGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // ── Three orthogonal great circles ─────────────────────────
    const equator = makeCircle((a) => new THREE.Vector3(Math.cos(a), 0, Math.sin(a)), LINE_COLOR, 0.38);
    const meridianXY = makeCircle((a) => new THREE.Vector3(Math.cos(a), Math.sin(a), 0), LINE_COLOR, 0.16);
    const meridianYZ = makeCircle((a) => new THREE.Vector3(0, Math.cos(a), Math.sin(a)), LINE_COLOR, 0.16);
    sphereGroup.add(equator, meridianXY, meridianYZ);

    // ── Vertical axis (|0⟩ to |1⟩) ──────────────────────────────
    const axisLen = 1.35;
    const axisY = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -axisLen, 0),
        new THREE.Vector3(0, axisLen, 0),
      ]),
      new THREE.LineBasicMaterial({ color: LINE_COLOR_STRONG, transparent: true, opacity: 0.3 })
    );
    sphereGroup.add(axisY);

    // ── Pole markers ─────────────────────────────────────────────
    const dotGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const dot0 = new THREE.Mesh(
      dotGeo,
      new THREE.MeshStandardMaterial({ color: LINE_COLOR_STRONG, emissive: LINE_COLOR_STRONG, emissiveIntensity: 0.25 })
    );
    dot0.position.set(0, 1, 0);
    const dot1 = new THREE.Mesh(
      dotGeo,
      new THREE.MeshStandardMaterial({ color: POLE_BOTTOM, emissive: POLE_BOTTOM, emissiveIntensity: 0.25 })
    );
    dot1.position.set(0, -1, 0);
    sphereGroup.add(dot0, dot1);

    // ── State vector (glowing tip + equatorial projection line) ─
    const arrowDir = new THREE.Vector3(
      Math.sin(initialTheta) * Math.cos(initialPhi),
      Math.cos(initialTheta),
      Math.sin(initialTheta) * Math.sin(initialPhi)
    ).normalize();

    const stateVector = new THREE.ArrowHelper(arrowDir, new THREE.Vector3(0, 0, 0), 0.95, LINE_COLOR_STRONG, 0.18, 0.09);
    sphereGroup.add(stateVector);

    const glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: CREAM,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    glowSprite.scale.set(0.34, 0.34, 1);
    sphereGroup.add(glowSprite);

    const projectionGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const projectionLine = new THREE.Line(
      projectionGeo,
      new THREE.LineDashedMaterial({ color: LINE_COLOR, transparent: true, opacity: 0.45, dashSize: 0.045, gapSize: 0.035 })
    );
    // Geometry is mutated in place every frame via setXYZ — Three.js only computes
    // boundingSphere once (from the initial degenerate 0,0,0 points) and never
    // recomputes it, so frustum culling silently drops this line. Disable culling.
    projectionLine.frustumCulled = false;
    sphereGroup.add(projectionLine);

    // ── Path trail: traces recent motion, fading out over ~3s ────
    // Plain THREE.Line ignores linewidth in almost every browser (a WebGL
    // limitation), so a real, thick, dashed stroke needs the "fat lines"
    // module (Line2/LineMaterial/LineGeometry) instead of LineBasicMaterial.
    const TRAIL_LENGTH = 180;
    const TRAIL_HEAD_COLOR = new THREE.Color(LINE_COLOR_STRONG);
    const TRAIL_TAIL_COLOR = new THREE.Color(0xf7f4ee); // page background — fades the trail "into" it
    const trailPositions: THREE.Vector3[] = [];
    const trailGeometry = new LineGeometry();
    const trailMaterial = new LineMaterial({
      color: 0xffffff,
      vertexColors: true,
      linewidth: 3,
      dashed: true,
      dashSize: 0.05,
      gapSize: 0.035,
      transparent: true,
      depthWrite: false,
    });
    trailMaterial.resolution.set(initialRect.width || 480, initialRect.height || 480);
    const trailLine = new Line2(trailGeometry, trailMaterial);
    trailLine.frustumCulled = false;
    trailLine.visible = false;
    sphereGroup.add(trailLine);

    // ── State ─────────────────────────────────────────────────
    let theta = initialTheta;
    let phi = initialPhi;
    let isDragging = false;
    let coasting = false;
    let velX = 0;
    let velY = 0;
    let prevMouse = { x: 0, y: 0 };
    let autoRotate = true;

    const updateStateVector = (t: number, p: number) => {
      const dir = new THREE.Vector3(
        Math.sin(t) * Math.cos(p),
        Math.cos(t),
        Math.sin(t) * Math.sin(p)
      ).normalize();
      stateVector.setDirection(dir);

      const tip = dir.clone().multiplyScalar(0.95);
      glowSprite.position.copy(tip);

      const positions = projectionGeo.attributes.position as THREE.BufferAttribute;
      positions.setXYZ(0, tip.x, tip.y, tip.z);
      positions.setXYZ(1, tip.x, 0, tip.z);
      positions.needsUpdate = true;
      projectionLine.computeLineDistances();

      trailPositions.unshift(tip.clone());
      if (trailPositions.length > TRAIL_LENGTH) trailPositions.pop();
      const count = trailPositions.length;
      if (count >= 2) {
        const posArray = new Float32Array(count * 3);
        const colorArray = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const point = trailPositions[i];
          posArray[i * 3] = point.x;
          posArray[i * 3 + 1] = point.y;
          posArray[i * 3 + 2] = point.z;
          const age = i / TRAIL_LENGTH;
          const fade = Math.pow(1 - age, 1.6); // stays vivid, then eases out toward the tail
          const c = TRAIL_HEAD_COLOR.clone().lerp(TRAIL_TAIL_COLOR, 1 - fade);
          colorArray[i * 3] = c.r;
          colorArray[i * 3 + 1] = c.g;
          colorArray[i * 3 + 2] = c.b;
        }
        trailGeometry.setPositions(posArray);
        trailGeometry.setColors(colorArray);
        trailLine.computeLineDistances();
        trailLine.visible = true;
      }
    };
    updateStateVector(theta, phi);

    // ── Mouse/Touch interaction (with release inertia) ─────────
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      coasting = false;
      autoRotate = false;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      velY = dx * 0.008;
      velX = dy * 0.008;
      sphereGroup.rotation.y += velY;
      sphereGroup.rotation.x += velX;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging = false;
      coasting = true;
    };

    const onTouchStart = (e: TouchEvent) => {
      // Without this, the browser treats the same touch as a page scroll,
      // fighting the drag-rotate below and making it feel like it "glitches".
      e.preventDefault();
      isDragging = true;
      coasting = false;
      autoRotate = false;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      velY = dx * 0.008;
      velX = dy * 0.008;
      sphereGroup.rotation.y += velY;
      sphereGroup.rotation.x += velX;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
      coasting = true;
    };

    if (interactive) {
      // Belt-and-suspenders with the preventDefault() calls above: this
      // tells the browser at the compositor level not to treat drags
      // starting on the canvas as a page-scroll gesture in the first place.
      renderer.domElement.style.touchAction = "none";
      renderer.domElement.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: false });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
    }

    // ── Keep the renderer crisp at whatever size the panel is ───
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      trailMaterial.resolution.set(width, height);
    });
    resizeObserver.observe(el);

    // ── Animation loop ────────────────────────────────────────
    let frame = 0;
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      frame++;
      if (!isDragging) {
        phi += 0.014;
        // Oscillate around the equator so the state vector swings through
        // both hemispheres (toward |0⟩ and |1⟩), not just a wobble near the top.
        theta = Math.PI / 2 + Math.sin(frame * 0.012) * 1.15;
        updateStateVector(theta, phi);
        // Throttle the React-driven text readout — the 3D scene still
        // renders every frame, only the label re-render is capped.
        if (frame % 4 === 0) {
          setStateLabel({ theta, phi });
        }

        if (coasting) {
          // Decaying rotation after a drag release, instead of stopping dead.
          sphereGroup.rotation.y += velY;
          sphereGroup.rotation.x += velX;
          velX *= 0.94;
          velY *= 0.94;
          if (Math.abs(velX) + Math.abs(velY) < 0.0002) {
            coasting = false;
            velX = 0;
            velY = 0;
            autoRotate = true;
          }
        } else if (autoRotate) {
          sphereGroup.rotation.y += 0.0025;
        }
      }

      aura.material.opacity = 0.18 + Math.sin(frame * 0.01) * 0.04;

      renderer.render(scene, camera);
    };

    // Pause the render/animation loop entirely while the widget is
    // scrolled out of view, instead of burning CPU forever off-screen.
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!rafId) animate();
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(el);

    return () => {
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      if (interactive) {
        renderer.domElement.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        renderer.domElement.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
      }
      glowTexture.dispose();
      volumeGeo.dispose();
      volumeMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      dotGeo.dispose();
      projectionGeo.dispose();
      trailGeometry.dispose();
      trailMaterial.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  const alpha2 = Math.cos(stateLabel.theta / 2) ** 2;
  const beta2 = Math.sin(stateLabel.theta / 2) ** 2;

  if (webglError) {
    return (
      <div className="bloch-frame" aria-hidden="true">
        <div className="bloch-sphere" />
        <div className="bloch-orbit bloch-orbit-large" />
        <div className="bloch-orbit bloch-orbit-small" />
        <div className="bloch-axis bloch-axis-horizontal" />
        <div className="bloch-axis bloch-axis-vertical" />
        <div className="bloch-axis bloch-axis-depth" />
        <div className="bloch-equator" />
        <div className="bloch-meridian" />
        <div className="bloch-state" />
        <div className="bloch-pole bloch-pole-top" />
        <div className="bloch-pole bloch-pole-bottom" />
        <div className="bloch-label bloch-label-top">|0⟩</div>
        <div className="bloch-label bloch-label-bottom">|1⟩</div>
      </div>
    );
  }

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
