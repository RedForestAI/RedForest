/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/models/redpanda.SD.glb 
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Panda(props) {
  const { nodes, materials } = useGLTF('models/redpanda.SD.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.RedPandaSD.geometry} material={materials.Mat_RedPanda} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('models/redpanda.SD.glb')
