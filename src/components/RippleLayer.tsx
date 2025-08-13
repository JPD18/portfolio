import { useEffect, useRef } from 'react'

type RippleLayerProps = {
  /** CSS z-index; place between background and content by default */
  zIndex?: number
  /** CSS mix-blend-mode for the canvas to blend with page */
  mixBlendMode?: React.CSSProperties['mixBlendMode']
  /** Overall canvas opacity */
  opacity?: number
  /** Maximum simultaneous ripples tracked */
  maxRipples?: number
  /** Base ripple color (alpha is controlled separately) */
  color?: { r: number; g: number; b: number }
  /** Peak alpha for a single ripple (0..1) */
  rippleAlpha?: number
  /** How fast ripples expand (pixels per second) */
  speed?: number
  /** Spatial ripple frequency (larger -> more rings) */
  frequency?: number
  /** Temporal damping factor (larger -> faster fade) */
  damping?: number
  /** Limit effect radius in pixels; 0 = infinite falloff */
  maxRadius?: number
}

/**
 * Fullscreen, pointer-events-none translucent ripples around the cursor.
 * Lightweight single-pass WebGL shader, no heavy fluid simulation.
 */
export default function RippleLayer({
  zIndex = 20,
  mixBlendMode = 'screen',
  opacity = 0.5,
  maxRipples = 8,
  color = { r: 1.0, g: 1.0, b: 1.0 },
  rippleAlpha = 0.25,
  speed = 600,
  frequency = 0.045,
  damping = 2.2,
  maxRadius = 400,
}: RippleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    // Setup GL state
    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Fullscreen triangle (2D)
    const vertices = new Float32Array([
      -1, -1,
      3, -1,
      -1, 3,
    ])
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const vertSrc = `
      attribute vec2 aPos;
      void main() {
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `

    const fragSrc = `
      precision highp float;

      const int MAX_RIPPLES = ${Math.max(1, Math.min(16, maxRipples))};

      uniform vec2 uResolution;
      uniform float uTime;
      uniform int uCount;
      uniform vec2 uCenters[MAX_RIPPLES];
      uniform float uStartTimes[MAX_RIPPLES];
      uniform vec3 uColor;
      uniform float uAlpha;
      uniform float uSpeed;      // px/sec
      uniform float uFreq;       // ring frequency
      uniform float uDamping;    // fade factor
      uniform float uMaxRadius;  // limit radius (<=0 => infinite)

      // Return ripple intensity for a single event
      float ripple(vec2 uv, vec2 center, float t0) {
        float t = max(0.0, uTime - t0);
        float r = length(uv - center);
        float R = t * uSpeed; // current wavefront radius (pixels)

        if (uMaxRadius > 0.0 && r > uMaxRadius + 40.0) return 0.0;

        // Sinusoidal rings traveling outward around R
        float k = uFreq;                 // spatial frequency
        float phase = (r - R) * k;       // wave phase
        float rings = 0.5 + 0.5 * sin(phase);

        // Localized Gaussian envelope around the wavefront
        float envelope = exp(-pow((r - R) / 38.0, 2.0));

        // Temporal damping
        float fade = exp(-uDamping * t);

        // Slight inner falloff to avoid hard core
        float inner = 1.0 - smoothstep(0.0, 28.0, r);

        return rings * envelope * fade * inner;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy; // pixel space
        float acc = 0.0;
        for (int i = 0; i < MAX_RIPPLES; i++) {
          if (i >= uCount) break;
          acc += ripple(uv, uCenters[i], uStartTimes[i]);
        }
        float a = clamp(acc * uAlpha, 0.0, 1.0);
        gl_FragColor = vec4(uColor, a);
      }
    `

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.error(gl.getShaderInfoLog(s))
      }
      return s
    }
    const vs = compile(gl.VERTEX_SHADER, vertSrc)
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // eslint-disable-next-line no-console
      console.error(gl.getProgramInfoLog(prog))
    }
    gl.useProgram(prog)

    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(prog, 'uResolution')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uCount = gl.getUniformLocation(prog, 'uCount')
    const uCenters = gl.getUniformLocation(prog, 'uCenters[0]')
    const uStartTimes = gl.getUniformLocation(prog, 'uStartTimes[0]')
    const uColor = gl.getUniformLocation(prog, 'uColor')
    const uAlpha = gl.getUniformLocation(prog, 'uAlpha')
    const uSpeed = gl.getUniformLocation(prog, 'uSpeed')
    const uFreq = gl.getUniformLocation(prog, 'uFreq')
    const uDamping = gl.getUniformLocation(prog, 'uDamping')
    const uMaxRadius = gl.getUniformLocation(prog, 'uMaxRadius')

    // Parameters
    gl.uniform3f(uColor, color.r, color.g, color.b)
    gl.uniform1f(uAlpha, rippleAlpha)
    gl.uniform1f(uSpeed, speed)
    gl.uniform1f(uFreq, frequency)
    gl.uniform1f(uDamping, damping)
    gl.uniform1f(uMaxRadius, maxRadius)

    const rippleCenters = new Float32Array(maxRipples * 2)
    const rippleStarts = new Float32Array(maxRipples)
    let rippleCount = 0

    const pushRipple = (x: number, y: number, t: number) => {
      // Shift older ripples back to make room at index 0
      if (rippleCount < maxRipples) {
        rippleCount++
      }
      for (let i = rippleCount - 1; i > 0; i--) {
        rippleCenters[i * 2] = rippleCenters[(i - 1) * 2]
        rippleCenters[i * 2 + 1] = rippleCenters[(i - 1) * 2 + 1]
        rippleStarts[i] = rippleStarts[i - 1]
      }
      rippleCenters[0] = x
      rippleCenters[1] = y
      rippleStarts[0] = t
    }

    const updateCanvasSize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const w = Math.floor(window.innerWidth * dpr)
      const h = Math.floor(window.innerHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
        gl.uniform2f(uResolution, w, h)
      }
    }

    updateCanvasSize()
    const onResize = () => updateCanvasSize()
    window.addEventListener('resize', onResize)

    let startMs = performance.now()
    let raf = 0
    const frame = (now: number) => {
      const t = (now - startMs) / 1000
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(uTime, t)
      gl.uniform1i(uCount, rippleCount)
      gl.uniform2fv(uCenters, rippleCenters)
      gl.uniform1fv(uStartTimes, rippleStarts)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const handleMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const x = (clientX - rect.left) * dpr
      const y = (clientY - rect.top) * dpr
      const t = (performance.now() - startMs) / 1000
      pushRipple(x, canvas.height - y, t) // flip Y to GL coords
    }

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      gl.deleteBuffer(vbo)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteProgram(prog)
    }
  }, [color.b, color.g, color.r, damping, frequency, maxRadius, maxRipples, rippleAlpha, speed])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        pointerEvents: 'none',
        mixBlendMode,
        opacity,
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}


