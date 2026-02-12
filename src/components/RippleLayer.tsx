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
uniform bool uMouseInteraction;
uniform float uMouseActiveFactor;

varying vec2 vUv;

// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  // Normalize UVs to preserve aspect ratio
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vUv;
  uv.x *= aspect;
  
  // Normalize Mouse
  vec2 mouse = uMouse;
  mouse.x *= aspect;
  
  float time = uTime * uSpeed * 0.2;
  
  // 1. Fluid Base Layer (Domain Warping)
  // We distort the coordinate 'q' with noise to get 'r', then use 'r' to get final noise
  vec2 q = vec2(
    snoise(vec3(uv * 1.5, time)),
    snoise(vec3(uv * 1.5 + 43.0, time))
  );
  
  vec2 r = vec2(
    snoise(vec3(uv * 2.0 + 3.0 * q, time)),
    snoise(vec3(uv * 2.0 + 3.0 * q + 23.0, time))
  );
  
  // Final noise value determines the "height" or "density" of the liquid
  float f = snoise(vec3(uv * 2.0 + 4.0 * r, time));
  
  // 2. Mouse Interaction (Liquid Disturbance)
  float mouseDist = length(uv - mouse);
  // Soft, wide glow that pushes the liquid
  float mouseInfluence = smoothstep(0.6, 0.0, mouseDist) * uMouseActiveFactor;
  
  // Add mouse influence to the noise field
  f += mouseInfluence * 0.8;
  
  // 3. Coloring (Cosmic Liquid)
  // We want a subtle, seamless look.
  // Use the noise value 'f' to mix colors.
  
  // Map f (-1 to 1) to (0 to 1)
  f = f * 0.5 + 0.5;
  
  // Colors
  vec3 deepSpace = vec3(0.05, 0.05, 0.15); // Almost transparent dark
  vec3 cosmicPurple = vec3(0.4, 0.1, 0.7);
  vec3 electricBlue = vec3(0.1, 0.5, 0.9);
  
  // Mix based on noise 'height'
  vec3 col = mix(deepSpace, cosmicPurple, smoothstep(0.2, 0.7, f));
  col = mix(col, electricBlue, smoothstep(0.6, 1.0, f));
  
  // Add a "glint" or "highlight" where the liquid is highest
  float highlight = smoothstep(0.9, 1.0, f);
  col += vec3(1.0) * highlight * 0.15;
  
  // Mouse highlight (extra brightness around mouse)
  col += vec3(0.6, 0.8, 1.0) * mouseInfluence * 0.15;
  
  // Final Alpha
  // We want it to be subtle.
  // Areas with low noise value should be very transparent.
  float alpha = smoothstep(0.3, 0.9, f) * uIntensity;
  
  // Enhance alpha near mouse
  alpha += mouseInfluence * 0.15 * uIntensity;
  
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`;

interface RippleLayerProps {
  speed?: number;
  intensity?: number;
  mouseInteraction?: boolean;
  className?: string;
  zIndex?: number;
  mixBlendMode?: string;
  opacity?: number;
  [key: string]: any;
}

export default function RippleLayer({
  speed = 1.0,
  intensity = 0.4, // Reduced default intensity for subtlety
  mouseInteraction = true,
  className = "",
  zIndex,
  mixBlendMode,
  opacity = 0.6, // Lower default opacity
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
        uMouseInteraction: { value: mouseInteraction },
        uMouseActiveFactor: { value: 0.0 },
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
      // Flip Y for shader coordinate system (0 at bottom) vs DOM (0 at top) if needed, 
      // but usually for full screen effects 1-y is handled in shader or event listener.
      // In the listener we did 1.0 - y, so here we pass as is.
      program.uniforms.uMouse.value[1] = smoothMousePos.current.y;
      program.uniforms.uMouseActiveFactor.value = smoothMouseActive.current;

      renderer.render({ scene: mesh });
    }
    
    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      // In OGL/GLSL, (0,0) is bottom-left. In DOM, (0,0) is top-left.
      // We flip Y here to match GLSL.
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMousePos.current = { x, y };
      targetMouseActive.current = 1.0;
    }

    function handleMouseLeave() {
      targetMouseActive.current = 0.0;
    }

    if (mouseInteraction) {
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
  }, [speed, intensity, mouseInteraction]);

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
