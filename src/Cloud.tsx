import { Group, Texture } from 'three'
import React, { useRef, useMemo } from 'react'
import { useFrame } from 'react-three-fiber'
import { Billboard } from './Billboard'
import { useTexture } from './useTexture'
import CloudImage from './assets/cloud.base64'

// Billboard component broken in TS, pls can somebody fix it
const TypescriptSucks = Billboard as any

export function Cloud({ opacity = 0.5, speed = 0.4, width = 10, length = 1.5, segments = 20, dir = 1, ...props }) {
  const group = useRef<Group>()
  const texture = useTexture(CloudImage) as Texture
  const clouds = useMemo(
    () =>
      [...new Array(segments)].map((_, index) => ({
        x: width / 2 - Math.random() * width,
        y: width / 2 - Math.random() * width,
        scale: 0.4 + Math.sin(((index + 1) / segments) * Math.PI) * ((0.2 + Math.random()) * 10),
        density: Math.max(0.2, Math.random()),
        rotation: Math.max(0.002, 0.005 * Math.random()) * speed,
      })),
    [width, segments, speed]
  )
  useFrame((state) =>
    group.current?.children.forEach((cloud, index) => {
      cloud.rotation.z += clouds[index].rotation * dir
      cloud.scale.setScalar(
        clouds[index].scale + (((1 + Math.sin(state.clock.getElapsedTime() / 10)) / 2) * index) / 10
      )
    })
  )
  return (
    <group {...props}>
      <group position={[0, 0, (segments / 2) * length]} ref={group}>
        {clouds.map(({ x, y, scale, density }, index) => (
          <TypescriptSucks key={index} scale={[scale, scale, scale]} position={[x, y, -index * length]} lockZ>
            <meshStandardMaterial
              map={texture}
              transparent
              opacity={(scale / 6) * density * opacity}
              depthTest={false}
            />
          </TypescriptSucks>
        ))}
      </group>
    </group>
  )
}
