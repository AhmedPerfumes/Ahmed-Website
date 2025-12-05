// components/PerfumeViewer.jsx
'use client' // This is a client component!

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, SpotLight } from '@react-three/drei'
import { Model } from './Try_2' // The component from gltfjsx

export default function PerfumeViewer() {
  return (
    <div style={{ height: '1000px', width: '100%' }}>
      <Canvas shadows camera={{ fov: 70, position: [0, 2, 3] }}>
        <Suspense fallback={null}>

          {/* <ambientLight intensity={0.5} /> */}
          <Environment preset="sunset" intensity={0.1} blur={0.8} />
          <directionalLight 
            intensity={4.0} 
            position={[6, 7, 6]} // [x, y, z] - coming from 5 units right, 5 up, 5 forward
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <SpotLight
            penumbra={0.5}
            angle={1.4}
            intensity={2.0}
            position={[0, 1, -2]} // <-- Positioned BEHIND
            color="#ffffff"
          />
          <Model scale={3} castShadow/>
          <mesh 
            receiveShadow  // This mesh will only receive shadows, not cast them
            rotation={[-Math.PI / 2, 0, 0]} // Rotate it to be flat
            position={[0, 0.3, 0]}         // Position it under the model
          >
            <planeGeometry args={[15, 15]} /> {/* A 10x10 plane */}
            {/* Make the floor invisible but still receive shadows */}
            {/* <shadowMaterial opacity={0.3} />  */}
            <shadowMaterial opacity={0.1} />
          </mesh>
          
          <OrbitControls 
            enableZoom={true} 
            autoRotate 
            autoRotateSpeed={0} 
          />
        </Suspense>
      </Canvas>
    </div>
  )
}