import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { motion } from 'framer-motion';

interface TimeDilationGlobeProps {
  earthTime: number;
  millerTime: number;
  planetDistance: number; // Added prop to receive distance from parent
}

const TimeDilationGlobe: React.FC<TimeDilationGlobeProps> = ({ earthTime, millerTime, planetDistance }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const millerGroupRef = useRef<THREE.Group | null>(null);
  const blackHoleRef = useRef<THREE.Mesh | null>(null);
  const enduranceRef = useRef<THREE.Group | null>(null);
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

  // Update Miller's planet position based on distance slider
  useEffect(() => {
    if (millerGroupRef.current && blackHoleRef.current) {
      // Calculate position based on distance (normalized value)
      const baseDistance = 5; // Minimum distance from black hole
      const maxDistanceAdd = 8; // Maximum additional distance
      
      // Apply distance from slider (mapped to a reasonable 3D range)
      const normalizedDistance = planetDistance / 500; // Slider max is 500
      const distanceMultiplier = baseDistance + (normalizedDistance * maxDistanceAdd);
      
      // Position Miller's planet based on the distance
      millerGroupRef.current.position.set(distanceMultiplier, 0, 0);
      
      // If Endurance exists, position it between the black hole and Miller's planet
      if (enduranceRef.current) {
        enduranceRef.current.position.set(distanceMultiplier - 1.5, 0.5, 0);
      }
    }
  }, [planetDistance]);

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
    camera.position.z = 15; // Moved camera back to see more of the scene
    camera.position.y = 5; // Slight top-down view

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
    earthGroup.position.set(-10, 0, -5); // Move Earth further to the left and back
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    // Miller Planet Group
    const millerGroup = new THREE.Group();
    millerGroup.position.set(5, 0, 0); // Initial position, will be updated by the distance effect
    scene.add(millerGroup);
    millerGroupRef.current = millerGroup;

    // Gargantua Black Hole
    const blackHoleGroup = new THREE.Group();
    blackHoleGroup.position.set(0, 0, 0);
    scene.add(blackHoleGroup);
    
    // Create Gargantua with accretion disk
    const blackHoleGeometry = new THREE.SphereGeometry(2, 64, 64);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    blackHoleGroup.add(blackHole);
    blackHoleRef.current = blackHole;
    
    // Accretion disk
    const accretionDiskGeometry = new THREE.RingGeometry(2.2, 6, 64);
    const accretionDiskMaterial = new THREE.MeshBasicMaterial({
      color: 0x5290F2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const accretionDisk = new THREE.Mesh(accretionDiskGeometry, accretionDiskMaterial);
    accretionDisk.rotation.x = Math.PI / 2; // Rotate to be flat
    blackHoleGroup.add(accretionDisk);
    
    // Add a glow effect
    const glowGeometry = new THREE.SphereGeometry(2.1, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x5290F2,
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    blackHoleGroup.add(glow);

    // Endurance Spacecraft
    const enduranceGroup = new THREE.Group();
    // Position will be updated based on Miller's position
    enduranceGroup.position.set(3.5, 0.5, 0);
    scene.add(enduranceGroup);
    enduranceRef.current = enduranceGroup;
    
    // Create stylized Endurance with a central hub and radiating arms
    const hubGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const hubMaterial = new THREE.MeshPhongMaterial({
      color: 0xCCCCCC,
      shininess: 70
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.rotation.x = Math.PI / 2; // Rotate to be flat
    enduranceGroup.add(hub);
    
    // Create the radiating arms of Endurance
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const armLength = 0.4;
      
      const armGeometry = new THREE.BoxGeometry(0.05, 0.05, armLength);
      const armMaterial = new THREE.MeshPhongMaterial({
        color: 0xAAAAAA,
        shininess: 50
      });
      const arm = new THREE.Mesh(armGeometry, armMaterial);
      
      arm.position.set(
        Math.cos(angle) * armLength / 2,
        Math.sin(angle) * armLength / 2,
        0
      );
      arm.rotation.z = angle;
      
      enduranceGroup.add(arm);
      
      // Add modules at the end of each arm
      if (i % 3 === 0) { // Only add modules to 4 arms
        const moduleGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.2);
        const moduleMaterial = new THREE.MeshPhongMaterial({
          color: 0xFFFFFF,
          shininess: 60
        });
        const module = new THREE.Mesh(moduleGeometry, moduleMaterial);
        
        module.position.set(
          Math.cos(angle) * armLength,
          Math.sin(angle) * armLength,
          0
        );
        
        enduranceGroup.add(module);
      }
    }
    
    // Scale the Endurance down to appropriate size
    enduranceGroup.scale.set(0.5, 0.5, 0.5);

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

    // Create Miller planet like in the movie - shallow ocean world with massive waves
    const millerGeometry = new THREE.SphereGeometry(1, 64, 64);
    
    try {
      // Load Miller planet texture - a water world texture
      const millerMap = textureLoader.load('/miller-map.jpg', undefined, undefined, 
        () => console.error("Couldn't load miller-map.jpg, using default color"));
      
      // Miller base material - realistic water world like in the movie
      const millerMaterial = new THREE.MeshPhongMaterial({
        map: millerMap,
        color: 0x1A5276, // Deeper blue color like in the movie
        specular: new THREE.Color(0xFFFFFF),
        shininess: 100,
      });
      const miller = new THREE.Mesh(millerGeometry, millerMaterial);
      millerGroup.add(miller);
      
      // Miller water surface - to simulate the shallow water with massive waves
      const millerWaterGeometry = new THREE.SphereGeometry(1.02, 64, 64);
      const millerWaterMaterial = new THREE.MeshPhongMaterial({
        color: 0x85C1E9, // Lighter blue for shallow water
        transparent: true,
        opacity: 0.7,
        specular: new THREE.Color(0xFFFFFF),
        shininess: 100,
      });
      const millerWater = new THREE.Mesh(millerWaterGeometry, millerWaterMaterial);
      millerGroup.add(millerWater);
      
      // Animated massive waves for Miller planet - like in the movie
      const waveCount = 6; // Number of wave rings
      const waveHeight = 0.2; // Height of waves
      
      for (let i = 0; i < waveCount; i++) {
        const waveDistance = 1.05 + (i * 0.05); // Increasing distance from planet
        const waveGeometry = new THREE.TorusGeometry(waveDistance, 0.02, 16, 100);
        const waveMaterial = new THREE.MeshPhongMaterial({
          color: 0xAED6F1,
          transparent: true,
          opacity: 0.6 - (i * 0.1),
          shininess: 90,
        });
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        
        // Randomly rotate each wave ring
        wave.rotation.x = Math.random() * Math.PI;
        wave.rotation.y = Math.random() * Math.PI;
        
        // Store initial rotation for animation
        wave.userData = {
          initialRotation: {
            x: wave.rotation.x,
            y: wave.rotation.y,
            z: wave.rotation.z
          },
          speed: 0.005 + (Math.random() * 0.02),
          amplitude: waveHeight,
          heightPhase: Math.random() * Math.PI * 2
        };
        
        millerGroup.add(wave);
      }
      
      // Miller atmosphere - misty and hazy like in the movie
      const millerAtmosphereGeometry = new THREE.SphereGeometry(1.3, 64, 64);
      const millerAtmosphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xD6EAF8,
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

    // Create glow effect for black hole
    const blackHoleLight = new THREE.PointLight(0x5290F2, 5, 15);
    blackHoleLight.position.set(0, 0, 0);
    scene.add(blackHoleLight);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 5;
    controls.maxDistance = 30;
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
        
        // Animate the wave rings on Miller's planet
        millerGroupRef.current.children.forEach(child => {
          if (child instanceof THREE.Mesh && 
              child.geometry instanceof THREE.TorusGeometry) {
            
            const userData = child.userData;
            if (userData.initialRotation) {
              // Rotate the wave ring
              child.rotation.x += userData.speed;
              child.rotation.z += userData.speed * 0.7;
              
              // Simulate rising and falling waves
              const time = Date.now() * 0.001;
              const scale = 1 + Math.sin(time + userData.heightPhase) * 0.1;
              child.scale.set(1, 1, scale);
            }
          }
        });
      }
      
      // Rotate Endurance slowly
      if (enduranceRef.current) {
        enduranceRef.current.rotation.z += 0.001;
      }
      
      // Animate black hole accretion disk
      if (blackHoleRef.current && blackHoleRef.current.parent) {
        const accretionDisk = blackHoleRef.current.parent.children.find(
          child => child instanceof THREE.Mesh && 
                  child.geometry instanceof THREE.RingGeometry
        );
        
        if (accretionDisk) {
          accretionDisk.rotation.z += 0.001;
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
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-36 pointer-events-none">
        <div className="text-center">
          <div className="text-sm uppercase tracking-wider text-foreground/70">Earth</div>
        </div>
        <div className="text-center">
          <div className="text-sm uppercase tracking-wider text-foreground/70">Gargantua</div>
        </div>
        <div className="text-center">
          <div className="text-sm uppercase tracking-wider text-foreground/70">Miller's Planet</div>
        </div>
      </div>
    </div>
  );
};

export default TimeDilationGlobe;
