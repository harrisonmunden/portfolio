import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

const ModelViewer = ({ modelPath, texturePath, onClose, title = "3D Model Viewer" }) => {
  const mountRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const [loading, setLoading] = useState(true);
  const [sceneFade, setSceneFade] = useState(true);
  // Responsive sizing
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 700;

  useEffect(() => {
    let isMounted = true;
    let scene, camera, renderer, model, animationId;
    const width = mountRef.current?.clientWidth || 1;
    const height = mountRef.current?.clientHeight || 1;
    let modelLoaded = false;
    let textureLoaded = false;
    let spinInStarted = false;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Load EXR environment map for lighting
    new EXRLoader().load('/src/assets/3DModels/studio_small_09_2k.exr', (texture) => {
      if (!isMounted) return;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      // Rotate the environment map 90 degrees around Y
      if (texture.matrixAutoUpdate !== undefined) {
        texture.matrixAutoUpdate = false;
        const m = new THREE.Matrix3();
        const angle = Math.PI / 2; // 90 degrees
        m.set(
          Math.cos(angle), 0, Math.sin(angle),
          0, 1, 0,
          -Math.sin(angle), 0, Math.cos(angle)
        );
        texture.matrix = m;
      }
      if (scene) {
        scene.environment = texture;
        // Make all mesh materials respond more strongly to the environment
        scene.traverse((child) => {
          if (child.isMesh && child.material && 'envMapIntensity' in child.material) {
            child.material.envMapIntensity = 0.15;
            child.material.needsUpdate = true;
          }
        });
        // If supported, set environmentIntensity (three.js r150+)
        if ('environmentIntensity' in scene) {
          scene.environmentIntensity = 0.15;
        }
      }
    });

    // Camera
    let initialDistance = 47; // much farther away
    if (modelPath && modelPath.includes('Flowers.glb')) {
      initialDistance = 60; // Even farther for flowers scene
    }
    let cameraTheta = Math.PI / 2; // horizontal angle
    let cameraPhi = Math.PI / 2.2; // vertical angle
    let cameraRadius = initialDistance;
    let targetTheta = cameraTheta;
    let targetPhi = cameraPhi;
    let targetRadius = cameraRadius;
    // Lower the camera target for Flowers model
    let target;
    if (modelPath && modelPath.includes('Flowers.glb')) {
      target = new THREE.Vector3(0, 5, 0); // Look at a point higher up in the flowers geometry
    } else {
      target = new THREE.Vector3(0, 0.7, 0); // Default (Car)
    }
    // Slightly wider FOV on mobile for a better view
    camera = new THREE.PerspectiveCamera(isMobile ? 48 : 30, width / height, 0.1, 100);
    function updateCamera() {
      camera.position.x = cameraRadius * Math.sin(cameraPhi) * Math.cos(cameraTheta) + target.x;
      camera.position.y = cameraRadius * Math.cos(cameraPhi) + target.y;
      camera.position.z = cameraRadius * Math.sin(cameraPhi) * Math.sin(cameraTheta) + target.z;
      
      // Shift the entire view down by 30 points
      camera.position.y += 20;
      
      // Prevent camera from going below the floor for Flowers model
      if (modelPath && modelPath.includes('Flowers.glb')) {
        const floorY = 0; // y=0 for flowers pivot point
        if (camera.position.y < floorY) {
          camera.position.y = floorY;
        }
      }
      camera.lookAt(target);
    }
    updateCamera();

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Postprocessing: Bloom (glare)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    let bloomStrength = 1.5;
    let bloomRadius = 0.3;
    let bloomThreshold = 0.22;
    if (modelPath && modelPath.includes('Flowers.glb')) {
      bloomStrength = 0.45;
      bloomRadius = 0.08;
      bloomThreshold = 0.28;
    }
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      bloomStrength,
      bloomRadius,
      bloomThreshold
    );
    composer.addPass(bloomPass);

    // Brighter direct lights for extra pop
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    // Create floating rings only for flowers scene
    const rings = [];
    if (modelPath && modelPath.includes('Flowers.glb')) {
      const ringColors = [0xc3434f, 0xd6bc2a, 0x75538d]; // Yellow, Red, Purple
      const numRings = 35;
      
      for (let i = 0; i < numRings; i++) {
      const ringGeometry = new THREE.TorusGeometry(0.2 + Math.random() * 0.8, 0.03 + Math.random() * 0.05, 10, 12);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: ringColors[i % ringColors.length],
        transparent: true,
        opacity: 0.3
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      
      // Random position around the scene (closer to flowers)
      ring.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30 + 15, // Higher origin point
        (Math.random() - 0.5) * 30
      );
      
      // Random scale (smaller)
      const scale = 0.3 + Math.random() * 1.2;
      ring.scale.set(scale, scale, scale);
      
      // Store original position for viscous motion
      ring.userData.originalPosition = ring.position.clone();
      ring.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );
      
              scene.add(ring);
        rings.push(ring);
      }
    }

    // Load Model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        if (!isMounted) return;
        model = gltf.scene;
        // Spin-in animation: start at offset, animate to target
       
        var targetY = Math.PI * 1.3;
        if (modelPath && modelPath.includes('Flowers.glb')) {
          console.log('Flowers model detected');
          targetY = Math.PI * -1.3 - (170 * Math.PI / 180); // 60 degrees less in radians
        }
        const startY = targetY + 1.5;
        model.rotation.y = startY;
        scene.add(model);
        modelLoaded = true;
        
        // Load floor only for flowers scene
        if (modelPath && modelPath.includes('Flowers.glb')) {
          loader.load(
            '/src/assets/3DModels/Floor.glb',
            (floorGltf) => {
              if (!isMounted) return;
              const floor = floorGltf.scene;
              // Position floor for flowers scene
              floor.position.y = 0; // Floor at ground level for flowers
              floor.rotation.y = 180; // Floor at ground level for flowers
            
            // Load and apply floor texture with alpha channel
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
              '/src/assets/3DModels/FloorTextureFlower.png',
              (texture) => {
                if (!isMounted) return;
                texture.flipY = false;
                texture.encoding = THREE.LinearEncoding;
                texture.generateMipmaps = false;
                texture.minFilter = THREE.NearestFilter;
                texture.magFilter = THREE.NearestFilter;
                
                floor.traverse((child) => {
                  if (child.isMesh) {
                    // Only apply if mesh has UVs
                    if (child.geometry && child.geometry.attributes.uv) {
                      child.material = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide,
                        transparent: true,
                        alphaTest: 0.1,
                        depthWrite: false,
                        depthTest: true,
                        toneMapped: false
                      });
                      child.material.needsUpdate = true;
                    }
                  }
                });
              },
              undefined,
              (error) => {
                console.error('Error loading floor texture:', error);
              }
            );
            
              // Mark floor for animation
              floor.userData.isFloor = true;
              floor.scale.setScalar(0); // Start at scale 0
              
              scene.add(floor);
              
              // If no texture, start spin-in (floor is loaded)
              if (!texturePath) {
                startSpinIn();
              }
            },
            undefined,
            (error) => {
              console.error('Error loading floor:', error);
            }
          );
        }
        
        // If no texture, start spin-in
        if (!texturePath) {
          startSpinIn();
        }
        if (texturePath) {
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(texturePath, (texture) => {
            if (!isMounted) return;
            texture.flipY = false;
            texture.encoding = THREE.sRGBEncoding;
            model.traverse((child) => {
              if (child.isMesh) {
                // Only apply if mesh has UVs
                if (child.geometry && child.geometry.attributes.uv) {
                  // Copy over basic material properties
                  const oldMat = child.material;
                  let metalness = 0.95;
                  let roughness = 0.15;
                  let envMapIntensity = 2.5;
                  if (modelPath && modelPath.includes('Flowers.glb')) {
                    metalness = 0.45;
                    roughness = 0.45;
                    envMapIntensity = 0.7;
                  }
                  child.material = new THREE.MeshStandardMaterial({
                    map: texture,
                    color: oldMat.color ? oldMat.color : new THREE.Color(0xffffff),
                    metalness,
                    roughness,
                    transparent: oldMat.transparent,
                    opacity: oldMat.opacity,
                    side: oldMat.side,
                  });
                  child.material.envMapIntensity = envMapIntensity;
                  child.material.needsUpdate = true;
                }
              }
            });
            textureLoaded = true;
            if (modelLoaded) {
              startSpinIn();
            }
          });
        }
        // Make all meshes highly reflective, even if no texture
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            let metalness = 1;
            let roughness = 0.05;
            let envMapIntensity = 2.5;
            if (modelPath && modelPath.includes('Flowers.glb')) {
              metalness = 0.45;
              roughness = 0.45;
              envMapIntensity = 0.7;
            }
            child.material.metalness = metalness;
            child.material.roughness = roughness;
            child.material.envMapIntensity = envMapIntensity;
            child.material.needsUpdate = true;
          }
        });
      },
      undefined,
      (error) => {
        // eslint-disable-next-line no-console
        console.error('Error loading model:', error);
      }
    );
    function startSpinIn() {
      if (spinInStarted) return;
      spinInStarted = true;
      // Pre-warm GPU for first render
      if (renderer && scene && camera) {
        renderer.compile(scene, camera);
      }
      // Fade out spinner
      setLoading(false);
      // Fade in scene from black, then start animation
      setTimeout(() => {
        setSceneFade(false);
        setTimeout(() => {
          let startTime = null;
          const targetY = Math.PI * 1.3;
          const startY = targetY + 1.5;
          function animateSpinIn(ts) {
            if (!startTime) startTime = ts;
            const elapsed = (ts - startTime) / 1200; // 1.2s
            const t = Math.min(1, elapsed);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - t, 3);
            if (model) model.rotation.y = startY + (targetY - startY) * ease;
            
            // Animate floor scale from 0 to 1
            scene.traverse((child) => {
              if (child.userData && child.userData.isFloor) {
                child.scale.setScalar(ease);
              }
            });
            
            if (t < 1 && isMounted) {
              requestAnimationFrame(animateSpinIn);
            } else if (model) {
              model.rotation.y = targetY;
              // Set floor to final scale
              scene.traverse((child) => {
                if (child.userData && child.userData.isFloor) {
                  child.scale.setScalar(1);
                }
              });
            }
          }
          requestAnimationFrame(animateSpinIn);
        }, 50); // match fade duration
      }, 400); // match spinner fade-out transition
    }

    // Orbit Controls (manual)
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let isRightButton = false;
    // Prevent going underneath for Flowers model
    const minPhi = (modelPath && modelPath.includes('Flowers.glb')) ? 0.08 : 0.08;
    const maxPhi = (modelPath && modelPath.includes('Flowers.glb')) ? Math.PI - 0.02 : Math.PI - 0.2;
    const minRadius = 2, maxRadius = 60;
    function onPointerDown(e) {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      isRightButton = e.button === 2;
      resetIdleTimer();
    }
    function onPointerUp() {
      isDragging = false;
      resetIdleTimer();
    }
    function onPointerMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (!isRightButton && e.buttons === 1) {
        // Left button: orbit
        let nextTheta = targetTheta + dx * 0.008;
        let nextPhi = targetPhi - dy * 0.008;
        nextPhi = Math.max(minPhi, Math.min(maxPhi, nextPhi));
        // For Flowers, prevent phi that would go below the floor
        if (modelPath && modelPath.includes('Flowers.glb')) {
          const nextY = cameraRadius * Math.cos(nextPhi) + target.y;
          const floorY = 0; // y=0 for flowers pivot point
          if (nextY >= floorY) {
            targetTheta = nextTheta;
            targetPhi = nextPhi;
          }
          // else: do not update phi/theta, cancel motion
        } else {
          targetTheta = nextTheta;
          targetPhi = nextPhi;
        }
      } else if (isRightButton || e.buttons === 2) {
        // Right button: zoom
        targetRadius += dy * 0.03;
        targetRadius = Math.max(minRadius, Math.min(maxRadius, targetRadius));
      }
      lastX = e.clientX;
      lastY = e.clientY;
      resetIdleTimer();
    }
    function onWheel(e) {
      targetRadius += e.deltaY * 0.002;
      targetRadius = Math.max(minRadius, Math.min(maxRadius, targetRadius));
      resetIdleTimer();
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.oncontextmenu = (e) => e.preventDefault();

    // Animation loop
    // Idle camera reset logic
    let idleTimeoutId = null;
    let resetAnimId = null;
    const initialCamera = {
      theta: cameraTheta,
      phi: cameraPhi,
      radius: cameraRadius,
    };
    function resetIdleTimer() {
      if (idleTimeoutId) clearTimeout(idleTimeoutId);
      if (resetAnimId) cancelAnimationFrame(resetAnimId);
      idleTimeoutId = setTimeout(() => {
        animateCameraToInitial();
      }, 5000);
    }
    function animateCameraToInitial() {
      const startTheta = targetTheta;
      const startPhi = targetPhi;
      const startRadius = targetRadius;
      const endTheta = initialCamera.theta;
      const endPhi = initialCamera.phi;
      const endRadius = initialCamera.radius;
      const duration = 900;
      let startTime = null;
      function animateBack(ts) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const t = Math.min(1, elapsed / duration);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - t, 3);
        targetTheta = startTheta + (endTheta - startTheta) * ease;
        targetPhi = startPhi + (endPhi - startPhi) * ease;
        targetRadius = startRadius + (endRadius - startRadius) * ease;
        if (t < 1) {
          resetAnimId = requestAnimationFrame(animateBack);
        } else {
          targetTheta = endTheta;
          targetPhi = endPhi;
          targetRadius = endRadius;
        }
      }
      resetAnimId = requestAnimationFrame(animateBack);
    }
    // Start idle timer on mount
    resetIdleTimer();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      // Smoothly interpolate camera values
      const lerpFactor = isMobile ? 0.09 : 0.07;
      cameraTheta += (targetTheta - cameraTheta) * lerpFactor;
      cameraPhi += (targetPhi - cameraPhi) * lerpFactor;
      cameraRadius += (targetRadius - cameraRadius) * lerpFactor;
      updateCamera();
      
      // Update floating rings with viscous motion (only for flowers scene)
      if (rings.length > 0) {
        rings.forEach((ring, index) => {
        // Simple gentle bobbing motion
        ring.userData.velocity.x += (Math.random() - 0.5) * 0.0005;
        ring.userData.velocity.y += (Math.random() - 0.5) * 0.0005;
        ring.userData.velocity.z += (Math.random() - 0.5) * 0.0005;
        
        // Apply gentle damping
        ring.userData.velocity.multiplyScalar(0.995);
        
        // Update position
        ring.position.add(ring.userData.velocity);
        
        // Keep rings within bounds
        const bounds = 20;
        ring.position.x = Math.max(-bounds, Math.min(bounds, ring.position.x));
        ring.position.y = Math.max(-bounds + 15, Math.min(bounds + 15, ring.position.y));
        ring.position.z = Math.max(-bounds, Math.min(bounds, ring.position.z));
        
        // Rotate rings to face the origin
        ring.lookAt(new THREE.Vector3(0, 0, 0));
        
          // Gentle rotation
          ring.rotation.x += 0.001;
          ring.rotation.z += 0.0005;
        });
      }
      
      composer.render();
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationId);
      if (idleTimeoutId) clearTimeout(idleTimeoutId);
      if (resetAnimId) cancelAnimationFrame(resetAnimId);
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointerup', onPointerUp);
        renderer.domElement.removeEventListener('pointerleave', onPointerUp);
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('wheel', onWheel);
        renderer.domElement.oncontextmenu = null;
        if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      if (renderer) {
        renderer.dispose();
      }
      if (composer && composer.dispose) composer.dispose();
      scene = null;
      camera = null;
      renderer = null;
      model = null;
    };
  }, [modelPath, texturePath]);

  return (
    <div className="model-viewer-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.98)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: isMobile ? 12 : 32, right: isMobile ? 12 : 32, zIndex: 1001, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: isMobile ? 48 : 40, height: isMobile ? 48 : 40, fontSize: isMobile ? 32 : 24, cursor: 'pointer' }}>&times;</button>
      
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: isMobile ? 20 : 40,
        left: isMobile ? 20 : 40,
        zIndex: 1001,
        fontFamily: "'Martian Mono', 'Courier New', Courier, monospace",
        fontSize: isMobile ? '24px' : '52px',
        fontWeight: 700,
        color: '#1a1a1a',
        letterSpacing: '0.04em',
        background: 'rgba(255,255,255,0.95)',
        padding: isMobile ? '8px 16px' : '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        {title}
      </div>
      <div ref={mountRef} style={{
        width: isMobile ? '100vw' : '96vw',
        height: isMobile ? '60vh' : '80vh',
        aspectRatio: isMobile ? '4/3' : '16/9',
        borderRadius: isMobile ? 12 : 24,
        overflow: 'hidden',
        background: '#111',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
      }} />
      {/* Fade-in overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        background: '#000',
        opacity: sceneFade ? 1 : 0,
        pointerEvents: 'none',
        zIndex: 1500,
        transition: 'opacity 0.5s cubic-bezier(.4,2,.6,1)'
      }} />
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000,
          pointerEvents: 'none',
          opacity: loading ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(.4,2,.6,1)'
        }}>
          <div className="loading-spinner" style={{
            width: 60, height: 60, border: '6px solid rgba(255,255,255,0.18)', borderTop: '6px solid #00fff7', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 20
          }} />
        </div>
      )}
    </div>
  );
};

export default ModelViewer;

// Spinner keyframes (inject into global style if not present)
const style = document.createElement('style');
style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
if (!document.head.querySelector('style[data-spinner]')) {
  style.setAttribute('data-spinner', 'true');
  document.head.appendChild(style);
} 