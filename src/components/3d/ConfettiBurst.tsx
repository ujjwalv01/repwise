'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';

const NEON_COLORS = [0x00d4ff, 0x39ff14, 0xff4d6d, 0xa855f7, 0xffb800, 0xff6b35];

export default function ConfettiBurst() {
  const { showConfetti } = useAppStore();
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!showConfetti || !mountRef.current) return;
    const el = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 500 instanced confetti pieces
    const COUNT = 500;
    const geo = new THREE.PlaneGeometry(0.2, 0.1);
    const meshes: { mesh: THREE.Mesh; vel: THREE.Vector3; rot: THREE.Vector3; color: number }[] = [];

    for (let i = 0; i < COUNT; i++) {
      const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
      const m = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 1 });
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 4);
      scene.add(mesh);
      meshes.push({
        mesh,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          Math.random() * 0.5 + 0.2,
          (Math.random() - 0.5) * 0.2
        ),
        rot: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
        color,
      });
    }

    const GRAVITY = -0.012;

    const animate = () => {
      animRef.current = requestAnimationFrame(animate);

      meshes.forEach(({ mesh, vel, rot }) => {
        vel.y += GRAVITY;
        mesh.position.add(vel);
        mesh.rotation.x += rot.x;
        mesh.rotation.y += rot.y;
        mesh.rotation.z += rot.z;
        // Fade out as they fall
        const m = mesh.material as THREE.MeshBasicMaterial;
        if (mesh.position.y < -12) m.opacity = Math.max(0, m.opacity - 0.05);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Auto destroy after 3.5s
    const timer = setTimeout(() => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    }, 3500);

    return () => {
      clearTimeout(timer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [showConfetti]);

  if (!showConfetti) return null;

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    />
  );
}
