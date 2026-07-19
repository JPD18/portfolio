import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

type GalaxyPoints = {
  positions: Float32Array;
  colors: Float32Array;
};

const palette = [
  new THREE.Color("#f7d7ff"),
  new THREE.Color("#a78bfa"),
  new THREE.Color("#60a5fa"),
  new THREE.Color("#fb7185"),
  new THREE.Color("#fde68a"),
];

function createGalaxy(count: number): GalaxyPoints {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const branches = 5;
  const radius = 72;
  const spin = 1.45;
  const randomness = 0.36;

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const distance = Math.pow(Math.random(), 0.58) * radius;
    const branchAngle = ((i % branches) / branches) * Math.PI * 2;
    const spinAngle = distance * spin * 0.035;
    const randomScale =
      Math.pow(1 - distance / radius, 1.8) * randomness * radius;

    const randomX = (Math.random() - 0.5) * randomScale;
    const randomY = (Math.random() - 0.5) * randomScale * 0.24;
    const randomZ = (Math.random() - 0.5) * randomScale;

    positions[i3] = Math.cos(branchAngle + spinAngle) * distance + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] =
      Math.sin(branchAngle + spinAngle) * distance + randomZ - 46;

    const mixed = palette[i % palette.length].clone();
    mixed.lerp(
      new THREE.Color("#ffffff"),
      Math.max(0, 1 - distance / radius) * 0.55,
    );
    colors[i3] = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  return { positions, colors };
}

function SpiralGalaxy() {
  const ref = useRef<THREE.Points>(null);
  const galaxy = useMemo(() => createGalaxy(7000), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.018;
    ref.current.rotation.z = Math.sin(Date.now() * 0.00008) * 0.025;
  });

  return (
    <points ref={ref} rotation={[0.18, -0.32, -0.08]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[galaxy.positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[galaxy.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.13}
        vertexColors
        transparent
        opacity={0.82}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function NebulaVeil() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.08;
    ref.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={ref} position={[0, -3, -58]} scale={[68, 18, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.16}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#7c3aed"
      />
    </mesh>
  );
}

function ProceduralPlanet({
  position,
  scale,
  color,
  ring = false,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  ring?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.08;
    ref.current.rotation.x += delta * 0.012;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[1, 40, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.72}
          metalness={0.04}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 40, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {ring && (
        <mesh rotation={[Math.PI * 0.62, 0, Math.PI * 0.08]}>
          <ringGeometry args={[1.32, 1.56, 96]} />
          <meshBasicMaterial
            color="#d8b4fe"
            transparent
            opacity={0.28}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        dpr={[0.75, 1.25]}
        frameloop="always"
        camera={{ position: [0, 0, 16], fov: 58 }}
        gl={{
          antialias: false,
          powerPreference: "low-power",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        onCreated={({ gl, scene }) => {
          gl.toneMappingExposure = 1.08;
          scene.background = new THREE.Color("#040714");
          scene.fog = new THREE.Fog("#040714", 42, 130);
        }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.45} />
        <hemisphereLight args={[0x8394ff, 0x080915, 0.55]} />
        <pointLight position={[-10, 8, 10]} intensity={28} color="#f0abfc" />

        <Suspense fallback={null}>
          <SpiralGalaxy />
          <NebulaVeil />
          <ProceduralPlanet
            position={[-18, -4, -34]}
            scale={2.2}
            color="#6d5dfc"
            ring
          />
          <ProceduralPlanet
            position={[20, 7, -52]}
            scale={1.25}
            color="#f97316"
          />
        </Suspense>

        <EffectComposer multisampling={0} resolutionScale={0.55}>
          <Bloom
            intensity={0.32}
            luminanceThreshold={0.34}
            luminanceSmoothing={0.08}
          />
          <Vignette eskil={false} offset={0.18} darkness={0.72} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
