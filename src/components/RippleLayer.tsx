import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uSpeed;
uniform float uIntensity;
uniform float uRippleCount;
uniform bool uMouseInteraction;
uniform float uMouseActiveFactor;
uniform float uFrequency;
uniform float uDamping;
uniform float uMaxRadius;

varying vec2 vUv;

float ripple(vec2 uv, vec2 center, float time, float frequency) {
  float dist = length(uv - center);
  if (uMaxRadius > 0.0 && dist > uMaxRadius * 0.01) return 0.0;
  float wave = sin(dist * frequency - time * uSpeed * 0.01);
  float falloff = 1.0 / (1.0 + dist * uDamping);
  return wave * falloff;
}

void main() {
  vec2 uv = (vUv * uResolution.xy) / min(uResolution.x, uResolution.y);
  uv -= vec2(0.5 * uResolution.x / min(uResolution.x, uResolution.y), 0.5);
  
  float ripples = 0.0;
  
  // Static ripples
  for (float i = 0.0; i < 10.0; i++) {
    if (i >= uRippleCount) break;
    vec2 center = vec2(
      sin(uTime * 0.3 + i * 2.0) * 0.3,
      cos(uTime * 0.4 + i * 1.5) * 0.3
    );
    ripples += ripple(uv, center, uTime, uFrequency * 10.0 + i * 0.5);
  }
  
  // Mouse ripple with enhanced interaction
  if (uMouseInteraction && uMouseActiveFactor > 0.0) {
    vec2 mouseUV = (uMouse * uResolution.xy) / min(uResolution.x, uResolution.y);
    mouseUV -= vec2(0.5 * uResolution.x / min(uResolution.x, uResolution.y), 0.5);
    
    // Create multiple mouse ripples at different frequencies for rich effect
    float mouseRipple1 = ripple(uv, mouseUV, uTime, uFrequency * 12.0) * uMouseActiveFactor * 1.5;
    float mouseRipple2 = ripple(uv, mouseUV, uTime * 1.3, uFrequency * 8.0) * uMouseActiveFactor * 1.0;
    
    ripples += mouseRipple1 + mouseRipple2 * 0.5;
  }
  
  ripples *= uIntensity;
  
  // Cosmic color scheme - purple and blue only
  float rippleIntensity = abs(ripples);
  
  // Create a cosmic gradient based on ripple intensity
  vec3 purple = vec3(0.5, 0.2, 0.8);   // Deep purple
  vec3 blue = vec3(0.2, 0.4, 1.0);     // Cosmic blue
  vec3 lightBlue = vec3(0.4, 0.6, 1.0); // Lighter blue for variation
  
  // Mix between purple and blues based on ripple intensity and time
  float colorPhase = sin(uTime * 0.5 + rippleIntensity * 3.0) * 0.5 + 0.5;
  vec3 color1 = mix(purple, blue, colorPhase);
  vec3 color2 = mix(blue, lightBlue, colorPhase);
  vec3 finalColor = mix(color1, color2, rippleIntensity);
  
  float alpha = rippleIntensity * 0.8;
  alpha = smoothstep(0.0, 1.0, alpha);
  gl_FragColor = vec4(finalColor, alpha);
}
`;

interface RippleLayerProps {
  speed?: number;
  intensity?: number;
  rippleCount?: number;
  mouseInteraction?: boolean;
  className?: string;
  zIndex?: number;
  mixBlendMode?: string;
  opacity?: number;
  maxRipples?: number;
  frequency?: number;
  damping?: number;
  maxRadius?: number;
}

export default function RippleLayer({
  speed = 1.0,
  intensity = 0.5,
  rippleCount = 3.0,
  mouseInteraction = true,
  className = "",
  zIndex,
  mixBlendMode,
  opacity = 1.0,
  maxRipples,
  frequency,
  damping,
  maxRadius,
  ...rest
}: RippleLayerProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });
  const smoothMousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMouseActive = useRef(0.0);
  const smoothMouseActive = useRef(0.0);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let program: Program;

    function resize() {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      }
    }
    
    window.addEventListener("resize", resize, false);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        uMouse: {
          value: new Float32Array([
            smoothMousePos.current.x,
            smoothMousePos.current.y,
          ]),
        },
        uSpeed: { value: speed },
        uIntensity: { value: intensity },
        uRippleCount: { value: maxRipples || rippleCount },
        uMouseInteraction: { value: mouseInteraction },
        uMouseActiveFactor: { value: 0.0 },
        uFrequency: { value: frequency || 0.05 },
        uDamping: { value: damping || 2.0 },
        uMaxRadius: { value: maxRadius || 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number;

    function update(t: number) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;

      const lerpFactor = 0.05;
      smoothMousePos.current.x +=
        (targetMousePos.current.x - smoothMousePos.current.x) * lerpFactor;
      smoothMousePos.current.y +=
        (targetMousePos.current.y - smoothMousePos.current.y) * lerpFactor;

      smoothMouseActive.current +=
        (targetMouseActive.current - smoothMouseActive.current) * lerpFactor;

      program.uniforms.uMouse.value[0] = smoothMousePos.current.x;
      program.uniforms.uMouse.value[1] = smoothMousePos.current.y;
      program.uniforms.uMouseActiveFactor.value = smoothMouseActive.current;

      renderer.render({ scene: mesh });
    }
    
    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMousePos.current = { x, y };
      targetMouseActive.current = 1.0;
    }

    function handleMouseLeave() {
      targetMouseActive.current = 0.0;
    }

    if (mouseInteraction) {
      // Listen on document for global mouse tracking
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
      ctn.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (mouseInteraction) {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
        ctn.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (ctn.contains(gl.canvas)) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [speed, intensity, rippleCount, mouseInteraction, maxRipples, frequency, damping, maxRadius]);

  const containerStyle: React.CSSProperties = {
    zIndex,
    mixBlendMode: mixBlendMode as any,
    opacity,
  };

  return (
    <div 
      ref={ctnDom} 
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={containerStyle}
      {...rest} 
    />
  );
}
