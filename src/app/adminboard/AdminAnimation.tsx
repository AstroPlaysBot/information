'use client'
import { useEffect, useRef } from 'react'

interface AdminAnimationProps {
  onFinish?: () => void
}

export default function AdminAnimation({ onFinish }: AdminAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const finishedRef = useRef(false)

  function finish() {
    if (finishedRef.current) return
    finishedRef.current = true
    if (stageRef.current) {
      stageRef.current.style.transition = 'opacity 0.5s'
      stageRef.current.style.opacity = '0'
    }
    setTimeout(() => onFinish?.(), 500)
  }

  useEffect(() => {
    const canvas = canvasRef.current!
    const stage = stageRef.current!
    const logoEl = logoRef.current!
    const taglineEl = taglineRef.current!
    const ctx = canvas.getContext('2d')!

    let W = 0, H = 0, cx = 0, cy = 0
    function resize() {
      W = canvas.width = stage.offsetWidth
      H = canvas.height = stage.offsetHeight
      cx = W / 2; cy = H / 2
    }
    resize()

    let rocketX = 0
    let rocketY = 0

    rocketX = W + 80
    rocketY = H * 0.75
    
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * Math.PI * 2
    }))

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number; color: string }
    let trailParticles: Particle[] = []
    let cloudParticles: Particle[] = []

    //let rocketX = W + 80, rocketY = H * 0.75
    let rocketVX = -9, rocketVY = -2.5
    let phase = 'enter'
    let explodeT = 0
    let logoShown = false
    let frame = 0
    let rafId: number

    function drawStars(t: number) {
      stars.forEach(s => {
        const alpha = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle + t * 0.001))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      })
    }

    function drawRocket(x: number, y: number, angle: number) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)

      const flameGrad = ctx.createRadialGradient(-22, 0, 1, -28, 0, 14)
      flameGrad.addColorStop(0, 'rgba(255,220,80,0.95)')
      flameGrad.addColorStop(0.4, 'rgba(255,120,30,0.7)')
      flameGrad.addColorStop(1, 'rgba(255,60,0,0)')
      ctx.beginPath()
      ctx.ellipse(-26, 0, 14, 7, 0, 0, Math.PI * 2)
      ctx.fillStyle = flameGrad
      ctx.fill()

      const bodyGrad = ctx.createLinearGradient(0, -12, 0, 12)
      bodyGrad.addColorStop(0, '#e0e8ff')
      bodyGrad.addColorStop(0.5, '#b8c8f0')
      bodyGrad.addColorStop(1, '#8899cc')
      ctx.beginPath()
      ctx.moveTo(18, 0); ctx.lineTo(-14, -10)
      ctx.lineTo(-18, 0); ctx.lineTo(-14, 10)
      ctx.closePath()
      ctx.fillStyle = bodyGrad; ctx.fill()

      ctx.beginPath()
      ctx.moveTo(18, 0)
      ctx.quadraticCurveTo(30, -5, 34, 0)
      ctx.quadraticCurveTo(30, 5, 18, 0)
      ctx.fillStyle = '#6888ee'; ctx.fill()

      ctx.beginPath(); ctx.arc(8, 0, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#4af'; ctx.fill()
      ctx.beginPath(); ctx.arc(6, -2, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fill()

      ctx.beginPath(); ctx.moveTo(-14, -10); ctx.lineTo(-22, -18); ctx.lineTo(-18, 0)
      ctx.fillStyle = '#7888dd'; ctx.fill()
      ctx.beginPath(); ctx.moveTo(-14, 10); ctx.lineTo(-22, 18); ctx.lineTo(-18, 0)
      ctx.fillStyle = '#7888dd'; ctx.fill()
      ctx.restore()
    }

    function drawCloud(list: Particle[]) {
      list.forEach(p => {
        const progress = 1 - p.life / p.maxLife
        const alpha = (1 - progress) * 0.55
        const size = p.size * (0.5 + progress * 1.5)
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace('ALPHA', alpha.toFixed(2))
        ctx.fill()
      })
    }

    function spawnCloudBurst(x: number, y: number) {
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 4 + 1
        cloudParticles.push({
          x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed * 0.5,
          size: Math.random() * 18 + 8, life: 80 + Math.random() * 60,
          maxLife: 140, color: Math.random() < 0.5 ? 'rgba(168,85,247,ALPHA)' : 'rgba(200,170,255,ALPHA)'
        })
      }
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2.5
        cloudParticles.push({
          x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed * 0.3 - 0.5,
          size: Math.random() * 22 + 10, life: 70 + Math.random() * 40, maxLife: 110,
          color: 'rgba(230,220,255,ALPHA)'
        })
      }
    }

    function animate() {
      if (finishedRef.current) return
      rafId = requestAnimationFrame(animate)
      frame++
      ctx.clearRect(0, 0, W, H)
      drawStars(frame)

      if (phase === 'enter' || phase === 'cruise') {
        rocketX += rocketVX; rocketY += rocketVY

        if (frame % 2 === 0) {
          for (let i = 0; i < 5; i++) {
            const life = 35 + Math.random() * 25
            trailParticles.push({
              x: rocketX - 20 + (Math.random() - 0.5) * 8,
              y: rocketY + (Math.random() - 0.5) * 8,
              vx: (Math.random() - 0.5) * 0.6 + 1.5,
              vy: (Math.random() - 0.5) * 0.8,
              size: Math.random() * 10 + 6, life, maxLife: life,
              color: Math.random() < 0.6 ? 'rgba(168,85,247,ALPHA)' : 'rgba(120,150,255,ALPHA)'
            })
          }
        }

        trailParticles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life--; p.vy += 0.04 })
        trailParticles = trailParticles.filter(p => p.life > 0)
        drawCloud(trailParticles)

        const angle = Math.atan2(rocketVY, rocketVX)
        drawRocket(rocketX, rocketY, angle)

        if (phase === 'enter' && rocketX < cx + 60) {
          phase = 'cruise'
          rocketVX *= 0.7; rocketVY *= 0.7
        }
        if (phase === 'cruise') {
          rocketVX *= 0.97; rocketVY *= 0.97
          if (Math.abs(rocketVX) < 0.3 && Math.abs(rocketVY) < 0.3) {
            phase = 'explode'
            spawnCloudBurst(rocketX, rocketY)
          }
        }
      }

      if (phase === 'explode') {
        explodeT++
        cloudParticles.forEach(p => {
          p.x += p.vx; p.y += p.vy
          p.vx *= 0.97; p.vy *= 0.97
          p.life--
        })
        cloudParticles = cloudParticles.filter(p => p.life > 0)
        drawCloud(cloudParticles)

        if (explodeT < 20) {
          ctx.save()
          ctx.globalAlpha = 1 - explodeT / 20
          drawRocket(rocketX, rocketY, 0)
          ctx.restore()
        }

        if (explodeT === 30 && !logoShown) {
          logoShown = true
          logoEl.style.opacity = '1'
          logoEl.style.transform = 'translateY(0)'
          setTimeout(() => { taglineEl.style.opacity = '1' }, 500)
          setTimeout(finish, 2800)
        }
      }
    }

    animate()
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div
      ref={stageRef}
      className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        ref={logoRef}
        style={{
          opacity: 0,
          transform: 'translateY(10px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: 900,
          letterSpacing: '4px',
          color: '#fff',
          textShadow: '0 0 30px rgba(160,100,255,0.8), 0 0 60px rgba(160,100,255,0.4)',
          whiteSpace: 'nowrap',
          position: 'absolute',
          zIndex: 2
        }}
      >
        ASTRO<span style={{ color: '#a855f7' }}>PLAYS</span>
      </div>
      <div
        ref={taglineRef}
        style={{
          opacity: 0,
          transition: 'opacity 0.8s ease',
          position: 'absolute',
          bottom: '90px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          letterSpacing: '6px',
          color: 'rgba(168,85,247,0.8)',
          textTransform: 'uppercase',
          zIndex: 2
        }}
      >
        Play · Manage · Level Up
      </div>
      <button
        onClick={finish}
        style={{
          position: 'absolute', bottom: 18, right: 18,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.6)',
          padding: '6px 14px', borderRadius: 8,
          fontSize: 12, cursor: 'pointer', zIndex: 10
        }}
      >
        Überspringen
      </button>
    </div>
  )
}
