'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

// --- Einzelnes Icon als 3D Objekt ---
function DiscordIcon({ position, texture }: { position: [number, number, number], texture: THREE.Texture }) {
  return (
    <mesh position={position}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  )
}

// --- Kamera Flug entlang einer Kurve ---
function CameraFlight() {
  const { camera } = useThree()
  const t = useRef(0)
  useFrame((state, delta) => {
    t.current += delta * 0.2 // Geschwindigkeit
    // einfache spiralförmige Kurve durch den Weltraum
    camera.position.x = Math.sin(t.current) * 10
    camera.position.y = Math.cos(t.current / 2) * 5
    camera.position.z = -t.current * 5 + 20
    camera.lookAt(0, 0, 0) // Fokus auf Stern
  })
  return null
}

// --- Leuchtender Stern in der Mitte ---
function GlowingStar() {
  const mesh = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.3
    mesh.current.scale.set(scale, scale, scale)
  })
  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial emissive={new THREE.Color(0xffffaa)} emissiveIntensity={2} color={'white'} />
    </mesh>
  )
}

export default function AdminAnimation() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => router.push('/adminboard'), 10000)
    return () => clearTimeout(timer)
  }, [router])

  // --- Discord Icons Textures laden ---
  const iconUrls = [
    '/icons/discord1.png',
    '/icons/discord2.png',
    '/icons/discord3.png',
    '/icons/discord4.png',
  ]
  const textures = iconUrls.map((url) => new THREE.TextureLoader().load(url))

  // zufällige Positionen für Icons
  const iconPositions: [number, number, number][] = Array.from({ length: 30 }, () => [
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 20,
    -(Math.random() * 100),
  ])

  return (
    <div className="absolute inset-0 w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={3} color={'white'} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <GlowingStar />
        {iconPositions.map((pos, i) => (
          <DiscordIcon key={i} position={pos} texture={textures[i % textures.length]} />
        ))}
        <CameraFlight />
      </Canvas>
    </div>
  )
}
