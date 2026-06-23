"use client";

import { useEffect, useRef } from "react";

/* Full-screen WebGL shader matching the Stitch design — animated flowing
   deep-blue grid with purple accent glow. */
export function BackgroundShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 800;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    syncSize();

    const gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) return;

    const vertSrc = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    const fragSrc = `
      precision highp float;
      uniform float u_time;
      uniform vec2  u_res;
      uniform vec2  u_mouse;

      void main() {
        vec2 uv  = gl_FragCoord.xy / u_res;
        float t  = u_time * 0.18;

        // Scrolling grid
        vec2  grid = fract(uv * 40.0 - t * 0.08);
        float line = smoothstep(0.02, 0.0, abs(grid.x - 0.5))
                   + smoothstep(0.02, 0.0, abs(grid.y - 0.5));

        // Radial gradient from centre
        vec2  c    = uv - 0.5;
        c.x       *= u_res.x / u_res.y;
        float dist = length(c);
        float wave = sin(uv.x * 12.0 + t) * cos(uv.y * 12.0 - t) * 0.5 + 0.5;

        // Mouse influence
        vec2  m    = u_mouse / u_res - 0.5;
        float mDist = length(uv - 0.5 - m * 0.3);
        float mGlow = smoothstep(0.35, 0.0, mDist) * 0.15;

        // Base colours
        vec3 deepBlue  = vec3(0.039, 0.055, 0.102); // #0A0E1A
        vec3 midBlue   = vec3(0.08,  0.12,  0.22);
        vec3 purple    = vec3(0.545, 0.361, 0.965); // #8B5CF6
        vec3 cyan      = vec3(0.024, 0.714, 0.831); // #06B6D4

        vec3 base  = mix(deepBlue, midBlue, dist * wave);
        base      += purple * line * 0.08 * (1.0 - dist);
        base      += cyan   * mGlow;

        gl_FragColor = vec4(base, 1.0);
      }
    `;

    function compileShader(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width && r.height) {
        mouse = {
          x: ((e.clientX - r.left) / r.width) * canvas.width,
          y: (1 - (e.clientY - r.top) / r.height) * canvas.height,
        };
      }
    };
    window.addEventListener("mousemove", onMove);

    let rafId: number;
    function render(t: number) {
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      if (uTime)  gl!.uniform1f(uTime, t * 0.001);
      if (uRes)   gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      if (uMouse) gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    }
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full opacity-70 pointer-events-none"
      aria-hidden
    />
  );
}
