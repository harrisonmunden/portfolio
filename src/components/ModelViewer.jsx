import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

const ModelViewer = ({ modelPath, texturePath, onClose }) => {
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
            child.material.envMapIntensity = 0.1;
            child.material.needsUpdate = true;
          }
        });
        // If supported, set environmentIntensity (three.js r150+)
        if ('environmentIntensity' in scene) {
          scene.environmentIntensity = 0.1;
        }
      }
    });

    // Camera
    const initialDistance = 47; // much farther away
    let cameraTheta = Math.PI / 2; // horizontal angle
    let cameraPhi = Math.PI / 2.2; // vertical angle
    let cameraRadius = initialDistance;
    let targetTheta = cameraTheta;
    let targetPhi = cameraPhi;
    let targetRadius = cameraRadius;
    // Lower the camera target for Flowers model
    let target;
    if (modelPath && modelPath.includes('Flowers.glb')) {
      target = new THREE.Vector3(0, 8, 0); // Lower y for Flowers (even more)
    } else {
      target = new THREE.Vector3(0, 0.7, 0); // Default (Car)
    }
    // Slightly wider FOV on mobile for a better view
    camera = new THREE.PerspectiveCamera(isMobile ? 48 : 30, width / height, 0.1, 100);
    function updateCamera() {
      camera.position.x = cameraRadius * Math.sin(cameraPhi) * Math.cos(cameraTheta) + target.x;
      camera.position.y = cameraRadius * Math.cos(cameraPhi) + target.y;
      camera.position.z = cameraRadius * Math.sin(cameraPhi) * Math.sin(cameraTheta) + target.z;
      // Prevent camera from going below the floor for Flowers model
      if (modelPath && modelPath.includes('Flowers.glb')) {
        const floorY = target.y; // y=8 for flowers
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

    // Load Model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        if (!isMounted) return;
        model = gltf.scene;
        // Spin-in animation: start at offset, animate to target
        const targetY = Math.PI * 1.3;
        const startY = targetY + 1.5;
        model.rotation.y = startY;
        scene.add(model);
        modelLoaded = true;
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
            if (t < 1 && isMounted) {
              requestAnimationFrame(animateSpinIn);
            } else if (model) {
              model.rotation.y = targetY;
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
    const minPhi = (modelPath && modelPath.includes('Flowers.glb')) ? 0.45 : 0.08;
    const maxPhi = Math.PI - 0.2;
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
          const floorY = target.y;
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
      const lerpFactor = isMobile ? 0.055 : 0.07;
      cameraTheta += (targetTheta - cameraTheta) * lerpFactor;
      cameraPhi += (targetPhi - cameraPhi) * lerpFactor;
      cameraRadius += (targetRadius - cameraRadius) * lerpFactor;
      updateCamera();
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