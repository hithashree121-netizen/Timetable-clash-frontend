import React, { useEffect, useRef } from 'react';

interface ChromeGlassSphereProps {
  size?: number;
  className?: string;
  showRings?: boolean;
  showSparkles?: boolean;
  interactive?: boolean;
}

export const ChromeGlassSphere: React.FC<ChromeGlassSphereProps> = ({
  size = 220,
  className = '',
  showRings = true,
  showSparkles = true,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ballWrapRef = useRef<HTMLDivElement | null>(null);
  const ringsWrapRef = useRef<HTMLDivElement | null>(null);
  const glowWrapRef = useRef<HTMLDivElement | null>(null);

  // High performance lerped mouse coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Sphere size is scaled relative to component size
  const ballSize = Math.round(size * 0.46);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let gl: WebGLRenderingContext | null = null;

    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    } catch {
      gl = null;
    }

    // WEBGL IMPLEMENTATION
    if (gl) {
      const vsSource = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        varying vec2 vUv;
        uniform float u_time;
        uniform vec2 u_mouse;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r2 = dot(p, p);
          if (r2 > 1.0) {
            discard;
          }

          // Sphere normal with 3D depth
          float z = sqrt(max(0.0, 1.0 - r2));
          vec3 N = vec3(p.x, p.y, z);

          // Dynamic mouse parallax tilt across website
          vec3 viewDir = normalize(vec3(-u_mouse * 0.65, 1.0));

          // Continuous 3D rotation over time
          float t = u_time * 0.65;
          float cosT = cos(t);
          float sinT = sin(t);

          // Rotated normal for chrome surface reflections
          vec3 rotN = vec3(
            N.x * cosT + N.z * sinT,
            N.y,
            -N.x * sinT + N.z * cosT
          );

          // Tilt axis slightly
          rotN = vec3(rotN.x, rotN.y * 0.92 - rotN.z * 0.38, rotN.y * 0.38 + rotN.z * 0.92);

          // Reflection vector
          vec3 R = reflect(-viewDir, N);
          vec3 rotR = vec3(
            R.x * cosT + R.z * sinT,
            R.y,
            -R.x * sinT + R.z * cosT
          );

          // Liquid chrome waves & environment refraction
          float wave1 = sin(rotR.y * 5.0 + rotR.x * 3.5 + t * 1.2) * 0.5 + 0.5;
          float wave2 = cos(rotR.x * 6.0 - rotR.z * 4.0 + t * 0.8) * 0.5 + 0.5;
          float wave3 = sin(length(rotR.xy) * 7.0 - t * 1.5) * 0.5 + 0.5;
          float chromeVal = wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2;

          // Palette: Deep Midnight Black, Electric Blue, Neon Pink, Violet, Metallic Chrome
          vec3 colorVoid = vec3(0.02, 0.02, 0.06);
          vec3 colorViolet = vec3(0.49, 0.36, 0.99);
          vec3 colorPink = vec3(0.93, 0.28, 0.60);
          vec3 colorBlue = vec3(0.0, 0.94, 1.0);
          vec3 colorChrome = vec3(0.95, 0.97, 1.0);

          vec3 baseColor = mix(colorVoid, colorViolet, smoothstep(0.15, 0.55, chromeVal));
          baseColor = mix(baseColor, colorPink, smoothstep(0.45, 0.75, chromeVal));
          baseColor = mix(baseColor, colorBlue, smoothstep(0.70, 0.92, chromeVal));
          baseColor = mix(baseColor, colorChrome, smoothstep(0.90, 1.0, chromeVal) * 0.4);

          // Metallic chrome sharp specular glints that react to mouse position
          vec3 light1 = normalize(vec3(-0.45 + u_mouse.x * 0.35, 0.55 + u_mouse.y * 0.35, 0.7));
          float spec1 = pow(max(0.0, dot(reflect(-light1, N), viewDir)), 36.0);
          float spec1Sharp = pow(max(0.0, dot(reflect(-light1, N), viewDir)), 160.0);

          vec3 light2 = normalize(vec3(0.55 - u_mouse.x * 0.25, -0.4 - u_mouse.y * 0.25, 0.65));
          float spec2 = pow(max(0.0, dot(reflect(-light2, N), viewDir)), 24.0);

          // Glassy Fresnel rim (iridescent Electric Blue / Neon Pink perimeter glow)
          float fresnel = pow(1.0 - max(0.0, dot(N, viewDir)), 3.2);
          vec3 rimColor = mix(colorBlue, colorPink, sin(p.y * 3.0 + t * 1.2) * 0.5 + 0.5);

          // Glass caustic inner refraction
          float innerCore = pow(max(0.0, 1.0 - r2), 1.8) * 0.5;
          vec3 innerGlow = mix(colorViolet, colorBlue, 0.4) * innerCore;

          // Composite final chrome-glass finish
          vec3 finalColor = baseColor + innerGlow;
          finalColor += rimColor * fresnel * 1.5;
          finalColor += colorPink * spec2 * 0.7;
          finalColor += colorChrome * spec1 * 0.85;
          finalColor += colorChrome * spec1Sharp * 1.4;

          // Outer anti-aliasing / edge fade
          float edgeAlpha = smoothstep(1.0, 0.97, sqrt(r2));

          gl_FragColor = vec4(finalColor, edgeAlpha);
        }
      `;

      const createShader = (type: number, src: string) => {
        const shader = gl!.createShader(type);
        if (!shader) return null;
        gl!.shaderSource(shader, src);
        gl!.compileShader(shader);
        return shader;
      };

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

      if (vs && fs) {
        const program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);
          gl.useProgram(program);

          const posBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
          );

          const posLoc = gl.getAttribLocation(program, 'position');
          gl.enableVertexAttribArray(posLoc);
          gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

          const timeLoc = gl.getUniformLocation(program, 'u_time');
          const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

          let startTime = performance.now();

          const renderGL = () => {
            if (!gl) return;
            const now = (performance.now() - startTime) * 0.001;

            // Smooth mouse interpolation (spring lerp at 60/120fps)
            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform1f(timeLoc, now);
            gl.uniform2f(mouseLoc, mx, my);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            // Apply responsive 3D tilt & translation directly to DOM elements
            if (ballWrapRef.current) {
              ballWrapRef.current.style.transform = `translate3d(${mx * 26}px, ${-my * 26}px, 0px) rotateX(${my * 25}deg) rotateY(${mx * 25}deg)`;
            }
            if (ringsWrapRef.current) {
              ringsWrapRef.current.style.transform = `translate3d(${mx * 32}px, ${-my * 32}px, 0px) rotateX(${my * 40}deg) rotateY(${mx * 40}deg)`;
            }
            if (glowWrapRef.current) {
              glowWrapRef.current.style.transform = `translate(${mx * 36}px, ${-my * 36}px) scale(${1 + (Math.abs(mx) + Math.abs(my)) * 0.05})`;
            }

            animId = requestAnimationFrame(renderGL);
          };

          renderGL();
          return () => cancelAnimationFrame(animId);
        }
      }
    }

    // 2D CANVAS FALLBACK (Smooth rotating chrome gradients & specular gloss)
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();
    const render2D = () => {
      const now = (performance.now() - startTime) * 0.001;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = w / 2 - 2;

      // Mouse lerp for 2D fallback
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      if (ballWrapRef.current) {
        ballWrapRef.current.style.transform = `translate3d(${mx * 26}px, ${-my * 26}px, 0px) rotateX(${my * 25}deg) rotateY(${mx * 25}deg)`;
      }
      if (ringsWrapRef.current) {
        ringsWrapRef.current.style.transform = `translate3d(${mx * 32}px, ${-my * 32}px, 0px) rotateX(${my * 40}deg) rotateY(${mx * 40}deg)`;
      }
      if (glowWrapRef.current) {
        glowWrapRef.current.style.transform = `translate(${mx * 36}px, ${-my * 36}px) scale(${1 + (Math.abs(mx) + Math.abs(my)) * 0.05})`;
      }

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      // Deep space base
      const bgGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r);
      bgGrad.addColorStop(0, '#160c38');
      bgGrad.addColorStop(0.5, '#0b081e');
      bgGrad.addColorStop(1, '#050410');
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Rotating chrome metallic sheen bands
      const angle = now * 0.8;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Swirling metallic streaks
      for (let i = 0; i < 4; i++) {
        const sweepGrad = ctx.createLinearGradient(-r, -r, r, r);
        sweepGrad.addColorStop(0, 'rgba(124, 92, 252, 0.4)');
        sweepGrad.addColorStop(0.3, 'rgba(232, 121, 249, 0.85)');
        sweepGrad.addColorStop(0.6, 'rgba(34, 211, 238, 0.7)');
        sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.ellipse(0, (i - 1.5) * (r * 0.35), r * 0.85, r * 0.25, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Glassy inner glow
      const innerGrad = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r);
      innerGrad.addColorStop(0, 'rgba(124, 92, 252, 0)');
      innerGrad.addColorStop(0.8, 'rgba(192, 132, 252, 0.3)');
      innerGrad.addColorStop(1, 'rgba(34, 211, 238, 0.8)');
      ctx.fillStyle = innerGrad;
      ctx.fill();

      // Dynamic specular highlight responding to mouse
      const specX = cx - r * 0.35 + mx * 18;
      const specY = cy - r * 0.35 - my * 18;
      const specGrad = ctx.createRadialGradient(specX, specY, 1, specX, specY, r * 0.45);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      specGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.6)');
      specGrad.addColorStop(0.5, 'rgba(232, 121, 249, 0.2)');
      specGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = specGrad;
      ctx.beginPath();
      ctx.ellipse(specX, specY, r * 0.4, r * 0.25, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Secondary Rim Reflection (Cyan bounce light)
      const rimGrad = ctx.createRadialGradient(cx + r * 0.35, cy + r * 0.35, 2, cx + r * 0.35, cy + r * 0.35, r * 0.35);
      rimGrad.addColorStop(0, 'rgba(34, 211, 238, 0.7)');
      rimGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(cx + r * 0.35, cy + r * 0.35, r * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Outer delicate neon border ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(232, 121, 249, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animId = requestAnimationFrame(render2D);
    };

    render2D();
    return () => cancelAnimationFrame(animId);
  }, [ballSize]);

  // Global mouse tracking across the entire website
  useEffect(() => {
    if (!interactive) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const sphereCenterX = rect.left + rect.width / 2;
      const sphereCenterY = rect.top + rect.height / 2;

      // Distance normalized across viewport
      const maxDistX = Math.max(window.innerWidth * 0.45, 300);
      const maxDistY = Math.max(window.innerHeight * 0.45, 300);

      const rawX = (e.clientX - sphereCenterX) / maxDistX;
      const rawY = -(e.clientY - sphereCenterY) / maxDistY;

      mouseRef.current.targetX = Math.max(-1.8, Math.min(1.8, rawX));
      mouseRef.current.targetY = Math.max(-1.8, Math.min(1.8, rawY));
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className={`chrome-glass-container ${className}`}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
        userSelect: 'none'
      }}
    >
      {/* ── AMBIENT NEBULA GLOW ── */}
      <div
        ref={glowWrapRef}
        style={{
          position: 'absolute',
          width: `${size * 0.85}px`,
          height: `${size * 0.85}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 92, 252, 0.35) 0%, rgba(236, 72, 153, 0.22) 40%, rgba(0, 240, 255, 0.12) 70%, transparent 85%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
          willChange: 'transform'
        }}
      />

      {/* ── 3D ORBITAL RINGS ── */}
      {showRings && (
        <div
          ref={ringsWrapRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          {/* Orbital Ring 1: Glowing Neon Pink Ring */}
          <div
            className="orbital-ring-1"
            style={{
              position: 'absolute',
              width: `${size * 0.94}px`,
              height: `${size * 0.38}px`,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTop: '2.5px solid #ec4899',
              borderBottom: '2px solid rgba(236, 72, 153, 0.45)',
              transform: 'rotateZ(-28deg) rotateX(68deg)',
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.75), inset 0 0 14px rgba(236, 72, 153, 0.35)',
              animation: 'spinRing1 14s linear infinite'
            }}
          >
            {/* Satellite gem particle 1 */}
            <div
              style={{
                position: 'absolute',
                top: '-5px',
                left: '25%',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 12px #ec4899, 0 0 22px #ec4899'
              }}
            />
          </div>

          {/* Orbital Ring 2: Glowing Electric Blue Ring */}
          <div
            className="orbital-ring-2"
            style={{
              position: 'absolute',
              width: `${size * 0.84}px`,
              height: `${size * 0.32}px`,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTop: '2.5px solid #00f0ff',
              borderBottom: '1.5px solid rgba(0, 240, 255, 0.4)',
              transform: 'rotateZ(42deg) rotateX(64deg)',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.8), inset 0 0 14px rgba(0, 240, 255, 0.3)',
              animation: 'spinRing2 11s linear infinite reverse'
            }}
          >
            {/* Satellite gem particle 2 */}
            <div
              style={{
                position: 'absolute',
                bottom: '-5px',
                right: '25%',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 12px #00f0ff, 0 0 20px #00f0ff'
              }}
            />
          </div>

          {/* Orbital Ring 3: Inner Metallic Chrome & Violet Ring */}
          <div
            style={{
              position: 'absolute',
              width: `${size * 0.66}px`,
              height: `${size * 0.25}px`,
              borderRadius: '50%',
              border: '1.5px solid rgba(226, 232, 240, 0.55)',
              borderRight: '2px solid #7c5cfc',
              borderLeft: '1.5px solid rgba(0, 240, 255, 0.8)',
              transform: 'rotateZ(-65deg) rotateX(72deg)',
              boxShadow: '0 0 16px rgba(124, 92, 252, 0.6)',
              animation: 'spinRing3 20s linear infinite'
            }}
          />
        </div>
      )}

      {/* ── THE CHROME GLASS BALL (Canvas + Decoupled Float & Parallax) ── */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          animation: 'floatOrb 5s ease-in-out infinite alternate'
        }}
      >
        <div
          ref={ballWrapRef}
          style={{
            position: 'relative',
            width: `${ballSize}px`,
            height: `${ballSize}px`,
            borderRadius: '50%',
            boxShadow: `
              0 0 ${ballSize * 0.25}px rgba(124, 92, 252, 0.5),
              0 0 ${ballSize * 0.5}px rgba(232, 121, 249, 0.3),
              inset 0 0 ${ballSize * 0.2}px rgba(34, 211, 238, 0.2)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          <canvas
            ref={canvasRef}
            width={ballSize * 2}
            height={ballSize * 2}
            style={{
              width: `${ballSize}px`,
              height: `${ballSize}px`,
              borderRadius: '50%',
              display: 'block'
            }}
          />

          {/* Extra glass sheen reflection overlay */}
          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: '12%',
              width: '40%',
              height: '24%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 80%)',
              transform: 'rotate(-25deg)',
              filter: 'blur(1px)',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>

      {/* ── COSMIC SPARKLES & LENS FLARES ── */}
      {showSparkles && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
          {/* Star Flare 1 */}
          <div
            style={{
              position: 'absolute',
              top: '16%',
              right: '22%',
              width: '16px',
              height: '16px',
              animation: 'twinkle 3.2s ease-in-out infinite'
            }}
          >
            <div style={{ position: 'absolute', top: '7px', left: 0, right: 0, height: '2px', background: '#ffffff', boxShadow: '0 0 8px #e879f9' }} />
            <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', background: '#ffffff', boxShadow: '0 0 8px #e879f9' }} />
          </div>

          {/* Star Flare 2 */}
          <div
            style={{
              position: 'absolute',
              bottom: '22%',
              left: '18%',
              width: '14px',
              height: '14px',
              animation: 'twinkle 4s ease-in-out infinite 1.2s'
            }}
          >
            <div style={{ position: 'absolute', top: '6px', left: 0, right: 0, height: '2px', background: '#ffffff', boxShadow: '0 0 8px #22d3ee' }} />
            <div style={{ position: 'absolute', left: '6px', top: 0, bottom: 0, width: '2px', background: '#ffffff', boxShadow: '0 0 8px #22d3ee' }} />
          </div>

          {/* Star Flare 3 */}
          <div
            style={{
              position: 'absolute',
              top: '32%',
              left: '26%',
              width: '10px',
              height: '10px',
              animation: 'twinkle 2.8s ease-in-out infinite 0.6s'
            }}
          >
            <div style={{ position: 'absolute', top: '4px', left: 0, right: 0, height: '2px', background: '#ffffff', boxShadow: '0 0 6px #7c5cfc' }} />
            <div style={{ position: 'absolute', left: '4px', top: 0, bottom: 0, width: '2px', background: '#ffffff', boxShadow: '0 0 6px #7c5cfc' }} />
          </div>

          {/* Floating light orbs */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '12%',
              width: '18px',
              height: '9px',
              borderRadius: '50%',
              background: 'linear-gradient(90deg, rgba(232, 121, 249, 0.6), rgba(0, 240, 255, 0.2))',
              transform: 'rotate(-35deg)',
              filter: 'blur(0.5px)',
              animation: 'drift1 5s ease-in-out infinite alternate'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '18%',
              right: '14%',
              width: '22px',
              height: '11px',
              borderRadius: '50%',
              background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.5), rgba(124, 92, 252, 0.2))',
              transform: 'rotate(45deg)',
              filter: 'blur(0.5px)',
              animation: 'drift2 6s ease-in-out infinite alternate'
            }}
          />
        </div>
      )}

      {/* ── CSS KEYFRAMES ── */}
      <style>{`
        @keyframes floatOrb {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }
        @keyframes spinRing1 {
          0% { transform: rotateZ(-28deg) rotateX(68deg) rotateY(0deg); }
          100% { transform: rotateZ(-28deg) rotateX(68deg) rotateY(360deg); }
        }
        @keyframes spinRing2 {
          0% { transform: rotateZ(42deg) rotateX(64deg) rotateY(0deg); }
          100% { transform: rotateZ(42deg) rotateX(64deg) rotateY(360deg); }
        }
        @keyframes spinRing3 {
          0% { transform: rotateZ(-65deg) rotateX(72deg) rotateY(0deg); }
          100% { transform: rotateZ(-65deg) rotateX(72deg) rotateY(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes drift1 {
          0% { transform: translate(0, 0) rotate(-35deg); }
          100% { transform: translate(6px, -10px) rotate(-25deg); }
        }
        @keyframes drift2 {
          0% { transform: translate(0, 0) rotate(45deg); }
          100% { transform: translate(-8px, -8px) rotate(55deg); }
        }
      `}</style>
    </div>
  );
};
