import { useEffect, useRef } from 'react';

// A cheap, self-contained WebGL layer: one fullscreen triangle running a
// handful of travelling sines. It sits underneath LiquidEther and paints the
// "resting" state of the background, so the page isn't flat black while the
// cursor flow is idle. Raw WebGL rather than three.js — it's a few lines of GPU
// work and doesn't need a scene graph.

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  uResolution;
uniform float uTime;
uniform vec3  uColor;         // monotone tint — the waves only vary in value
uniform float uPeak;          // luminance at a wave crest
uniform float uFloor;         // luminance in a trough
uniform float uContrast;      // >1 pushes mid-tones dark, <1 lifts them
uniform float uCenterDim;     // how much to calm the middle, behind the card
uniform float uDitherScale;   // size of one dither cell, in canvas pixels
uniform float uDitherLevels;  // quantisation steps
uniform float uDitherAmount;  // 0 = hard banding, 1 = full ordered dither

// Ordered 8x8 Bayer threshold built from nested 2x2 matrices, so there's no
// lookup texture to allocate. Returns [0,1).
float bayer2(vec2 a) { a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(a * 0.5) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(a * 0.5) * 0.25 + bayer2(a); }

// Travelling sines summed into a smooth scalar field in roughly [-1,1]. The
// rates are deliberately incommensurate so the pattern doesn't visibly loop.
float waves(vec2 p, float t) {
  float v = sin(p.x * 1.9 + t * 0.38);
  v += sin(p.y * 2.3 - t * 0.31);
  v += sin((p.x + p.y) * 1.3 + t * 0.23);
  v += sin(length(p - vec2(0.55, 0.30)) * 3.1 - t * 0.49);
  return v * 0.25;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  // Aspect-correct so the bands don't stretch into stripes on wide screens.
  vec2 p = vec2(uv.x * (uResolution.x / uResolution.y), uv.y);
  float t = uTime;

  // Domain warp: feed the field through itself so the bands fold and drift
  // instead of marching past in straight lines.
  vec2 q = p + 0.45 * vec2(waves(p * 1.3 + 3.1, t), waves(p * 1.1 - 2.7, t * 1.2));
  float f = waves(q * 1.7, t * 0.8);

  float v = pow(clamp(0.5 + 0.5 * f, 0.0, 1.0), uContrast);

  // Dither the *field* rather than the final colour: quantising 0..1 here keeps
  // the steps evenly spaced no matter how dark the palette is, and the Bayer
  // offset breaks each step edge into a stipple instead of a hard contour.
  float levels = max(uDitherLevels, 1.0);
  float threshold = bayer8(gl_FragCoord.xy / max(uDitherScale, 1.0)) - 0.5;
  v = clamp(v + threshold * uDitherAmount / levels, 0.0, 1.0);
  v = floor(v * levels + 0.5) / levels;

  // Calm the centre so the card's text keeps its contrast.
  float edge = smoothstep(0.0, 0.55, length(uv - 0.5));
  float lum = mix(uFloor, uPeak, v) * mix(1.0 - uCenterDim, 1.0, edge);

  gl_FragColor = vec4(uColor * lum, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`WavyBackdrop shader failed to compile: ${log}`);
  }
  return shader;
}

type Props = {
  /** Base tint. Greyscale by default — "monotone" means value-only variation. */
  color?: [number, number, number];
  peak?: number;
  floor?: number;
  contrast?: number;
  centerDim?: number;
  ditherScale?: number;
  ditherLevels?: number;
  ditherAmount?: number;
  speed?: number;
  /** Mirrors LiquidEther's perf knobs so both layers share a pixel grid. */
  maxFps?: number;
  maxPixelRatio?: number;
  className?: string;
};

export default function WavyBackdrop({
  color = [0.4, 0.4, 0.4],
  peak = 0.24,
  floor = 0.015,
  // Near 1 so the field maps to brightness roughly as-is. The old 1.7 crushed
  // most of the screen into the bottom band, where quantisation rounded it to
  // flat black and the waves in the dark half never showed at all.
  contrast = 1.15,
  centerDim = 2.4,
  ditherScale = 2,
  ditherLevels = 9,
  ditherAmount = 4,
  speed = 3,
  maxFps = 30,
  maxPixelRatio = 1,
  className = ''
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Object/array props are compared by identity, so hold them in refs and read
  // them at setup time rather than listing them as effect deps.
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // The canvas is created here rather than rendered by React so each effect
    // run owns a fresh one. Cleanup calls loseContext(), which kills a context
    // permanently — on a React-owned canvas that would leave StrictMode's
    // second mount (and any remount) drawing into a dead context.
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    mount.appendChild(canvas);

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power'
    });
    if (!gl) {
      canvas.remove();
      return;
    }

    let program: WebGLProgram;
    try {
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || 'link failed');
      }
    } catch {
      // A missing background is better than a broken page.
      canvas.remove();
      return;
    }

    gl.useProgram(program);

    // One oversized triangle covers the viewport with no index buffer.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uResolution = u('uResolution');
    const uTime = u('uTime');

    gl.uniform3fv(u('uColor'), colorRef.current);
    gl.uniform1f(u('uPeak'), peak);
    gl.uniform1f(u('uFloor'), floor);
    gl.uniform1f(u('uContrast'), contrast);
    gl.uniform1f(u('uCenterDim'), centerDim);
    gl.uniform1f(u('uDitherScale'), ditherScale);
    gl.uniform1f(u('uDitherLevels'), ditherLevels);
    gl.uniform1f(u('uDitherAmount'), ditherAmount);

    const dpr = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uResolution, w, h);
    };

    const draw = (time: number) => {
      resize();
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const frameInterval = maxFps > 0 ? 1000 / maxFps : 0;
    let raf = 0;
    let running = false;
    let elapsed = 0;
    let last = 0;
    let lastDraw = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // Our own clock, so pausing (hidden tab, scrolled away) doesn't make the
      // waves jump forward when we resume.
      elapsed += Math.min(now - last, 100) / 1000;
      last = now;
      if (frameInterval && now - lastDraw < frameInterval) return;
      lastDraw = now;
      draw(elapsed * speed);
    };

    const start = () => {
      if (running || reduceMotion.matches) return;
      running = true;
      last = performance.now();
      lastDraw = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Reduced motion still gets the shader, just held on a single frame.
    const onReduceChange = () => {
      if (reduceMotion.matches) {
        stop();
        draw(0);
      } else {
        start();
      }
    };
    reduceMotion.addEventListener('change', onReduceChange);

    const ro = new ResizeObserver(() => {
      if (!running) draw(elapsed * speed);
    });
    ro.observe(canvas);

    onReduceChange();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reduceMotion.removeEventListener('change', onReduceChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, [
    peak,
    floor,
    contrast,
    centerDim,
    ditherScale,
    ditherLevels,
    ditherAmount,
    speed,
    maxFps,
    maxPixelRatio
  ]);

  return <div ref={mountRef} aria-hidden="true" className={`h-full w-full ${className}`} />;
}
