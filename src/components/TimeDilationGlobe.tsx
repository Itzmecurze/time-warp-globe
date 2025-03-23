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
  const millerWavesRef = useRef<THREE.Mesh[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const textureLoader = new THREE.TextureLoader();

  // Preload textures
  useEffect(() => {
    const texturePaths = [
      '/earth-map.jpg', 
      '/earth-normal.jpg',
      '/earth-specular.jpg',
      '/earth-clouds.png',
      '/earth-night.jpg',
      '/miller-map.jpg',
    ];
    
    let loadedCount = 0;
    
    texturePaths.forEach(path => {
      textureLoader.load(path, 
        () => {
          loadedCount++;
          if (loadedCount === texturePaths.length) {
            setTexturesLoaded(true);
          }
        },
        undefined,
        (err) => {
          console.error(`Error loading texture ${path}:`, err);
          // Continue even if some textures fail to load
          loadedCount++;
          if (loadedCount === texturePaths.length) {
            setTexturesLoaded(true);
          }
        }
      );
    });
  }, []);

  useEffect(() => {
    // Don't initialize if the container isn't ready
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000511');

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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
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

    // Create Earth with realistic textures
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Try to load textures but use fallbacks if they fail
    try {
      // Check if the textures have been loaded
      const earthMap = textureLoader.load('/earth-map.jpg', undefined, undefined, 
        () => console.error("Couldn't load earth-map.jpg, using default color"));
      const earthNormalMap = textureLoader.load('/earth-normal.jpg', undefined, undefined, 
        () => console.error("Couldn't load earth-normal.jpg, using default normal"));
      const earthSpecularMap = textureLoader.load('/earth-specular.jpg', undefined, undefined, 
        () => console.error("Couldn't load earth-specular.jpg, using default specular"));
      const earthCloudsMap = textureLoader.load('/earth-clouds.png', undefined, undefined, 
        () => console.error("Couldn't load earth-clouds.png, using default clouds"));
      const earthNightMap = textureLoader.load('/earth-night.jpg', undefined, undefined, 
        () => console.error("Couldn't load earth-night.jpg, using default night"));
      
      // Earth main sphere - oceans and base
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthMap,
        normalMap: earthNormalMap,
        specularMap: earthSpecularMap,
        shininess: 15,
        specular: new THREE.Color(0x333333)
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earthGroup.add(earth);
      
      // Earth clouds layer
      const earthCloudsGeometry = new THREE.SphereGeometry(1.005, 64, 64);
      const earthCloudsMaterial = new THREE.MeshPhongMaterial({
        map: earthCloudsMap,
        transparent: true,
        opacity: 0.4
      });
      const earthClouds = new THREE.Mesh(earthCloudsGeometry, earthCloudsMaterial);
      earthGroup.add(earthClouds);
      
      // Earth atmosphere glow
      const earthAtmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
      const earthAtmosphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x0EA5E9,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
      });
      const earthAtmosphere = new THREE.Mesh(earthAtmosphereGeometry, earthAtmosphereMaterial);
      earthGroup.add(earthAtmosphere);
      
    } catch (error) {
      console.error("Error setting up Earth textures:", error);
      
      // Fallback to simple spheres if texture loading fails
      const earthMaterial = new THREE.MeshStandardMaterial({
        color: 0x2E4784,
        roughness: 0.7,
        metalness: 0.1
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earthGroup.add(earth);
      
      // Earth continents fallback
      const earthContinentsGeometry = new THREE.SphereGeometry(1.001, 64, 64);
      const earthContinentsMaterial = new THREE.MeshStandardMaterial({
        color: 0x5A8C5A,
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9
      });
      const earthContinents = new THREE.Mesh(earthContinentsGeometry, earthContinentsMaterial);
      earthGroup.add(earthContinents);
      
      // Earth atmosphere fallback
      const earthAtmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
      const earthAtmosphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x8ab5eb,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
      });
      const earthAtmosphere = new THREE.Mesh(earthAtmosphereGeometry, earthAtmosphereMaterial);
      earthGroup.add(earthAtmosphere);
    }

    // Create Miller planet with realistic water world appearance as in the film
    const millerGeometry = new THREE.SphereGeometry(1, 64, 64);
    
    try {
      // Load Miller planet texture
      const millerMap = textureLoader.load('/miller-map.jpg', undefined, undefined, 
        () => console.error("Couldn't load miller-map.jpg, using default color"));
      
      // Miller base material - shallow blue ocean world with sandy bottom
      const millerMaterial = new THREE.MeshPhongMaterial({
        map: millerMap,
        color: 0x70A0C0, // Lighter blue for shallow water
        specular: new THREE.Color(0xFFFFFF),
        shininess: 100,
      });
      const miller = new THREE.Mesh(millerGeometry, millerMaterial);
      millerGroup.add(miller);
      
      // Miller water surface - shallow, clear water
      const millerWaterGeometry = new THREE.SphereGeometry(1.01, 64, 64);
      const millerWaterMaterial = new THREE.MeshPhongMaterial({
        color: 0x88B0D0, // Light blue for shallow water
        transparent: true,
        opacity: 0.65,
        specular: new THREE.Color(0xFFFFFF),
        shininess: 120,
      });
      const millerWater = new THREE.Mesh(millerWaterGeometry, millerWaterMaterial);
      millerGroup.add(millerWater);
      
      // Create multiple massive wave formations as seen in the movie
      const createWave = (height: number, width: number, position: THREE.Vector3, rotation: THREE.Euler) => {
        // Create wave geometry - use box for the massive, wall-like waves from the film
        const waveGeometry = new THREE.BoxGeometry(width, height, 0.1);
        const waveMaterial = new THREE.MeshPhongMaterial({
          color: 0xA0C0D5,
          transparent: true,
          opacity: 0.9,
          specular: new THREE.Color(0xFFFFFF),
          shininess: 80,
        });
        
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.position.copy(position);
        wave.rotation.copy(rotation);
        millerGroup.add(wave);
        return wave;
      };
      
      // Create the massive wall-like waves as seen in the film
      const waves = [];
      
      // Massive primary wave in the distance (the iconic one from the film)
      const primaryWave = createWave(
        2.5, // Tall height
        4, // Wide width
        new THREE.Vector3(0, 0, -2), // In the distance
        new THREE.Euler(0, 0, 0)
      );
      waves.push(primaryWave);
      
      // Second approaching wave
      const secondaryWave = createWave(
        2, // Slightly smaller
        3.5, 
        new THREE.Vector3(1.5, 0, -1.5), // Different position
        new THREE.Euler(0, Math.PI * 0.2, 0)
      );
      waves.push(secondaryWave);
      
      // Small foreground waves
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const smallWave = createWave(
          0.2 + Math.random() * 0.2, // Small height
          0.8 + Math.random() * 0.4,
          new THREE.Vector3(
            Math.cos(angle) * 1.1,
            -0.9, // Near the bottom of the planet
            Math.sin(angle) * 1.1
          ),
          new THREE.Euler(Math.PI * 0.4, angle, 0)
        );
        waves.push(smallWave);
      }
      
      // Store waves for animation
      millerWavesRef.current = waves;
      
      // Miller atmosphere - thin and misty
      const millerAtmosphereGeometry = new THREE.SphereGeometry(1.15, 64, 64);
      const millerAtmosphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xC8D8E8, // Light bluish-white mist
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
      });
      const millerAtmosphere = new THREE.Mesh(millerAtmosphereGeometry, millerAtmosphereMaterial);
      millerGroup.add(millerAtmosphere);
      
    } catch (error) {
      console.error("Error setting up Miller textures:", error);
      
      // Fallback Miller planet
      const millerMaterial = new THREE.MeshStandardMaterial({
        color: 0x2E5D84,
        roughness: 0.5,
        metalness: 0.3
      });
      const miller = new THREE.Mesh(millerGeometry, millerMaterial);
      millerGroup.add(miller);
      
      // Miller surface fallback
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
      
      // Miller atmosphere/water fallback
      const millerAtmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
      const millerAtmosphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x7CAFD6,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      });
      const millerAtmosphere = new THREE.Mesh(millerAtmosphereGeometry, millerAtmosphereMaterial);
      millerGroup.add(millerAtmosphere);
    }

    // Create glow effect for black hole (which affects Miller)
    const blackHoleLight = new THREE.PointLight(0x5290F2, 7, 15);
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
        
        // Find and rotate Earth clouds separately
        const clouds = earthGroupRef.current.children.find(child => 
          child instanceof THREE.Mesh && 
          child.geometry instanceof THREE.SphereGeometry && 
          child.geometry.parameters.radius === 1.005
        );
        if (clouds) {
          clouds.rotation.y += 0.0005; // Clouds rotate slightly differently than the planet
        }
      }
      
      // Rotate Miller slower (time dilation effect)
      if (millerGroupRef.current) {
        millerGroupRef.current.rotation.y += 0.0005;
      }
      
      // Animate the massive waves
      if (millerWavesRef.current.length > 0) {
        const time = Date.now() * 0.001;
        
        // Primary massive wave - slowly approaching
        if (millerWavesRef.current[0]) {
          const primaryWave = millerWavesRef.current[0];
          // Simulate the wave moving
          primaryWave.position.z = -2 + Math.sin(time * 0.1) * 0.2;
          // Slight rotation and bobbing
          primaryWave.rotation.z = Math.sin(time * 0.2) * 0.03;
        }
        
        // Secondary wave
        if (millerWavesRef.current[1]) {
          const secondaryWave = millerWavesRef.current[1];
          secondaryWave.position.z = -1.5 + Math.sin(time * 0.15 + 1) * 0.15;
          secondaryWave.rotation.z = Math.sin(time * 0.25 + 2) * 0.02;
        }
        
        // Small waves - more dynamic movement
        for (let i = 2; i < millerWavesRef.current.length; i++) {
          const wave = millerWavesRef.current[i];
          if (wave) {
            // More rapid and varied movement for small waves
            wave.position.y = -0.9 + Math.sin(time * 0.8 + i) * 0.05;
            wave.rotation.x = Math.PI * 0.4 + Math.sin(time * 1.2 + i * 2) * 0.1;
          }
        }
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
  }, [texturesLoaded]);

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
