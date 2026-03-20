'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface ParticleData {
  start: THREE.Vector3
  target: THREE.Vector3
  offset: number
}

function ParticleSystem({ targets }: { targets: THREE.Vector3[] }) {
  const points = useRef<THREE.Points>(null!)
  const startTime = useRef<number>(0)

  const particleCount = Math.min(targets.length, 800)

  const particles: ParticleData[] = []

  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const start = new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 20
    )

    particles.push({
      start,
      target: targets[i],
      offset: Math.random() * 10
    })

    positions[i * 3] = start.x
    positions[i * 3 + 1] = start.y
    positions[i * 3 + 2] = start.z
  }

  useFrame((state) => {
    if (!points.current) return

    const t = state.clock.getElapsedTime()

    if (startTime.current === 0) startTime.current = t

    const elapsed = t - startTime.current

    const pos = points.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i]

      let x = p.start.x
      let y = p.start.y
      let z = p.start.z

      // Phase 1: Kreisen (0-5s)
      if (elapsed < 5) {
        x += Math.sin(t + p.offset) * 1.2
        y += Math.cos(t * 0.8 + p.offset) * 1.2
      }

      // Phase 2: Zum Text bewegen (5-8s)
      else {
        const progress = Math.min((elapsed - 5) / 3, 1)

        x = THREE.MathUtils.lerp(
          p.start.x,
          p.target.x,
          progress
        )

        y = THREE.MathUtils.lerp(
          p.start.y,
          p.target.y,
          progress
        )

        z = THREE.MathUtils.lerp(
          p.start.z,
          p.target.z,
          progress
        )
      }

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
    }

    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.18}
        color="#6cf0ff"
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function CameraFlight() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    const cam = state.camera

    // Kamera Zoom (0-6s)
    if (t < 6) {
      cam.position.z = 25 - t * 3
    }

    cam.lookAt(0, 0, 0)
  })

  return null
}

export default function AdminAnimation() {
  const router = useRouter()
  const [targets, setTargets] = useState<THREE.Vector3[]>([])
  const [showText, setShowText] = useState(false)
  const [glow, setGlow] = useState(false)

  // Redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/adminboard')
    }, 12500)

    return () => clearTimeout(timer)
  }, [router])

  // Text fade in
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Glow Effekt
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlow(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  // Text → Partikel Ziele
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const width = 800
    const height = 200

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = 'white'
    ctx.font = 'bold 150px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillText('ASTROPLAYS', width / 2, height / 2)

    const imageData = ctx.getImageData(0, 0, width, height)

    const pixels = imageData.data

    const temp: THREE.Vector3[] = []

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const i = (y * width + x) * 4

        if (pixels[i + 3] > 128) {
          temp.push(
            new THREE.Vector3(
              (x - width / 2) / 30,
              -(y - height / 2) / 30,
              0
            )
          )
        }
      }
    }

    setTargets(temp)
  }, [])

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">

      <Canvas camera={{ position: [0, 0, 25], fov: 70 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 10]} intensity={2} />

        {targets.length > 0 && <ParticleSystem targets={targets} />}

        <CameraFlight />
      </Canvas>

      {/* Willkommen Text */}
      <div
        className={`absolute top-20 w-full text-center text-white text-4xl font-bold transition-opacity duration-[3000ms] ${
          showText ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Willkommen bei
      </div>

      {/* AstroPlays Glow */}
      <div
        className={`absolute top-32 w-full text-center text-6xl font-bold transition-all duration-1000 ${
          glow
            ? 'text-cyan-300 drop-shadow-[0_0_30px_#00eaff]'
            : 'text-transparent'
        }`}
      >
        ASTROPLAYS
      </div>

      {/* Überspringen Button */}
      <button
        onClick={() => router.push('/adminboard')}
        className="absolute bottom-8 right-8 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition text-sm"
      >
        Überspringen
      </button>
    </div>
  )
}
