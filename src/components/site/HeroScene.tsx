import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import * as THREE from "three";
import { Html } from "@react-three/drei";

const NODES = [
  "Website",
  "Google",
  "WhatsApp",
  "Mobile App",
  "Online Store",
  "Ads",
  "SEO",
  "Analytics",
  "Customers",
  "Leads",
  "Sales",
];

function nodePositions(radius: number) {
  return NODES.map((label, i) => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / (NODES.length - 1)) * 1.6;
    const r = Math.sqrt(Math.max(0.05, 1 - y * y));
    const theta = golden * i;
    return {
      label,
      position: new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius * 0.75,
        Math.sin(theta) * r * radius,
      ),
    };
  });
}

function Storefront() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.3;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
    }
  });
  return (
    <group ref={ref}>
      <mesh castShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[1.5, 0.95, 1.1]} />
        <meshStandardMaterial
          color="#111a26"
          emissive="#0d2a3a"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.15, 0.5, 4]} />
        <meshStandardMaterial color="#1b2b3d" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.2, 0.57]}>
        <planeGeometry args={[1.05, 0.42]} />
        <meshBasicMaterial color="#5fd8ff" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.2, 1.4]} intensity={6} color="#5fd8ff" distance={5} />
    </group>
  );
}

function NodeCloud({ compact }: { compact: boolean }) {
  const group = useRef<Group>(null);
  const nodes = useMemo(() => nodePositions(compact ? 2.5 : 3.1), [compact]);

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.09;
    void state;
  });

  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (const node of nodes) {
      points.push(new THREE.Vector3(0, 0, 0), node.position);
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes]);

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#3ec8f0" transparent opacity={0.35} />
      </lineSegments>
      {nodes.map((node, i) => (
        <group key={node.label} position={node.position}>
          <NodeOrb index={i} />
          {!compact && (
            <Html center distanceFactor={9} zIndexRange={[10, 0]}>
              <span className="whitespace-nowrap rounded-full border border-border bg-background/80 px-2 py-1 text-[10px] tracking-wide text-foreground">
                {node.label}
              </span>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

function NodeOrb({ index }: { index: number }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.6 + index) * 0.12;
      ref.current.scale.setScalar(s);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.11, 16, 16]} />
      <meshBasicMaterial color={index % 3 === 0 ? "#b489ff" : "#5fd8ff"} toneMapped={false} />
    </mesh>
  );
}

export default function HeroScene({ compact = false }: { compact?: boolean }) {
  return (
    <Canvas
      dpr={[1, compact ? 1.3 : 1.8]}
      camera={{ position: [0, 1.1, compact ? 7.4 : 6.6], fov: 45 }}
      gl={{ antialias: !compact, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#0b1017"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#9fe8ff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.6} color="#b489ff" />
      <Suspense fallback={null}>
        <Storefront />
        <NodeCloud compact={compact} />
      </Suspense>
    </Canvas>
  );
}
