"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const ThreeScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // === THREE.JS CODE START ===

        // Scene setup
        const scene = new THREE.Scene();

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 30, 50);
        camera.lookAt(scene.position);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000);
        mountRef.current.appendChild(renderer.domElement);

        // Post-processing setup (subtle bloom effect)
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.1,  // Reduced bloom strength
            0.4,  // Bloom radius
            1 // Bloom threshold
        );
        composer.addPass(bloomPass);

        // Grid setup
        const gridSize = 100;
        const gridSpacing = 0.2;
        const gridGeometry = new THREE.BufferGeometry();
        const gridPositions = [];

        for (let i = 0; i < gridSize; i++)
        {
            for (let j = 0; j < gridSize; j++)
            {
                gridPositions.push(
                    i * gridSpacing - (gridSize * gridSpacing) / 2,
                    0,
                    j * gridSpacing - (gridSize * gridSpacing) / 2
                );
            }
        }

        const gridIndices = [];
        for (let i = 0; i < gridSize - 1; i++)
        {
            for (let j = 0; j < gridSize - 1; j++)
            {
                const a = i * gridSize + j;
                const b = a + 1;
                const c = a + gridSize;
                const d = c + 1;
                gridIndices.push(a, b, c, b, d, c);
            }
        }

        gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
        gridGeometry.setIndex(gridIndices);
        gridGeometry.computeVertexNormals();

        const gridMaterial = new THREE.MeshPhongMaterial({
            color: 0x555555,
            emissive: 0x222222,
            specular: 0x777777,
            shininess: 30,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
        });
        const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
        scene.add(gridMesh);

        // Glowing blue ball
        const ballGeometry = new THREE.SphereGeometry(2, 32, 32);
        const ballMaterial = new THREE.MeshPhongMaterial({
            color: 0x0077ff,
            emissive: 0x0044aa,
            specular: 0x00aaff,
            shininess: 50,
        });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        scene.add(ball);

        // Subtle ball glow
        const ballGlowGeometry = new THREE.SphereGeometry(2.2, 32, 32);
        const ballGlowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { type: "f", value: 0.1 },
                p: { type: "f", value: 1.4 },
                glowColor: { type: "c", value: new THREE.Color(0x0077ff) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                varying float intensity;
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
                    intensity = pow( dot(normalize(viewVector), actual_normal), 6.0 );
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4( glow, 0.5 );
                }
            `,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        const ballGlow = new THREE.Mesh(ballGlowGeometry, ballGlowMaterial);
        scene.add(ballGlow);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // Font loading
        const fontLoader = new FontLoader();
        let font;

        fontLoader.load(
            'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
            function (loadedFont) {
                font = loadedFont;
            }
        );

        // Text particle group
        const streamGroup = new THREE.Group();
        scene.add(streamGroup);

        // Text material
        const textMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x003300,
            specular: 0x00ff00,
            shininess: 30
        });

        // Function to create a text mesh
        function createTextMesh(character) {
            if (!font) return null;

            const textGeometry = new TextGeometry(character, {
                font: font,
                size: 0.5,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: false,
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            return textMesh;
        }

        // Array to hold text particles
        const textParticles = [];

        // Function to create and spawn a text particle
        function createParticle() {
            const character = Math.random() < 0.5 ? '0' : '1';
            const particle = createTextMesh(character);
            if (particle)
            {
                particle.position.set(
                    (Math.random() - 0.5) * 2,
                    Math.random() * 20 + 2,
                    (Math.random() - 0.5) * 2
                );
                particle.rotation.x = Math.random() * Math.PI;
                particle.rotation.y = Math.random() * Math.PI;
                streamGroup.add(particle);
                particle.userData = {
                    velocity: new THREE.Vector3(0, 0, 0),
                    creationTime: Date.now(),
                };
                textParticles.push(particle);
            }
        }

        // Ball movement parameters
        let time = 0;
        const radius = 10;
        const height = 2;
        const speed = 1;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            time += 0.016; // Assuming 60 FPS

            // Update ball position (circular motion with vertical oscillation)
            ball.position.x = Math.cos(time * speed) * radius;
            ball.position.z = Math.sin(time * speed) * radius;
            ball.position.y = Math.sin(time * speed * 2) * height / 2 + height;

            // Update ball glow
            ballGlow.position.copy(ball.position);
            ballGlowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, ballGlow.position);

            const currentTime = Date.now();

            // Create new particles at a controlled rate
            if (Math.random() < 0.2)
            {
                createParticle();
            }

            // Update text particles
            for (let i = textParticles.length - 1; i >= 0; i--)
            {
                const particle = textParticles[i];

                // Calculate direction to the ball
                const directionToBall = new THREE.Vector3().subVectors(ball.position, particle.position);
                const distanceToBall = directionToBall.length();
                const gravitationalForce = directionToBall.normalize().multiplyScalar(0.5 / (distanceToBall * distanceToBall));

                // Update velocity with gravitational force
                particle.userData.velocity.add(gravitationalForce);
                // Update position with velocity
                particle.position.add(particle.userData.velocity);

                // Remove particle if it's too close to the ball or has existed for too long
                if (distanceToBall < 2 || currentTime - particle.userData.creationTime > 8000)
                {
                    streamGroup.remove(particle);
                    textParticles.splice(i, 1);
                }
            }

            // Update grid deformation based on ball's position
            const positions = gridGeometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3)
            {
                const x = positions[i];
                const z = positions[i + 2];
                const dx = x - ball.position.x;
                const dz = z - ball.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                const maxDepression = 10;
                const influence = 10;

                // Smooth, unified dent effect
                const deformation = maxDepression * Math.exp(-distance * distance / (2 * influence * influence));

                positions[i + 1] = -deformation;
            }
            gridGeometry.attributes.position.needsUpdate = true;
            gridGeometry.computeVertexNormals();

            // Rotate camera around the scene for a dynamic view
            const cameraRadius = 50;
            camera.position.x = Math.cos(time * 0.1) * cameraRadius;
            camera.position.z = Math.sin(time * 0.1) * cameraRadius;
            camera.lookAt(scene.position);

            composer.render();
        }

        animate();

        // Handle window resizing
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);
            // Dispose geometries and materials
            gridGeometry.dispose();
            gridMaterial.dispose();
            ballGeometry.dispose();
            ballMaterial.dispose();
            ballGlowGeometry.dispose();
            ballGlowMaterial.dispose();
            textParticles.forEach(particle => {
                if (particle.geometry) particle.geometry.dispose();
                if (particle.material) particle.material.dispose();
            });
        };

        // === THREE.JS EXAMPLE CODE END ===
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ThreeScene;