"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useControls, Leva } from 'leva'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
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
  uniform float uGradientSmoothness;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uLightPosition;
  uniform float uSpecularStrength;
  uniform float uShininess;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

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

  // Calculate normals from noise for consistent shadows
  vec3 calculateNormal(vec2 uv, float scale) {
    float eps = 0.005;
    float heightL = snoise((uv + vec2(-eps, 0.0)) * scale + uTime * uNoiseSpeed);
    float heightR = snoise((uv + vec2(eps, 0.0)) * scale + uTime * uNoiseSpeed);
    float heightD = snoise((uv + vec2(0.0, -eps)) * scale + uTime * uNoiseSpeed);
    float heightU = snoise((uv + vec2(0.0, eps)) * scale + uTime * uNoiseSpeed);
    vec3 normal = normalize(vec3(heightL - heightR, heightD - heightU, 1.0));
    return normal;
  }

  void main() {
    vec2 uv = vUv;
    float noise = snoise(uv * uNoiseScale + uTime * uNoiseSpeed);
    
    // Create bump effect tied to the noise
    float bump = noise * uBumpStrength;
    
    // Control blob connections and smoothness
    float connection = smoothstep(uThreshold - uBlobConnection, uThreshold + uBlobConnection, noise);
    
    // Blend colors smoothly using gradient smoothness
    float gradientFactor = smoothstep(0.0, 1.0, pow(noise * connection + bump, uGradientSmoothness));
    vec3 blendedColor = mix(uColor1, uColor2, gradientFactor);
    blendedColor *= uColorIntensity;

    // Calculate consistent normal from noise for 3D effect
    vec3 normal = calculateNormal(uv, uNoiseScale * uBumpStrength);
    
    // Lighting calculations for cohesive shiny and shadowed surface
    vec3 lightDir = normalize(uLightPosition - vWorldPosition);
    float diff = max(dot(normal, lightDir), 0.0);

    // Specular highlights for glossy effect
    vec3 viewDir = normalize(-vWorldPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess) * uSpecularStrength;
    
    // Combine diffuse and specular lighting on the gradient surface
    vec3 lighting = blendedColor * diff + vec3(1.0) * spec;

    gl_FragColor = vec4(lighting, 1.0);
  }
`

function GoopField() {
  const mesh = useRef()
  const { viewport } = useThree()
  const uniforms = useRef({
    uTime: { value: 0 },
    uNoiseScale: { value: 3 },
    uNoiseSpeed: { value: 0.2 },
    uBumpStrength: { value: 1.0 },
    uBlobConnection: { value: 0.1 },
    uThreshold: { value: 0.5 },
    uColorIntensity: { value: 1.5 },
    uGradientSmoothness: { value: 1.0 },
    uColor1: { value: new THREE.Color(0xff0000) }, // Adjust for red
    uColor2: { value: new THREE.Color(0x2e0000) },
    uLightPosition: { value: new THREE.Vector3(5, 5, 5) },
    uSpecularStrength: { value: 1.0 },
    uShininess: { value: 32.0 }
  })

  const {
    noiseScale,
    noiseSpeed,
    bumpStrength,
    blobConnection,
    threshold,
    colorIntensity,
    gradientSmoothness,
    specularStrength,
    shininess,
    color1,
    color2,
    lightX,
    lightY,
    lightZ
  } = useControls({
    noiseScale: { value: 3, min: 0.1, max: 100, step: 0.1 },
    noiseSpeed: { value: 0.2, min: 0.01, max: 2, step: 0.01 },
    bumpStrength: { value: 1.0, min: 0, max: 2, step: 0.01 },
    blobConnection: { value: 0.1, min: 0, max: 1, step: 0.01 },
    threshold: { value: 0.5, min: 0, max: 1, step: 0.01 },
    colorIntensity: { value: 1.5, min: 0.5, max: 3, step: 0.1 },
    gradientSmoothness: { value: 1.0, min: 0.1, max: 5.0, step: 0.1 },
    specularStrength: { value: 1.0, min: 0, max: 1, step: 0.01 },
    shininess: { value: 32.0, min: 0, max: 64, step: 1 },
    lightX: { value: 5, min: -10, max: 10, step: 0.1 },
    lightY: { value: 5, min: -10, max: 10, step: 0.1 },
    lightZ: { value: 5, min: -10, max: 10, step: 0.1 },
    color1: '#ff0000', // Bright red
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
      mesh.current.material.uniforms.uGradientSmoothness.value = gradientSmoothness
      mesh.current.material.uniforms.uSpecularStrength.value = specularStrength
      mesh.current.material.uniforms.uShininess.value = shininess
      mesh.current.material.uniforms.uColor1.value = new THREE.Color(color1)
      mesh.current.material.uniforms.uColor2.value = new THREE.Color(color2)
      mesh.current.material.uniforms.uLightPosition.value = new THREE.Vector3(lightX, lightY, lightZ)
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
