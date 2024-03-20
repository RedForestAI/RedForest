import React, { useRef, useState } from 'react'
import { useFBX, useAnimations, useTexture } from '@react-three/drei'
import * as THREE from 'three'

type PandaAnimatedProps = {
  action: string
}

export function PandaAnimated(props: PandaAnimatedProps) {
  const fbx = useFBX(`${window.location.origin}/models/RedPanda_Mesh.fbx`)
  const { actions, names } = useAnimations(fbx.animations, fbx)

  // Available actions are in `names`
  /*
    names: [ "Rig|Eat", "Rig|Idle", "Rig|Run", "Rig|Sleep", "Rig|Jump", "Rig|Turn", "Rig|Walk", "Rig|Sit" ]
  */

  const textures = useTexture({
    map: '/models/Tex_RedPanda.jpg',
  })

  fbx.children.forEach((mesh, i) => {
    // @ts-ignore
    mesh.material = new THREE.MeshStandardMaterial({ map: textures.map })
  })

  useState(() => {
    if (props.action && names.includes(props.action)) {
      // @ts-ignore
      actions[props.action].reset().fadeIn(0.5).play()
      return () => {
      // @ts-ignore
        actions[props.action].reset().fadeOut(0.5)
      }
    }
    // @ts-ignore
  }, [props.action])

  return (
    <group scale={0.01} dispose={null}>
      <primitive object={fbx} dispose={null} />
    </group>
  )
}

useFBX.preload('models/RedPanda_Mesh.fbx')
