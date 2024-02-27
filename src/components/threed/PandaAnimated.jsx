import React, { useRef, useState } from 'react'
import { useFBX, useAnimations, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function PandaAnimated(props) {
  const fbx = useFBX('models/RedPanda_Mesh.fbx')
  const { actions, names } = useAnimations(fbx.animations, fbx)

  // Available actions are in `names`
  /*
    names: [ "Rig|Eat", "Rig|Idle", "Rig|Run", "Rig|Sleep", "Rig|Jump", "Rig|Turn", "Rig|Walk", "Rig|Sit" ]
  */

  const textures = useTexture({
    map: '/models/Tex_RedPanda.jpg',
  })

  fbx.children.forEach((mesh, i) => {
    mesh.material = new THREE.MeshStandardMaterial({ map: textures.map })
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
    </group>
  )
}

useFBX.preload('models/RedPanda_Mesh.fbx')
