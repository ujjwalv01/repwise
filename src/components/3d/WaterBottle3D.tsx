'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props { fillLevel: number; }

export default function WaterBottle3D({ fillLevel }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef(fillLevel);

  useEffect(() => { fillRef.current = fillLevel; }, [fillLevel]);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.clientWidth || 200;
    const H = el.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.localClippingEnabled = true;
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pt = new THREE.PointLight(0x00d4ff, 1.5);
    pt.position.set(3, 5, 5);
    scene.add(pt);

    // Bottle outer shell
    const bottleGeo = new THREE.CylinderGeometry(1.2, 1.0, 6, 32, 1, true);
    const bottleMat = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff, transparent: true, opacity: 0.12,
      roughness: 0.1, metalness: 0.1, side: THREE.FrontSide,
    });
    const bottle = new THREE.Mesh(bottleGeo, bottleMat);
    bottle.renderOrder = 3;
    scene.add(bottle);

    // Inner bottle (slightly smaller to prevent Z-fighting)
    const innerBottleGeo = new THREE.CylinderGeometry(1.19, 0.99, 6, 32, 1, true);
    const innerBottleMat = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff, transparent: true, opacity: 0.08,
      roughness: 0.1, metalness: 0.1, side: THREE.BackSide,
    });
    const innerBottle = new THREE.Mesh(innerBottleGeo, innerBottleMat);
    innerBottle.renderOrder = 0;
    scene.add(innerBottle);

    // Bottle cap
    const capGeo = new THREE.CylinderGeometry(0.7, 1.2, 0.6, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x00d4ff, roughness: 0.3 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 3.3;
    scene.add(cap);

    // Water inside (open-ended to avoid cap Z-fighting)
    const waterClipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    const waterGeo = new THREE.CylinderGeometry(1.17, 0.97, 5.9, 32, 1, true);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x00aaff, transparent: true, opacity: 0.6, roughness: 0.1,
      clippingPlanes: [waterClipPlane],
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 0.05; // Slightly offset up
    water.renderOrder = 1;
    scene.add(water);

    // Bottle bottom cap (offset down)
    const bottomGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.2, 16);
    const bottom = new THREE.Mesh(bottomGeo, capMat);
    bottom.position.y = -3.05;
    bottom.renderOrder = 2;
    scene.add(bottom);

    let currentFill = fillRef.current;
    waterClipPlane.constant = -3 + currentFill * 5.9; // Match the 5.9 height logic
    
    // Top surface of the water
    const surfaceGeo = new THREE.CircleGeometry(1.2, 32);
    const surfaceMat = new THREE.MeshPhysicalMaterial({
      color: 0x00aaff, transparent: true, opacity: 0.8, roughness: 0.1,
    });
    const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
    surface.rotation.x = -Math.PI / 2;
    surface.renderOrder = 1;
    scene.add(surface);

    // Color interp based on fill
    function updateColor(fill: number) {
      if (fill > 0.5) waterMat.color.set(0x00aaff);
      else if (fill > 0.3) waterMat.color.set(0xffaa00);
      else waterMat.color.set(0xff4444);
    }

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const targetFill = fillRef.current;
      currentFill += (targetFill - currentFill) * 0.05;
      
      const clipY = -2.95 + currentFill * 5.9;
      waterClipPlane.constant = clipY; 
      
      // Update surface position and radius
      surface.position.y = clipY;
      const lerpRadius = 0.97 + (1.17 - 0.97) * ((clipY + 2.95) / 5.9);
      surface.scale.set(lerpRadius / 1.2, lerpRadius / 1.2, 1);
      surface.visible = currentFill > 0.001 && currentFill < 1.0;

      updateColor(targetFill);

      bottle.rotation.y += 0.005;
      innerBottle.rotation.y += 0.005;
      water.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => { cancelAnimationFrame(animId); renderer.dispose(); if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement); };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
