"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function HopeSphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Hope Sphere Mesh (Glowing wireframe icosahedron)
    const geometry = new THREE.IcosahedronGeometry(1.5, 15);
    const material = new THREE.MeshPhongMaterial({
      color: 0xE87D2E, // HHM Hope Orange
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      shininess: 100,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 5. Floating Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 350;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xE9D6CD, // Soft Cream color
      transparent: true,
      opacity: 0.7,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xE87D2E, 1.5);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // 7. Mouse tracking
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 8. Animation loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Sphere rotation
      sphere.rotation.y += 0.003;
      sphere.rotation.x += 0.001;

      // Gentle follow-the-mouse effect
      sphere.position.x += (mouseX * 0.8 - sphere.position.x) * 0.05;
      sphere.position.y += (-mouseY * 0.8 - sphere.position.y) * 0.05;

      // Particles rotation
      particlesMesh.rotation.y += 0.0008;
      particlesMesh.rotation.x += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 10. Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-transparent pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
