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
    meshRef.current.position.y += Math.sin(clock.getElapsedTime() + position[0]) * 0.002
    meshRef.current.rotation.z += 0.002
  })
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  )
}

// --- Kamera Flug ---
function CameraFlight() {
  const { camera } = useThree()
  const t = useRef(0)
  useFrame((_, delta) => {
    t.current += delta * 0.15
    camera.position.x = Math.sin(t.current) * 12
    camera.position.y = Math.cos(t.current / 2) * 6
    camera.position.z = -t.current * 6 + 20
    camera.lookAt(0, 0, 0)
  })
  return null
}

// --- Leuchtender Stern ---
function GlowingStar() {
  const mesh = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.3
    mesh.current.scale.set(scale, scale, scale)
  })
  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        emissive={new THREE.Color(0xffffaa)}
        emissiveIntensity={2}
        color={'white'}
      />
    </mesh>
  )
}

export default function AdminAnimation() {
  const router = useRouter()
  const [windowHeight, setWindowHeight] = useState(0)

  // Weiterleitung nach 10 Sekunden
  useEffect(() => {
    const timer = setTimeout(() => router.push('/adminboard'), 10000)
    return () => clearTimeout(timer)
  }, [router])

  // Fensterhöhe dynamisch
  useEffect(() => {
    const updateHeight = () => setWindowHeight(window.innerHeight)
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Discord Icon Textures
  const iconUrls = [
    '/icons/discord1.png',
    '/icons/discord2.png',
    '/icons/discord3.png',
    '/icons/discord4.png',
  ]
  const textures = iconUrls.map((url) => new THREE.TextureLoader().load(url))

  // Zufällige Positionen
  const iconPositions: [number, number, number][] = Array.from({ length: 40 }, () => [
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 20,
    -(Math.random() * 120),
  ])

  return (
    <div className="w-full">
      {/* --- Fullscreen Canvas --- */}
      <div
        className="fixed top-0 left-0 w-full"
        style={{ height: windowHeight, zIndex: 0 }}
      >
        <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 0]} intensity={3} color={'white'} />
          <Stars radius={150} depth={100} count={5000} factor={4} saturation={0} fade />
          <GlowingStar />
          {iconPositions.map((pos, i) => (
            <DiscordIcon key={i} position={pos} texture={textures[i % textures.length]} />
          ))}
          <CameraFlight />
        </Canvas>
      </div>

      {/* --- Platzhalter für Scrollbereich, damit Footer erst sichtbar wird --- */}
      <div style={{ marginTop: windowHeight, minHeight: '50vh' }}>
        <FixedFooter />
      </div>
    </div>
  )
}
