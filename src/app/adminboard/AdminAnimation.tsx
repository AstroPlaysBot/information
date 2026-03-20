'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

interface AdminAnimationProps {
  onFinish?: () => void
}

function createCircleTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(size/2, size/2, 5, size/2, size/2, size/2)
  gradient.addColorStop(0,'white')
  gradient.addColorStop(0.4,'white')
  gradient.addColorStop(1,'transparent')

  ctx.fillStyle = gradient
  ctx.fillRect(0,0,size,size)

  return new THREE.CanvasTexture(canvas)
}

function ParticleSystem({ targets }: { targets: THREE.Vector3[] }) {
  const points = useRef<THREE.Points>(null!)

  const count = Math.max(targets.length, 4000) // mehr Partikel, falls zu wenig
  const texture = useMemo(() => createCircleTexture(), [])

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for(let i=0;i<count;i++){
      arr[i*3]=(Math.random()-0.5)*40
      arr[i*3+1]=(Math.random()-0.5)*20
      arr[i*3+2]=(Math.random()-0.5)*20
    }
    return arr
  }, [count])

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for(let i=0;i<count;i++){
      const hue = Math.random()
      const color = new THREE.Color().setHSL(hue,0.9,0.5)
      arr[i*3]=color.r
      arr[i*3+1]=color.g
      arr[i*3+2]=color.b
    }
    return arr
  }, [count])

  const startPositions = useMemo(() => {
    const arr: THREE.Vector3[]=[]
    for(let i=0;i<count;i++){
      arr.push(new THREE.Vector3(positions[i*3],positions[i*3+1],positions[i*3+2]))
    }
    return arr
  },[count,positions])

  useFrame((state)=>{
    if(!points.current) return
    const t=state.clock.getElapsedTime()
    const pos=points.current.geometry.attributes.position.array as Float32Array
    const morphStart=3, morphEnd=9
    const morphProgress = THREE.MathUtils.clamp((t-morphStart)/(morphEnd-morphStart),0,1)
    for(let i=0;i<count;i++){
      const start=startPositions[i]
      const target=targets[i] || new THREE.Vector3((Math.random()-0.5)*40,(Math.random()-0.5)*20,(Math.random()-0.5)*20)
      let x=start.x+Math.sin(t+i)*0.4
      let y=start.y+Math.cos(t*0.7+i)*0.4
      let z=start.z+Math.sin(t*0.5+i)*0.4

      x=THREE.MathUtils.lerp(x,target.x,morphProgress)
      y=THREE.MathUtils.lerp(y,target.y,morphProgress)
      z=THREE.MathUtils.lerp(z,target.z,morphProgress)

      pos[i*3]=x
      pos[i*3+1]=y
      pos[i*3+2]=z
    }
    points.current.geometry.attributes.position.needsUpdate=true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3}/>
      </bufferGeometry>
      <pointsMaterial size={0.25} vertexColors map={texture} transparent depthWrite={false} blending={THREE.AdditiveBlending}/>
    </points>
  )
}

function CameraFlight() {
  useFrame((state)=>{
    const t=state.clock.getElapsedTime()
    const cam=state.camera
    cam.position.z = Math.max(10, 45-t*5)
    cam.lookAt(0,0,0)
  })
  return null
}

export default function AdminAnimation({onFinish}:AdminAnimationProps){
  const [targets,setTargets]=useState<THREE.Vector3[]>([])
  const [showText,setShowText]=useState(false)

  useEffect(()=>{const timer=setTimeout(()=>onFinish?.(),12000);return ()=>clearTimeout(timer)},[onFinish])
  useEffect(()=>{const timer=setTimeout(()=>setShowText(true),3000);return ()=>clearTimeout(timer)},[])

  useEffect(()=>{
    const canvas=document.createElement('canvas')
    const ctx=canvas.getContext('2d')!
    const width=800 // kleineres Canvas, alles sichtbar
    const height=200
    canvas.width=width
    canvas.height=height
    ctx.fillStyle='white'
    ctx.font='bold 120px Arial' // kleinerer Text
    ctx.textAlign='center'
    ctx.textBaseline='middle'
    ctx.fillText('ASTROPLAYS',width/2,height/2)

    const img=ctx.getImageData(0,0,width,height).data
    const temp:THREE.Vector3[]=[]
    for(let y=0;y<height;y+=2){
      for(let x=0;x<width;x+=2){
        const i=(y*width+x)*4
        if(img[i+3]>128) temp.push(new THREE.Vector3((x-width/2)/20,-(y-height/2)/20,0))
      }
    }
    setTargets(temp)
  },[])

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas camera={{position:[0,0,45],fov:70}} style={{width:'100%',height:'100%'}}>
        <ambientLight intensity={0.5}/>
        {targets.length>0 && <ParticleSystem targets={targets}/>}
        <CameraFlight/>
      </Canvas>

      <div className={`absolute top-20 w-full text-center text-white text-4xl font-bold transition-opacity duration-3000 ease-in-out ${showText?'opacity-100':'opacity-0'}`}>
        Willkommen bei
      </div>

      <button onClick={()=>onFinish?.()} className="absolute bottom-8 right-8 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition text-sm">
        Überspringen
      </button>
    </div>
  )
}
