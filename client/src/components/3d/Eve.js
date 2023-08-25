import { useEffect, useRef, useState } from "react";
import { useGLTF, Text, Float, ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Glitch } from "@react-three/postprocessing";

const EveScene = () => {
    return (
    <Canvas>
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Float floatIntensity={4} speed={2}>
        {/* <Gltf src="/models/eve.glb" scale={1} position={[0, 1, 0]} /> */}
        <Model position={[0, 1, 0]} />
        <Text
          font="/fonts/BrunoAceSC-Regular.ttf"
          fontSize={0.5}
          position={[0, 1, 2]}
          color="#6c757d"
        >{`Create\n3D\nWebsites`}</Text>
      </Float>    
        <ContactShadows resolution={512} position={[0, -0.8, 0]} opacity={1} scale={10} blur={2} far={2} />
      <EffectComposer>
        <Glitch 
          delay={[1.5, 3.5]} // min and max glitch delay
          duration={[0.6, 1.0]} // min and max glitch duration
          strength={[0.3, 1.0]}
        />
      </EffectComposer>
      {/* <OrbitControls /> */}
    </Canvas>
    )
}

export function Model(props) {
  const { nodes, materials } = useGLTF("/models/eve.glb");
  return (
    <group {...props} dispose={null}>
    <group rotation={[-Math.PI / 2, 0, 0]} scale={0.41}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <group position={[0, 2.61, 0]}>
          <mesh
            geometry={nodes.brain_lambert4_0.geometry}
            material={materials.lambert4}
          />
          <group position={[0, -0.01, 1.76]}>
            <mesh
              geometry={nodes["0"].geometry}
              material={materials.lambert5}
            />
          </group>
          <mesh
            geometry={nodes["head_lambert2_u1_v-1_0"].geometry}
            material={materials["lambert2_u1_v-1"]}
          />
          <mesh
            geometry={nodes.head_lambert3_0.geometry}
            material={materials.lambert3}
          />
        </group>
        <mesh
          geometry={nodes["body_lambert1_u1_v-1_0"].geometry}
          material={materials["lambert1_u1_v-1"]}
        />
        <group position={[1.71, -0.23, -0.62]}>
          <mesh
            geometry={nodes["left_arm_lambert1_u1_v-1_0"].geometry}
            material={materials["lambert1_u1_v-1"]}
          />
        </group>
        <group position={[1.3, -2.08, -0.55]}>
          <mesh
            geometry={nodes["left_finger1_lambert1_u1_v-1_0"].geometry}
            material={materials["lambert1_u1_v-1"]}
          />
        </group>
        <group position={[1.32, -2.12, -0.32]}>
          <mesh
            geometry={nodes["left_finger2_lambert1_u1_v-1_0"].geometry}
            material={materials["lambert1_u1_v-1"]}
          />
        </group>
        <group position={[1.34, -2.14, -0.11]}>
          <mesh
            geometry={nodes["left_finger3_lambert1_u1_v-1_0"].geometry}
            material={materials["lambert1_u1_v-1"]}
          />
        </group>
        <group position={[1.34, -2.09, -0.11]}>
          <mesh
            geometry={nodes["left_finger4_lambert1_u1_v-1_0"].geometry}
            material={materials["lambert1_u1_v-1"]}
          />
        </group>
        <group position={[-1.71, -0.23, -0.62]}>
          <mesh
            geometry={nodes["right_arm_lambert1_u1_v-1_0"].geometry}
            material={materials["lambert1_u1_v-1"]}
          />
        </group>
        <group position={[-1.3, -2.08, -0.55]}>
          <mesh
            geometry={nodes["right_finger1_lambert1_u1_v-1_0"].geometry}
            material={materials["lambert1_u1_v-1"]}
          />
        </group>
        <group position={[-1.32, -2.12, -0.32]}>
          <mesh
            geometry={nodes["right_finger2_lambert1_u1_v-1_0"].geometry}
            material={materials["lambert1_u1_v-1"]}
          />
        </group>
        <group position={[-1.34, -2.14, -0.11]}>
          <mesh
            geometry={nodes["right_finger3_lambert1_u1_v-1_0"].geometry}
            material={materials["lambert1_u1_v-1"]}
          />
        </group>
        <group position={[-1.34, -2.09, -0.11]}>
          <mesh
            geometry={nodes["right_finger4_lambert1_u1_v-1_0"].geometry}
            material={materials["lambert1_u1_v-1"]}
          />
        </group>
      </group>
    </group>
  </group>
  );
}

useGLTF.preload("/eve.glb");

export default EveScene

useGLTF.preload("/models/eve.glb");