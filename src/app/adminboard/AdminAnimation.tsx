'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- Einzelner Partikel ---
function Particle({ index }: { index: number }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const angleOffset = Math.random() * Math.PI * 2
  const radius = 3 + Math.random() * 2
  const speed = 0.5 + Math.random() * 0.5
  const color = new THREE.Color(`hsl(${Math.random() * 360}, 80%, 60%)`)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const angle = angleOffset + t * speed
    mesh.current.position.x = Math.cos(angle) * radius
    mesh.current.position.y = Math.sin(angle) * radius
    mesh.current.position.z = Math.sin(angle * 3) * 1.5
    mesh.current.scale.setScalar(0.3 + Math.sin(t * 5 + index) * 0.2)
  })

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

export default function FiveSecondAnimation() {
  const router = useRouter()

  // Weiterleitung nach 5 Sekunden
  useEffect(() => {
    const timer = setTimeout(() => router.push('/adminboard'), 5000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 10]} intensity={1.5} color={'white'} />
        {Array.from({ length: 30 }, (_, i) => (
          <Particle key={i} index={i} />
        ))}
      </Canvas>
    </div>
  )
}
