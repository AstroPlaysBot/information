'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Stars } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function CameraFlight() {
  const group = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    const cam = state.camera

    if (t < 4) {
      cam.position.z = 20 - t * 4
      cam.position.y = Math.sin(t) * 0.5
      cam.lookAt(0, 0, 0)
    } else {
      cam.position.z = 4
      cam.lookAt(0, 0, 0)
    }

    if (group.current) {
      group.current.rotation.y = t * 0.2
    }
  })

  return (
    <group ref={group}>
      <Text
        fontSize={2}
        letterSpacing={0.05}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        ASTROPLAYS
        <meshStandardMaterial
          color="#6cf0ff"
          emissive="#00eaff"
          emissiveIntensity={2}
        />
      </Text>
    </group>
  )
}

function FloatingParticles() {
  const particles = useRef<THREE.Points>(null!)

  const count = 1500

  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60
  }

  useFrame((state) => {
    if (!particles.current) return
    particles.current.rotation.y += 0.0008
    particles.current.rotation.x += 0.0004
  })

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.15}
        color="#6cf0ff"
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default function AdminAnimation() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/adminboard')
    }, 6000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">

      <Canvas camera={{ position: [0, 0, 20], fov: 70 }}>
        <ambientLight intensity={0.5} />

        <pointLight position={[0, 0, 10]} intensity={3} />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />

        <FloatingParticles />

        <CameraFlight />
      </Canvas>

      <div className="absolute top-16 w-full text-center text-white text-4xl font-bold tracking-widest">
        Willkommen bei AstroPlays
      </div>

      <button
        onClick={() => router.push('/adminboard')}
        className="absolute bottom-10 right-10 px-5 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
      >
        Überspringen
      </button>

    </div>
  )
}
