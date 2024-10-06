"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useControls, Leva } from 'leva'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uNoiseScale;
  uniform float uNoiseSpeed;
  uniform float uBumpStrength;
  uniform float uBlobConnection;
  uniform float uThreshold;
  uniform float uColorIntensity;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec2 vUv;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float noise = snoise(uv * uNoiseScale + uTime * uNoiseSpeed);
    
    // Create bump effect
    float bump = snoise(uv * uNoiseScale * 2.0 + uTime * uNoiseSpeed * 1.5) * uBumpStrength;
    
    // Control blob connections
    float connection = smoothstep(uThreshold - uBlobConnection, uThreshold + uBlobConnection, noise);
    
    // Mix colors based on noise, bump, and connection
    vec3 color = mix(uColor1, uColor2, noise * connection + bump);
    
    // Add intensity
    color *= uColorIntensity;
    
    // Output color directly without any black background
    gl_FragColor = vec4(color, 1.0);
  }
`

function GoopField() {
  const mesh = useRef()
  const { viewport } = useThree()
  const uniforms = useRef({
    uTime: { value: 0 },
    uNoiseScale: { value: 3 },
    uNoiseSpeed: { value: 0.1 },
    uBumpStrength: { value: 0.2 },
    uBlobConnection: { value: 0.1 },
    uThreshold: { value: 0.5 },
    uColorIntensity: { value: 1.2 },
    uColor1: { value: new THREE.Color(0x8b0000) },
    uColor2: { value: new THREE.Color(0x2e0000) },
  })

  const {
    noiseScale,
    noiseSpeed,
    bumpStrength,
    blobConnection,
    threshold,
    colorIntensity,
    color1,
    color2
  } = useControls({
    noiseScale: { value: 3, min: 0.1, max: 100, step: 0.1 },
    noiseSpeed: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    bumpStrength: { value: 0.2, min: 0, max: 1, step: 0.01 },
    blobConnection: { value: 0.1, min: 0, max: 1, step: 0.01 },
    threshold: { value: 0.5, min: 0, max: 1, step: 0.01 },
    colorIntensity: { value: 1.2, min: 0.5, max: 2, step: 0.1 },
    color1: '#8b0000',
    color2: '#2e0000'
  })

  useFrame((state) => {
    const { clock } = state
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = clock.getElapsedTime()
      mesh.current.material.uniforms.uNoiseScale.value = noiseScale
      mesh.current.material.uniforms.uNoiseSpeed.value = noiseSpeed
      mesh.current.material.uniforms.uBumpStrength.value = bumpStrength
      mesh.current.material.uniforms.uBlobConnection.value = blobConnection
      mesh.current.material.uniforms.uThreshold.value = threshold
      mesh.current.material.uniforms.uColorIntensity.value = colorIntensity
      mesh.current.material.uniforms.uColor1.value = new THREE.Color(color1)
      mesh.current.material.uniforms.uColor2.value = new THREE.Color(color2)
    }
  })

  useEffect(() => {
    if (mesh.current) {
      mesh.current.scale.set(viewport.width, viewport.height, 1)
    }
  }, [viewport])

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

function Scene() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.z = 1
  }, [camera])

  return <GoopField />
}

export default function Page() {
  const [showSettings, setShowSettings] = useState(true)

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Canvas>
        <Scene />
      </Canvas>
      <div className="absolute top-4 right-4 z-10">
        <button
          className="bg-white bg-opacity-50 hover:bg-opacity-75 text-black font-bold py-2 px-4 rounded"
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
      </div>
      <div className={`absolute top-16 right-4 z-10 transition-opacity duration-300 ${showSettings ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Leva oneLineLabels flat fill />
      </div>
    </div>
  )
}
