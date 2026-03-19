'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleProps {
  index: number
  targets: THREE.Vector3[]
}

function Particle({ index, targets }: ParticleProps) {
  const mesh = useRef<THREE.Mesh>(null!)
  const color = new THREE.Color(`hsl(${Math.random() * 360}, 80%, 60%)`)

  const [target, setTarget] = useState<THREE.Vector3>(
    targets[Math.floor(Math.random() * targets.length)]
  )
  const [progress, setProgress] = useState(0)

  useFrame(({ clock, delta }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()

    // Schweben bevor Bewegung zum Ziel
    if (progress < 1) {
      mesh.current.position.x += (target.x - mesh.current.position.x) * 0.02
      mesh.current.position.y += (target.y - mesh.current.position.y) * 0.02
      mesh.current.position.z += (target.z - mesh.current.position.z) * 0.02
      setProgress(progress + 0.01)
    } else {
      // kleine Schwebebewegung auf der Stelle
      mesh.current.position.x += Math.sin(t + index) * 0.002
      mesh.current.position.y += Math.cos(t + index * 0.5) * 0.002
    }

    mesh.current.scale.setScalar(0.2 + Math.sin(t * 5 + index) * 0.1)
  })

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

export default function TextParticleAnimation() {
  const router = useRouter()
  const [targets, setTargets] = useState<THREE.Vector3[]>([])

  // Weiterleitung nach 5 Sekunden
  useEffect(() => {
    const timer = setTimeout(() => router.push('/adminboard'), 5000)
    return () => clearTimeout(timer)
  }, [router])

  // Text in Partikel-Ziele umwandeln
  useEffect(() => {
    const offCanvas = document.createElement('canvas')
    const ctx = offCanvas.getContext('2d')!
    const width = 400
    const height = 100
    offCanvas.width = width
    offCanvas.height = height

    ctx.fillStyle = 'white'
    ctx.font = 'bold 60px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('ASTROPLAYS', width / 2, height / 2)

    const imageData = ctx.getImageData(0, 0, width, height)
    const pixels = imageData.data
    const tempTargets: THREE.Vector3[] = []

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const i = (y * width + x) * 4
        if (pixels[i + 3] > 128) {
          // Alpha > 128 → Pixel sichtbar
          tempTargets.push(
            new THREE.Vector3((x - width / 2) / 20, -(y - height / 2) / 20, (Math.random() - 0.5) * 2)
          )
        }
      }
    }

    setTargets(tempTargets)
  }, [])

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 10]} intensity={1.5} color={'white'} />
        {targets.length > 0 &&
          Array.from({ length: Math.min(300, targets.length) }, (_, i) => (
            <Particle key={i} index={i} targets={targets} />
          ))}
      </Canvas>

      {/* Text oben */}
      <div className="absolute top-16 w-full text-center text-white text-4xl font-bold select-none">
        Willkommen bei AstroPlays
      </div>

      {/* Überspringen Button */}
      <button
        onClick={() => router.push('/adminboard')}
        className="absolute bottom-8 right-8 px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors select-none"
      >
        Überspringen
      </button>
    </div>
  )
}
