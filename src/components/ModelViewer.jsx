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
    new EXRLoader().load('/3DModels/studio_small_09_2k.exr', (texture) => {
      if (!isMounted) return;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      // Rotate the environment map 90 degrees around Y
      if (texture.matrixAutoUpdate !== undefined) {
        texture.matrixAutoUpdate = false;
        const m = new THREE.Matrix3();
        let angle = Math.PI / 2; // 90 degrees default
        // Rotate an additional 90 degrees for purse scene to reduce back lighting
        if (modelPath && modelPath.includes('Purse1.glb')) {
          angle = -Math.PI * 2; // 180 degrees total (90 + 90)
        }
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
    if (modelPath && modelPath.includes('Motorcycle.glb')) {
      initialDistance = 15; // Much closer for motorcycle
    }
    if (modelPath && modelPath.includes('Purse1.glb')) {
      initialDistance = 25; // Medium distance for purse
    }
    
    // Mobile adjustments - bring camera closer for better mobile experience
    if (isMobile) {
      initialDistance *= 0.7; // 30% closer on mobile
      if (modelPath && modelPath.includes('Flowers.glb')) {
        initialDistance = 42; // Closer for flowers on mobile
      }
      if (modelPath && modelPath.includes('Motorcycle.glb')) {
        initialDistance = 10.5; // Closer for motorcycle on mobile
      }
      if (modelPath && modelPath.includes('Purse1.glb')) {
        initialDistance = 17.5; // Closer for purse on mobile
      }
    }
    let cameraTheta = Math.PI / 2; // horizontal angle
    let cameraPhi = Math.PI / 2.2; // vertical angle
    let cameraRadius = initialDistance;
    let targetTheta = cameraTheta;
    let targetPhi = cameraPhi;
    let targetRadius = cameraRadius;
    
    // ========================================
    // CUSTOM CAMERA LANDING POSITIONS
    // ========================================
    // Configure the final landing position for each scene here
    // These values will be used after the spin-in animation completes
    
    let landingConfig = {
      theta: cameraTheta,
      phi: cameraPhi,
      radius: cameraRadius,
      target: null // Will be set based on model
    };
    
    // Custom landing positions for each scene
    if (modelPath && modelPath.includes('Car.glb')) {
      // Car scene landing position
      landingConfig = {
        theta: Math.PI / 2, // 90 degrees
        phi: Math.PI / 2.2, // Slightly above horizontal
        radius: isMobile ? 49 : 47, // Closer on mobile
        target: new THREE.Vector3(0, 0.7, 0)
      };
    } else if (modelPath && modelPath.includes('Flowers.glb')) {
      // Flowers scene landing position
      landingConfig = {
        theta: Math.PI / 2,
        phi: Math.PI / 2.2,
        radius: isMobile ? 42 : 60, // Closer on mobile
        target: new THREE.Vector3(0, 5, 0)
      };
    } else if (modelPath && modelPath.includes('Motorcycle.glb')) {
      // Motorcycle scene landing position
      landingConfig = {
        theta: Math.PI / 2,
        phi: Math.PI / 2.2,
        radius: isMobile ? 12.5 : 15, // Closer on mobile
        target: new THREE.Vector3(0, 2, 0)
      };
    } else if (modelPath && modelPath.includes('Purse1.glb')) {
      // Purse scene landing position
      landingConfig = {
        theta: 3.3,
        phi: 2.34,
        radius: isMobile ? 23 : 30, // Closer on mobile
        target: new THREE.Vector3(0, 0, 0) // Will be updated when model loads
      };
    }
    
    // Apply landing config to current camera state
    cameraTheta = landingConfig.theta;
    cameraPhi = landingConfig.phi;
    cameraRadius = landingConfig.radius;
    targetTheta = cameraTheta;
    targetPhi = cameraPhi;
    targetRadius = cameraRadius;
    // Lower the camera target for Flowers model
    let target = landingConfig.target;
    // Slightly wider FOV on mobile for a better view
    camera = new THREE.PerspectiveCamera(isMobile ? 48 : 30, width / height, 0.1, 100);
    function updateCamera() {
      camera.position.x = cameraRadius * Math.sin(cameraPhi) * Math.cos(cameraTheta) + target.x;
      camera.position.y = cameraRadius * Math.cos(cameraPhi) + target.y;
      camera.position.z = cameraRadius * Math.sin(cameraPhi) * Math.sin(cameraTheta) + target.z;
      
      // Shift the entire view down by 30 points
      camera.position.y += 20;
      
      // Adjust camera height for different models
      if (modelPath && modelPath.includes('Flowers.glb')) {
        const floorY = 0; // y=0 for flowers pivot point
        if (camera.position.y < floorY) {
          camera.position.y = floorY;
        }
      }
      if (modelPath && modelPath.includes('Motorcycle.glb')) {
        camera.position.y -= 15; // Lower camera for motorcycle
      }
      camera.lookAt(target);
    }
    updateCamera();

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Postprocessing: Bloom (glare)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    let bloomStrength = 1.2;
    let bloomRadius = 0.15;
    let bloomThreshold = 0.22;
    if (modelPath && modelPath.includes('Flowers.glb')) {
      bloomStrength = 0.45;
      bloomRadius = 0.08;
      bloomThreshold = 0.28;
    } else if (modelPath && modelPath.includes('Purse1.glb')) {
      // Reduce bloom for purse scene
      bloomStrength = 0.1;
      bloomRadius = 0.05;
      bloomThreshold = 0.35;
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

    // Create animated dots for car scene
    const dots = [];
    if (modelPath && modelPath.includes('Car.glb')) {
      const dotColors = [0xEEFFF9, 0x9CD7BF, 0x4BB793]; // Different shades of green
      const layerConfigs = [
        { radius: 15, count: 20, delay: 0.1, color: 0xEEFFF9 },   // Layer 1: closest, fastest
        { radius: 25, count: 30, delay: 0.3, color: 0x9CD7BF },   // Layer 2: medium, medium delay
        { radius: 35, count: 40, delay: 2.6, color: 0x4BB793 }    // Layer 3: farthest, slowest
      ];
      
      layerConfigs.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
          // Create tiny dot geometry
          const dotGeometry = new THREE.SphereGeometry(0.05, 8, 6);
          const dotMaterial = new THREE.MeshBasicMaterial({
            color: layer.color,
            transparent: true,
            opacity: 0.7
          });
          const dot = new THREE.Mesh(dotGeometry, dotMaterial);
          
          // Random position on the layer's radius
          const angle = Math.random() * Math.PI * 2;
          const height = (Math.random() - 0.5) * 10; // Random height variation
          const radiusVariation = (Math.random() - 0.5) * 3; // Random radius variation
          const finalRadius = layer.radius + radiusVariation;
          dot.position.set(
            Math.cos(angle) * finalRadius,
            height,
            Math.sin(angle) * finalRadius
          );
          
          // Store layer info for animation
          dot.userData.layerIndex = layerIndex;
          dot.userData.delay = layer.delay;
          dot.userData.originalPosition = dot.position.clone();
          dot.userData.originalRadius = finalRadius; // Store the random radius
          dot.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
          );
          
          scene.add(dot);
          dots.push(dot);
        }
      });
    }

            // Create dynamic light bands for motorcycle scene
        const lightBands = [];
        if (modelPath && modelPath.includes('Motorcycle.glb')) {
          const bandConfigs = [
            { radius: 1.5, color: 0xffffff, height: 0 },    // Inner band - slightly smaller
            { radius: 2.8, color: 0xffffff, height: 0 },   // Middle band - slightly smaller
            { radius: 4.0, color: 0xffffff, height: 0 }    // Outer band - slightly smaller
          ];
          
          bandConfigs.forEach((config, index) => {
            // Create ring geometry for the band - thinner tube
            const ringGeometry = new THREE.TorusGeometry(config.radius, 0.008, 16, 64);
            const bandMaterial = new THREE.MeshBasicMaterial({
              color: config.color,
              transparent: true,
              opacity: 0.1, // Much less opaque by default
              side: THREE.DoubleSide,
              depthWrite: false, // Disable depth writing
              depthTest: false, // Disable depth testing - render as overlay
              blending: THREE.AdditiveBlending // Additive blending for light effect
            });
            const band = new THREE.Mesh(ringGeometry, bandMaterial);
            
            // Position the band horizontally at camera target, behind the motorcycle
            band.position.set(target.x, target.y + config.height, target.z - 20); // Much further back to ensure behind geometry
            
            // Store band data for animation
            band.userData.bandIndex = index;
            band.userData.baseRadius = config.radius;
            band.userData.targetRadius = config.radius;
            band.userData.currentRadius = config.radius;
            band.userData.opacity = 0.1; // Base opacity
            band.userData.targetOpacity = 0.1; // Base opacity
            band.userData.lastCameraTheta = cameraTheta;
            band.userData.lastCameraPhi = cameraPhi;
            band.userData.movementThreshold = 0.001; // Minimum movement to trigger bands
            band.userData.scaleInProgress = true; // Track scale-in animation
            
            // Set render order to ensure bands render behind everything
            band.renderOrder = -100; // Much lower render order to ensure behind everything
            band.scale.setScalar(0); // Start at scale 0 for scale-in animation
            band.userData.initialScaleComplete = false; // Track if initial scale is done
            scene.add(band);
            lightBands.push(band);
          });
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
        
        // Ensure motorcycle model renders on top of everything
        if (modelPath && modelPath.includes('Motorcycle.glb')) {
          model.renderOrder = 100; // Much higher render order to ensure in front of bands
        }
        
        scene.add(model);
        modelLoaded = true;
        
        // For purse model, ensure spin-in starts
        if (modelPath && modelPath.includes('Purse1.glb')) {
          console.log('Purse model detected');
          console.log('Texture path:', texturePath);
          console.log('Model loaded:', modelLoaded);
          
          // Calculate the center of the purse object
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          target.copy(center);
          console.log('Purse center:', center);
          
          // Update camera target to purse center
          if (modelPath && modelPath.includes('Purse1.glb')) {
            target = center;
            landingConfig.target = center; // Update landing config target
          }
          
          // Load purse table
          console.log('Loading PurseTable.glb for purse scene');
          loader.load(
            '/3DModels/PurseTable.glb',
            (tableGltf) => {
              if (!isMounted) return;
              console.log('PurseTable loaded successfully');
              const table = tableGltf.scene;
              
              // Position table below the purse
              table.position.y = -0.05; // Moved up from -2
              table.rotation.y = Math.PI / 4 + 0.16 + Math.PI; // Rotate 45 degrees
              table.userData.isPurseTable = true;
              
              // Load and apply table texture
              const textureLoader = new THREE.TextureLoader();
              textureLoader.load(
                '/3DModels/PurseTableAlbedo.png',
                (texture) => {
                  if (!isMounted) return;
                  texture.flipY = false;
                  texture.encoding = THREE.sRGBEncoding;
                  
                  table.traverse((child) => {
                    if (child.isMesh) {
                      // Only apply if mesh has UVs
                      if (child.geometry && child.geometry.attributes.uv) {
                        child.material = new THREE.MeshStandardMaterial({
                          map: texture,
                          metalness: 0.4,
                          roughness: 0.2,
                          envMapIntensity: 1.0
                        });
                        child.material.needsUpdate = true;
                      }
                    }
                  });
                },
                undefined,
                (error) => {
                  console.error('Error loading table texture:', error);
                }
              );
              
              // Mark table for animation
              table.userData.isTable = true;
              // Start table at same rotation as purse
              table.rotation.y = startY; // Match purse starting rotation
              
              scene.add(table);
              console.log('PurseTable added to scene');
              
              // If no texture, start spin-in (table is loaded)
              if (!texturePath) {
                startSpinIn();
              }
            },
            undefined,
            (error) => {
              console.error('Error loading purse table:', error);
            }
          );
          
          // If no texture, start spin-in immediately
          if (!texturePath) {
            console.log('Starting spin-in for purse (no texture)');
            startSpinIn();
          }
        }
        
        // Load floor for Car scene
        if (modelPath && modelPath.includes('Car.glb')) {
          console.log('Loading CarFloor.glb for Car scene');
          console.log('Model path:', modelPath);
          loader.load(
            '/3DModels/CarFloor.glb',
            (floorGltf) => {
              if (!isMounted) return;
              console.log('CarFloor loaded successfully');
              const floor = floorGltf.scene;
              
              // Position floor for car scene
              floor.position.y = -0.5; // Slightly below the car
              // Floor rotation will be updated in animation loop to match car
              floor.userData.isCarFloor = true;
              
              // Create pulsing light shader for the floor
              let meshCount = 0;
              floor.traverse((child) => {
                if (child.isMesh) {
                  meshCount++;
                  console.log('Applying shader to CarFloor mesh', meshCount);
                  // Create custom shader material with pulsing light effect
                  const vertexShader = `
                    varying vec2 vUv;
                    void main() {
                      vUv = uv;
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                  `;
                  
                                    const fragmentShader = `
                    uniform float time;
                    uniform float lightTime;
                    varying vec2 vUv;
                    
                    void main() {
                      // Create moving white pulse that travels along UV.y only
                      // Calculate position of the pulse (moves from bottom to top)
                      float pulsePosition = mod(lightTime * 0.6, 1.0); // 0 to 1 over time
                      float pulseWidth = 0.15; // Width of the pulse
                      float pulseDistance = abs(vUv.y * 0.8 - pulsePosition);
                      
                      // Create a soft white pulse with gentle falloff
                      float whitePulse = 1.0 - smoothstep(0.0, pulseWidth * 2.0, pulseDistance);
                      whitePulse = pow(whitePulse, 0.8); // Softer falloff
                      
                      // Simple base color without noise
                      vec3 baseColor = vec3(0.01, 0.04, 0.03);
                      vec3 greenColor = vec3(0.0, 0.4, 0.3) * whitePulse;
                      
                      // Combine - green pulse with reduced intensity
                      vec3 finalColor = baseColor + greenColor * 0.15;
                      
                      // Fade alpha at edges based on UV.y
                      float edgeFade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
                      float alpha = 0.8 * edgeFade;
                      
                      gl_FragColor = vec4(finalColor, alpha);
                    }
                  `;
                  
                  // Create shader material
                  const shaderMaterial = new THREE.ShaderMaterial({
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    uniforms: {
                      time: { value: 0.0 },
                      lightTime: { value: 0.0 }
                    },
                    side: THREE.DoubleSide,
                    transparent: true,
                    alphaTest: 0.01
                  });
                  
                  child.material = shaderMaterial;
                  child.material.needsUpdate = true;
                  // Mark this mesh as having a shader
                  child.userData.hasShader = true;
                  console.log('Shader applied to CarFloor mesh', meshCount);
                }
              });
              
              console.log('Total meshes found in CarFloor:', meshCount);
              
              // Mark floor for animation
              floor.userData.isFloor = true;
              floor.scale.setScalar(0); // Start at scale 0
              
              scene.add(floor);
              console.log('CarFloor added to scene');
              
              // If no texture, start spin-in (floor is loaded)
              if (!texturePath) {
                startSpinIn();
              }
            },
            undefined,
            (error) => {
              console.error('Error loading car floor:', error);
            }
          );
        }
        
        // Load floor only for flowers scene
        if (modelPath && modelPath.includes('Flowers.glb')) {
          loader.load(
            '/3DModels/Floor.glb',
            (floorGltf) => {
              if (!isMounted) return;
              const floor = floorGltf.scene;
              // Position floor for flowers scene
              floor.position.y = 0; // Floor at ground level for flowers
              floor.rotation.y = 180; // Floor at ground level for flowers
            
            // Load and apply floor texture with alpha channel
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
              '/3DModels/FloorTextureFlower.png',
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
        
        // For purse model, ensure spin-in starts even without texture
        if (modelPath && modelPath.includes('Purse1.glb') && !texturePath) {
          startSpinIn();
        }
        if (texturePath) {
          console.log('Loading texture:', texturePath);
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
                  } else if (modelPath && modelPath.includes('Purse1.glb')) {
                    // Make purse less shiny
                    metalness = 0.3;
                    roughness = 0.8;
                    envMapIntensity = 0.3;
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
            console.log('Texture loaded, modelLoaded:', modelLoaded);
            if (modelLoaded) {
              console.log('Starting spin-in for texture-loaded model');
              startSpinIn();
            }
          },
          undefined,
          (error) => {
            console.error('Error loading texture:', error);
            // If texture fails to load, still start spin-in
            textureLoaded = true;
            if (modelLoaded) {
              console.log('Starting spin-in after texture load error');
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
            } else if (modelPath && modelPath.includes('Purse1.glb')) {
              // Make purse less shiny
              metalness = 0.6;
              roughness = 0.1;
              envMapIntensity = 0.1;            }
            child.material.metalness = metalness;
            child.material.roughness = roughness;
            child.material.envMapIntensity = envMapIntensity;
            
            // Ensure motorcycle renders in front of bands
            if (modelPath && modelPath.includes('Motorcycle.glb')) {
              child.renderOrder = 100; // Much higher render order to ensure in front of bands
              child.material.depthWrite = true;
              child.material.depthTest = true;
            }
            
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
      console.log('startSpinIn called, spinInStarted:', spinInStarted);
      if (spinInStarted) return;
      spinInStarted = true;
      console.log('Setting spinInStarted to true');
      // Pre-warm GPU for first render
      if (renderer && scene && camera) {
        renderer.compile(scene, camera);
      }
      // Fade out spinner
      console.log('Setting loading to false');
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
              // Animate table rotation to match purse
              if (child.userData && child.userData.isTable) {
                child.rotation.y = startY + (targetY - startY) * ease; // Match purse rotation exactly
              }
            });
            
            // Animate light bands scale from 0 to 1 (only for motorcycle)
            if (modelPath && modelPath.includes('Motorcycle.glb')) {
              lightBands.forEach((band) => {
                band.scale.setScalar(ease);
              });
            }
            
            if (t < 1 && isMounted) {
              requestAnimationFrame(animateSpinIn);
            } else if (model) {
              model.rotation.y = targetY;
              // Set floor to final scale
              scene.traverse((child) => {
                if (child.userData && child.userData.isFloor) {
                  child.scale.setScalar(1);
                }
                // Set table to final rotation (match purse)
                if (child.userData && child.userData.isTable) {
                  child.rotation.y = targetY;
                }
              });
              // Set light bands to final scale (only for motorcycle)
              if (modelPath && modelPath.includes('Motorcycle.glb')) {
                lightBands.forEach((band) => {
                  band.scale.setScalar(1);
                  band.userData.initialScaleComplete = true; // Mark initial scale as complete
                });
              }
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
    let touchStartX = 0, touchStartY = 0;
    let touchStartTheta = 0, touchStartPhi = 0;
    let touchStartRadius = 0;
    
    // Prevent going underneath for Flowers model
    const minPhi = (modelPath && modelPath.includes('Flowers.glb')) ? 0.08 : 0.08;
    const maxPhi = (modelPath && modelPath.includes('Flowers.glb')) ? Math.PI - 0.02 : Math.PI - 0.2;
    let minRadius = 2, maxRadius = 60;
    if (modelPath && modelPath.includes('Motorcycle.glb')) {
      minRadius = 1; // Allow closer zoom for motorcycle
      maxRadius = 30; // Limit max zoom for motorcycle
    }
    
    function onPointerDown(e) {
      isDragging = true;
      lastX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      lastY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
      isRightButton = e.button === 2;
      
      // Store initial touch positions for smooth panning
      if (e.touches) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTheta = targetTheta;
        touchStartPhi = targetPhi;
        touchStartRadius = targetRadius;
      }
      
      resetIdleTimer();
    }
    
    function onPointerUp() {
      isDragging = false;
      resetIdleTimer();
    }
    
    function onPointerMove(e) {
      if (!isDragging) return;
      
      const currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      const currentY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
      
      if (!isRightButton && (e.buttons === 1 || e.touches)) {
        // Left button or touch: orbit
        let nextTheta, nextPhi;
        
        if (e.touches) {
          // Touch-based panning - use relative movement from touch start
          const deltaX = currentX - touchStartX;
          const deltaY = currentY - touchStartY;
          
          // Adjust sensitivity for mobile
          const touchSensitivity = 0.01;
          nextTheta = touchStartTheta + deltaX * touchSensitivity;
          nextPhi = touchStartPhi - deltaY * touchSensitivity;
        } else {
          // Mouse-based panning
          const dx = currentX - lastX;
          const dy = currentY - lastY;
          nextTheta = targetTheta + dx * 0.008;
          nextPhi = targetPhi - dy * 0.008;
        }
        
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
        const dy = currentY - lastY;
        targetRadius += dy * 0.03;
        targetRadius = Math.max(minRadius, Math.min(maxRadius, targetRadius));
      }
      
      lastX = currentX;
      lastY = currentY;
      resetIdleTimer();
    }
    
    function onWheel(e) {
      targetRadius += e.deltaY * 0.002;
      targetRadius = Math.max(minRadius, Math.min(maxRadius, targetRadius));
      resetIdleTimer();
    }
    
    // Add touch event listeners for better mobile support
    function onTouchStart(e) {
      e.preventDefault();
      onPointerDown(e);
    }
    
    function onTouchMove(e) {
      e.preventDefault();
      onPointerMove(e);
    }
    
    function onTouchEnd(e) {
      e.preventDefault();
      onPointerUp();
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('wheel', onWheel);
    
    // Add touch event listeners for better mobile support
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd, { passive: false });
    
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
      
      // Log camera parameters every frame
      console.log('Camera Parameters:', {
        theta: cameraTheta,
        phi: cameraPhi,
        radius: cameraRadius,
        targetTheta: targetTheta,
        targetPhi: targetPhi,
        targetRadius: targetRadius,
        position: camera.position.clone(),
        target: target.clone()
      });
      
      // Update shader time for car floor and match car rotation
      let shaderUpdateCount = 0;
      let totalObjects = 0;
      scene.traverse((child) => {
        totalObjects++;
        if (child.userData && child.userData.hasShader && child.material) {
          shaderUpdateCount++;
          child.material.uniforms.time.value += 0.016; // ~60fps
          child.material.uniforms.lightTime.value += 0.016; // ~60fps for light translation
          
          // Debug: log the lightTime value every 60 frames (once per second)
          if (Math.floor(child.material.uniforms.lightTime.value * 60) % 60 === 0) {
            console.log('LightTime value:', child.material.uniforms.lightTime.value, 'for shader', shaderUpdateCount);
          }
          
          // Force material update
          child.material.needsUpdate = true;
        }
        
        // Match car floor rotation to car model
        if (child.userData && child.userData.isCarFloor && model) {
          child.rotation.y = model.rotation.y;
        }
      });
      
      if (shaderUpdateCount === 0) {
        console.log('No shaders found to update in animation loop. Total objects in scene:', totalObjects);
      } else {
        console.log('Updated', shaderUpdateCount, 'shaders in animation loop');
      }
      
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
      
      // Update dynamic light bands for motorcycle scene
      if (lightBands.length > 0) {
        const cameraMovement = Math.abs(cameraTheta - targetTheta) + Math.abs(cameraPhi - targetPhi);
        const isMoving = cameraMovement > 0.001;
        
        lightBands.forEach((band) => {
          // Calculate movement intensity
          const thetaDiff = Math.abs(cameraTheta - band.userData.lastCameraTheta);
          const phiDiff = Math.abs(cameraPhi - band.userData.lastCameraPhi);
          const totalMovement = thetaDiff + phiDiff;
          
          // Update target opacity and scale based on movement
          if (isMoving && totalMovement > band.userData.movementThreshold) {
            band.userData.targetOpacity = Math.min(0.8, band.userData.targetOpacity + totalMovement * 2);
            band.userData.targetRadius = band.userData.baseRadius + totalMovement * 20; // Expand radius
          } else {
            band.userData.targetOpacity = Math.max(0.1, band.userData.targetOpacity - 0.02); // Return to base opacity
            band.userData.targetRadius = Math.max(band.userData.baseRadius, band.userData.targetRadius - 0.5); // Contract radius
          }
          
          // Smoothly interpolate opacity and radius
          band.userData.opacity += (band.userData.targetOpacity - band.userData.opacity) * 0.1;
          band.userData.currentRadius += (band.userData.targetRadius - band.userData.currentRadius) * 0.1;
          
          // Update band appearance
          band.material.opacity = band.userData.opacity;
          
          // Apply radius scaling only after initial scale-in animation is complete
          if (band.userData.initialScaleComplete) {
            band.scale.setScalar(band.userData.currentRadius / band.userData.baseRadius);
          }
          
          // Keep bands centered relative to camera view (stationary in view)
          const cameraDirection = new THREE.Vector3();
          camera.getWorldDirection(cameraDirection);
          const bandCenter = target.clone().add(cameraDirection.clone().multiplyScalar(-12)); // Move much further back
          band.position.set(bandCenter.x, bandCenter.y, bandCenter.z);
          
          // Make band face the camera
          band.lookAt(camera.position);
          
          // Store current camera position for next frame
          band.userData.lastCameraTheta = cameraTheta;
          band.userData.lastCameraPhi = cameraPhi;
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
        renderer.domElement.removeEventListener('touchstart', onTouchStart);
        renderer.domElement.removeEventListener('touchmove', onTouchMove);
        renderer.domElement.removeEventListener('touchend', onTouchEnd);
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
        color: '#ffffff',
        letterSpacing: '0.04em'
      }}>
        {title}
      </div>
      <div style={{ position: 'relative' }}>
        <div ref={mountRef} style={{
          width: isMobile ? '100vw' : '96vw',
          height: isMobile ? '80vh' : '80vh',
          aspectRatio: isMobile ? '5/4' : '16/9',
          borderRadius: isMobile ? 12 : 24,
          overflow: 'hidden',
          background: '#111',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
        }} />
        {/* Smooth black fade gradient at the top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '12%',
          background: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,1) 100%)',
          pointerEvents: 'none',
          borderRadius: isMobile ? '12px 12px 0 0' : '24px 24px 0 0',
          backdropFilter: 'blur(0.5px)',
          WebkitBackdropFilter: 'blur(0.5px)'
        }} />
        {/* Smooth black fade gradient at the bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '12%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,1) 100%)',
          pointerEvents: 'none',
          borderRadius: isMobile ? '0 0 12px 12px' : '0 0 24px 24px',
          backdropFilter: 'blur(0.5px)',
          WebkitBackdropFilter: 'blur(0.5px)'
        }} />
      </div>
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Main fancy spinner */}
            <div style={{
              position: 'relative',
              width: 80,
              height: 80
            }}>
              {/* Outer ring */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                border: '4px solid rgba(85, 230, 158, 0.1)',
                borderTop: '4px solid #55E69E',
                borderRadius: '50%',
                animation: 'spin 1.5s linear infinite'
              }} />
              {/* Middle ring */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                width: '60px',
                height: '60px',
                border: '3px solid rgba(85, 230, 158, 0.15)',
                borderRight: '3px solid #4DD4A3',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite reverse'
              }} />
              {/* Inner ring */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '40px',
                height: '40px',
                border: '2px solid rgba(85, 230, 158, 0.2)',
                borderBottom: '2px solid #66F0B0',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              {/* Center dot */}
              <div style={{
                position: 'absolute',
                top: '35px',
                left: '35px',
                width: '10px',
                height: '10px',
                background: '#55E69E',
                borderRadius: '50%',
                animation: 'pulse 1.2s ease-in-out infinite alternate'
              }} />
            </div>
            
            {/* Loading text */}
            <div style={{
              color: '#55E69E',
              fontSize: '18px',
              fontWeight: '500',
              fontFamily: "'Martian Mono', 'Courier New', Courier, monospace",
              letterSpacing: '0.1em',
              textShadow: '0 0 10px rgba(85, 230, 158, 0.5)'
            }}>
              LOADING
            </div>
            
            {/* Animated dots */}
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#55E69E',
                    borderRadius: '50%',
                    animation: `bounce 1.4s ease-in-out infinite both`,
                    animationDelay: `${i * 0.16}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;

// Spinner keyframes (inject into global style if not present)
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
  }
  @keyframes pulse { 
    0% { transform: scale(1); opacity: 1; } 
    100% { transform: scale(1.3); opacity: 0.7; } 
  }
  @keyframes bounce { 
    0%, 80%, 100% { transform: scale(0); } 
    40% { transform: scale(1); } 
  }
`;
if (!document.head.querySelector('style[data-spinner]')) {
  style.setAttribute('data-spinner', 'true');
  document.head.appendChild(style);
} 