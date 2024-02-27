import React, { useRef, useState } from 'react'
import { useFBX, useAnimations, useTexture } from '@react-three/drei'

export function PandaAnimated(props) {
  const fbx = useFBX('models/RedPanda_Mesh.fbx')
  const { actions, names } = useAnimations(fbx.animations, fbx)
  console.log('names:', names)
  //   console.log('actions:', actions)

  const textures = useTexture({
    map: '/models/Tex_RedPanda.jpg',
  })

  useState(() => {
    actions['Rig|Sit'].reset().fadeIn(0.5).play()
    return () => {
      actions['Rig|Sit'].reset().fadeOut(0.5)
    }
  }, [])

  return (
    <group {...props} scale={0.01} dispose={null}>
      <primitive object={fbx} dispose={null} />
      <meshStandardMaterial map={textures.map} />
    </group>
  )
}

useFBX.preload('models/RedPanda_Mesh.fbx')
