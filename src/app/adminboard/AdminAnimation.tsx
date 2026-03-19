'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- Einzelnes Icon als 3D Objekt ---
function DiscordIcon({ position, texture }: { position: [number, number, number]; texture: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    // leichtes Schweben und Rotation
    meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.1
    meshRef.current.rotation.y += 0.001
  })
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  )
}

// --- Dezenter Hintergrund-Stern ---
function GlowingStar() {
  const mesh = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.1
    mesh.current.scale.set(scale, scale, scale)
  })
  return (
    <mesh ref={mesh} position={[0, 0, -10]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial emissive={new THREE.Color(0xffffaa)} emissiveIntensity={1.2} color={'white'} />
    </mesh>
  )
}

export default function LoadingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)

  // Fensterhöhe dynamisch
  useEffect(() => {
    const updateHeight = () => setWindowHeight(window.innerHeight)
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Ladebalken Fortschritt
  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const randomIncrement = Math.random() * 2
      setProgress((prev) => Math.min(prev + randomIncrement, 100))
      if (elapsed >= 10000) setProgress(100) // nach 10 Sekunden voll
    }, 100)
    const timer = setTimeout(() => router.push('/adminboard'), 10000)
    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [router])

  // Discord Icon Textures
  const iconUrls = [
    '/icons/discord1.png',
    '/icons/discord2.png',
    '/icons/discord3.png',
    '/icons/discord4.png',
  ]
  const textures = iconUrls.map((url) => new THREE.TextureLoader().load(url))

  const iconPositions: [number, number, number][] = Array.from({ length: 25 }, () => [
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 15,
    -(Math.random() * 50),
  ])

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {/* --- 3D Hintergrund --- */}
      <Canvas camera={{ position: [0, 0, 15], fov: 70 }} className="absolute inset-0">
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={1.5} color={'white'} />
        <GlowingStar />
        {iconPositions.map((pos, i) => (
          <DiscordIcon key={i} position={pos} texture={textures[i % textures.length]} />
        ))}
      </Canvas>

      {/* --- Overlay Content --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-8">Willkommen bei AstroPlays</h1>
        
        {/* Ladebalken Container */}
        <div className="w-full max-w-xl h-6 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-gray-300">{Math.floor(progress)}%</p>
      </div>
    </div>
  )
}
