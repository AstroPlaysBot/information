'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- Einzelnes Icon als 3D Objekt ---
function DiscordIcon({ position, texture }: { position: [number, number, number]; texture: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const velocity = useRef([Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005])
  
  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    
    mesh.position.x += velocity.current[0]
    mesh.position.y += velocity.current[1]
    mesh.position.z += velocity.current[2]

    // sanft zurücksetzen, falls es zu weit weg fliegt
    for (let i = 0; i < 3; i++) {
      if (Math.abs(mesh.position.getComponent(i)) > 25) velocity.current[i] *= -1
    }

    mesh.rotation.y += 0.0005
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} transparent />
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
      const randomIncrement = Math.random() * 1.5
      setProgress((prev) => Math.min(prev + randomIncrement, 100))
      if (elapsed >= 10000) setProgress(100)
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
        <pointLight position={[0, 0, 0]} intensity={1.2} color={'white'} />
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
