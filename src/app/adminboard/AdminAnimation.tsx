'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import FixedFooter from '@/components/FixedFooter'

// --- Einzelnes Icon als 3D Objekt ---
function DiscordIcon({ position, texture }: { position: [number, number, number]; texture: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    // leichtes Schweben
    meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.1
  })
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  )
}

// --- Ruhiger Kamera Flug ---
function CameraFlight() {
  const { camera } = useThree()
  const t = useRef(0)
  useFrame((_, delta) => {
    t.current += delta * 0.05 // viel langsamer
    camera.position.x = Math.sin(t.current) * 8
    camera.position.y = Math.cos(t.current / 2) * 3
    camera.position.z = -t.current * 3 + 20
    camera.lookAt(0, 0, 0)
  })
  return null
}

// --- Dezenter Glowing Star ---
function GlowingStar() {
  const mesh = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.15 // weniger pulsierend
    mesh.current.scale.set(scale, scale, scale)
  })
  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        emissive={new THREE.Color(0xffffaa)}
        emissiveIntensity={1.2} // etwas schwächer
        color={'white'}
      />
    </mesh>
  )
}

export default function AdminAnimation() {
  const router = useRouter()
  const [windowHeight, setWindowHeight] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => router.push('/adminboard'), 10000)
    return () => clearTimeout(timer)
  }, [router])

  useEffect(() => {
    const updateHeight = () => setWindowHeight(window.innerHeight)
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const iconUrls = [
    '/icons/discord1.png',
    '/icons/discord2.png',
    '/icons/discord3.png',
    '/icons/discord4.png',
  ]
  const textures = iconUrls.map((url) => new THREE.TextureLoader().load(url))

  const iconPositions: [number, number, number][] = Array.from({ length: 30 }, () => [
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 15,
    -(Math.random() * 80),
  ])

  return (
    <div className="w-full">
      {/* --- Fullscreen Canvas --- */}
      <div
        className="fixed top-0 left-0 w-full"
        style={{ height: windowHeight, zIndex: 0 }}
      >
        <Canvas camera={{ position: [0, 0, 20], fov: 70 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 0]} intensity={1.5} color={'white'} />
          <Stars radius={120} depth={60} count={2000} factor={3} saturation={0} fade />
          <GlowingStar />
          {iconPositions.map((pos, i) => (
            <DiscordIcon key={i} position={pos} texture={textures[i % textures.length]} />
          ))}
          <CameraFlight />
        </Canvas>
      </div>

      {/* --- Scrollbereich für Footer --- */}
      <div style={{ marginTop: windowHeight, minHeight: '50vh' }}>
        <FixedFooter />
      </div>
    </div>
  )
}
