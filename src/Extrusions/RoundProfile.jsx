import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

export default function RoundProfile({ scale = 1, exportRef, material }) {
  const meshRef = useRef()
  const geomRef = useRef()
  
  // Live controls
  const controls = useControls('RoundProfile', {
    d: { value: 50, min: 5, max: 100, step: 0.1, label: 'Extrusion' },
    radius: { value: 10, min: 1, max: 50, step: 0.1, label: 'Radius' },
    wt: { value: 1.2, min: 0.1, max: 20, step: 0.1, label: 'Wall thickness' }
  })
  
  // Vloeiende waarden
  const [smoothD, setSmoothD] = useState(controls.d)
  const [smoothRadius, setSmoothRadius] = useState(controls.radius)
  const [smoothWT, setSmoothWT] = useState(controls.wt)
  
  // Zorg dat wt nooit > radius / 2
  useEffect(() => {
    if (controls.wt > controls.radius / 2) {
      controls.wt = controls.radius / 2
    }
  }, [controls.radius, controls.wt])
  
  // Material
  useEffect(() => {
    if (meshRef.current && material) {
      meshRef.current.material = material
    }
  }, [material])

  // Interpolatie elke frame
  useFrame(() => {
    setSmoothD(prev => prev + (controls.d - prev) * 0.1)
    setSmoothRadius(prev => prev + (controls.radius - prev) * 0.1)
    setSmoothWT(prev => prev + (Math.min(controls.wt, controls.radius / 2) - prev) * 0.1)
    
    if (meshRef.current) {
      // update geometry
      const shape = new THREE.Shape()
      shape.absarc(0, 0, smoothRadius, 0, Math.PI * 2, false)
      const innerRadius = Math.max(smoothRadius - smoothWT, 0.01)
      const hole = new THREE.Path()
      hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true)
      shape.holes.push(hole)
      
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: smoothD,
        bevelEnabled: false,
        curveSegments: 64
      })
      
      // Dispose oude geometry
      if (geomRef.current) geomRef.current.dispose()
      meshRef.current.geometry = geometry
      geomRef.current = geometry
    }
  })
  
  useEffect(() => {
    if (exportRef) exportRef.current = meshRef.current
  }, [exportRef])
  
  return (
    <mesh ref={meshRef} position-z={-smoothD/2} scale={scale}>
      {/* <meshStandardMaterial color="mediumpurple" /> */}
    </mesh>
  )
}
