"use client";

import dynamic from 'next/dynamic'
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

const PandaAnimated = dynamic(() => import('~/components/threed/PandaAnimated').then((mod) => mod.PandaAnimated), { ssr: false })

type PandaProps = {
  action: string
}

export default function Panda(props: PandaProps) {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 30}} dpr={[1, 2]} gl={{ preserveDrawingBuffer: true}}>
        <OrbitControls />
        <group scale={0.5} position={[0,-0.75,0]} rotation={[0,-Math.PI * 0.2,0]}>
          <PandaAnimated action={props.action}/>
        </group>
        <ambientLight intensity={1} />
      </Canvas>
    </>
  )
}