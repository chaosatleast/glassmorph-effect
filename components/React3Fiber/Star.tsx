"use client";

import { Center } from "@react-three/drei";
import { extend, useFrame, useLoader } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useContext, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader, UnrealBloomPass } from "three-stdlib";
import { ThemeContext } from "../LayoutWrapper";
extend({ UnrealBloomPass });
function Star() {
    const star = useLoader(SVGLoader, "/star.svg");
    console.log("Star:", star);

    const starGeometry = useMemo(() => {
        const paths = star.paths;
        const group = new THREE.Group();
        group.name = "star";

        paths.forEach((path: any) => {
            const shapes = SVGLoader.createShapes(path);
            shapes.forEach((shape) => {
                const geometry = new THREE.ExtrudeGeometry(shape, {
                    depth: 1,
                    bevelEnabled: true,
                    bevelSegments: 12,
                    steps: 1,
                    bevelSize: 10,
                    bevelThickness: 20,
                });

                const mesh = new THREE.Mesh(geometry);
                mesh.name = "star";
                // mesh.layers.set(1);
                mesh.renderOrder = 1;

                group.add(mesh);
            });
        });
        console.log("Group:", group);

        return { group };
    }, []);

    const starRef = useRef({
        emissiveIntensity: 0,
    });

    useEffect(() => {
        console.log("Star Geometry:", starGeometry.group.children[0]);
    }, [starGeometry]);

    const lightRef = useRef<THREE.AmbientLight | any>();
    // useHelper(lightRef, THREE.DirectionalLightHelper, 2);

    const { theme } = useContext(ThemeContext);
    // const intensity = theme === "dark" ? 4 : 1;

    const directionRef = useRef(1);
    const intensityRef = useRef(3);

    useFrame(() => {
        intensityRef.current += directionRef.current * 0.05;
        if (intensityRef.current > 4) directionRef.current = -1;
        if (intensityRef.current < 3) directionRef.current = 3;
    });

    return (
        <>
            <Center position={[0, 34, -65]} top name="star">
                <motion.group position={[-2, 1, 0]}>
                    <motion.mesh
                        {...starGeometry.group.children[0]}
                        scale={0.025}
                        position={[1, 52, 0]}
                        animate={{
                            scale: [0.025, 0.03, 0.025],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 10, // 闪烁周期
                            ease: "easeInOut",
                        }}
                    >
                        <meshStandardMaterial
                            attach="material"
                            color="#F2BF27"
                            emissive="#F2C84B"
                            emissiveIntensity={intensityRef.current}
                            metalness={0.8}
                            roughness={0.3}
                        />
                    </motion.mesh>
                </motion.group>
            </Center>
        </>
    );
}

export default Star;
