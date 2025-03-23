
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { motion } from 'framer-motion';

interface TimeDilationGlobeProps {
  earthTime: number;
  millerTime: number;
}

const TimeDilationGlobe: React.FC<TimeDilationGlobeProps> = ({ earthTime, millerTime }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const millerGroupRef = useRef<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Don't initialize if the container isn't ready
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0A0A0A');

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 8;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true
    });

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Earth Group
    const earthGroup = new THREE.Group();
    earthGroup.position.set(-2.5, 0, 0);
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    // Miller Planet Group
    const millerGroup = new THREE.Group();
    millerGroup.position.set(2.5, 0, 0);
    scene.add(millerGroup);
    millerGroupRef.current = millerGroup;

    // Earth planet
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x2E4784,
      roughness: 0.7,
      metalness: 0.1
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    // Earth continents
    const earthContinentsGeometry = new THREE.SphereGeometry(1.001, 64, 64);
    const earthContinentsMaterial = new THREE.MeshStandardMaterial({
      color: 0x5A8C5A,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
      alphaMap: new THREE.TextureLoader().load('/earth-alpha.jpg'),
    });
    
    const earthContinents = new THREE.Mesh(earthContinentsGeometry, earthContinentsMaterial);
    earthGroup.add(earthContinents);

    // Earth atmosphere
    const earthAtmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const earthAtmosphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x8ab5eb,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const earthAtmosphere = new THREE.Mesh(earthAtmosphereGeometry, earthAtmosphereMaterial);
    earthGroup.add(earthAtmosphere);

    // Miller planet
    const millerGeometry = new THREE.SphereGeometry(1, 64, 64);
    const millerMaterial = new THREE.MeshStandardMaterial({
      color: 0x2E5D84,
      roughness: 0.5,
      metalness: 0.3
    });
    const miller = new THREE.Mesh(millerGeometry, millerMaterial);
    millerGroup.add(miller);

    // Miller surface
    const millerSurfaceGeometry = new THREE.SphereGeometry(1.002, 64, 64);
    const millerSurfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x7CAFD6,
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.8
    });
    const millerSurface = new THREE.Mesh(millerSurfaceGeometry, millerSurfaceMaterial);
    millerGroup.add(millerSurface);

    // Miller atmosphere/water
    const millerAtmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const millerAtmosphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x7CAFD6,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const millerAtmosphere = new THREE.Mesh(millerAtmosphereGeometry, millerAtmosphereMaterial);
    millerGroup.add(millerAtmosphere);

    // Create glow effect for black hole (which affects Miller)
    const blackHoleLight = new THREE.PointLight(0x5290F2, 5, 10);
    blackHoleLight.position.set(5, 0, -5);
    scene.add(blackHoleLight);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    controls.enablePan = false;

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate Earth slowly
      if (earthGroupRef.current) {
        earthGroupRef.current.rotation.y += 0.002;
      }
      
      // Rotate Miller slower (time dilation effect)
      if (millerGroupRef.current) {
        millerGroupRef.current.rotation.y += 0.0005;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update rotations based on time dilation
  useEffect(() => {
    if (earthGroupRef.current && millerGroupRef.current) {
      // Adjust rotation speeds based on time dilation ratio
      const ratio = earthTime / millerTime;
      
      // Keep earth rotation constant, adjust Miller's rotation
      earthGroupRef.current.userData.rotationSpeed = 0.002;
      millerGroupRef.current.userData.rotationSpeed = 0.002 / ratio;
    }
  }, [earthTime, millerTime]);

  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-black">
          <div className="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <motion.div 
        ref={mountRef} 
        className="globe-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1 }}
      />
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-20 pointer-events-none">
        <div className="text-center">
          <div className="text-sm uppercase tracking-wider text-foreground/70">Earth</div>
        </div>
        <div className="text-center">
          <div className="text-sm uppercase tracking-wider text-foreground/70">Miller's Planet</div>
        </div>
      </div>
    </div>
  );
};

export default TimeDilationGlobe;
