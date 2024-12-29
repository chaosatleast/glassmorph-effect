"use client";

import { Center, useMatcapTexture } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { use, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";
import { ThemeContext } from "../LayoutWrapper";
import { view } from "motion/react-m";

function Model() {
    const model = useLoader(SVGLoader, "./logo.svg");
    const [matcap] = useMatcapTexture("161B1F_C7E0EC_90A5B3_7B8C9B");

    const { size, viewport, mouse, camera } = useThree();

    const mousePosition3d = useRef({ x: 0, y: 0 });

    const modelGeometry = useMemo(() => {
        const paths = model.paths;

        console.log("Paths:", paths);
        const group = new THREE.Group();
        group.name = "model";

        paths.forEach((path: any) => {
            const shapes = SVGLoader.createShapes(path);
            shapes.forEach((shape) => {
                const geometry = new THREE.ExtrudeGeometry(shape, {
                    depth: 100,
                    bevelEnabled: true,
                    bevelSegments: 10,
                    steps: 2,
                    bevelOffset: -7,
                    bevelSize: 20,
                    bevelThickness: 100,
                    curveSegments: 100,
                });

                const mesh = new THREE.Mesh(geometry);
                mesh.name = "model";

                group.add(mesh);
            });
        });

        console.log("Group:", group);

        return { group };
    }, []);

    useEffect(() => {
        console.log("Mouse", mouse);
    }, [mouse]);

    const lightRef = useRef<THREE.AmbientLight | any>();

    // useHelper(lightRef, THREE.DirectionalLightHelper, 2);

    const meshScale = useMemo(() => {
        console.group("Mesh Scale");
        console.log("Viewport:", size.width, size.height);
        const max = 0.02;
        const min = 0.019;

        const C = 500;
        const width = size.width;
        const result = max + (width / (width + C)) * (max - min);

        console.log("Result:", result);
        console.groupEnd();
        return result;
    }, [viewport.width]);

    const meshRef = useRef<THREE.Mesh | any>();

    function mapPointerTo3dWorld(x: number, y: number) {
        const x3d = (x / size.width) * viewport.width - viewport.width / 2;
        const y3d = -(y / size.height) * viewport.height + viewport.height / 2;

        return { x: x3d, y: y3d };
    }

    function handlePointerMove(e: any) {
        console.log("Pointer Move", e);
        const { clientX, clientY } = e;
        const { x, y } = mapPointerTo3dWorld(clientX, clientY);
        mousePosition3d.current.x = x;
        mousePosition3d.current.y = y;
    }

    useEffect(() => {
        console.log("Mouse Position 3d", mousePosition3d);
    }, [mousePosition3d]);

    useFrame(({ mouse, viewport }) => {
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;
        meshRef.current.position.x = x;
        meshRef.current.position.y = y;
    });
    return (
        <>
            {/* <Center
                position={[0, 0, 0]}
                onCentered={(props) => {
                    console.log("Centered", props);
                }}
            >
                <motion.group
                    position={[0, 0, 0]}
                    scale={meshScale}
                    ref={meshRef}
                    onPointerMove={(e) => {
                        handlePointerMove(e);
                    }}
                    // animate={{
                    //     x: mousePosition3d.current.x,
                    //     y: mousePosition3d.current.y,
                    // }}
                    // transition={{
                    //     type: "spring",
                    //     stiffness: 100,
                    //     damping: 10, // Smooth animation
                    // }}
                >
                    <motion.mesh>
                        <sphereGeometry args={[500, 32, 32]} />
                        <meshMatcapMaterial matcap={matcap} color={"#e6f285"} />
                    </motion.mesh>
                </motion.group>
            </Center> */}
            <Center
                position={[0, 0, -20]}
                onCentered={(props) => {
                    console.log("Centered", props);
                }}
                ref={meshRef}
                onPointerMove={(e) => {
                    handlePointerMove(e);
                }}
            >
                {" "}
                <mesh position={[0, 0, -5]} scale={2}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={"#ff0000"} />
                </mesh>
                <motion.group scale={meshScale}>
                    {/* {modelGeometry.group.children.map(
                        (child: any, index: number) => {
                            return (
                                <motion.mesh
                                    key={index}
                                    {...child}
                                    scale={[1, -1, -1]}
                                >
                                    <meshMatcapMaterial
                                        matcap={matcap}
                                        color={"#e6f285"}
                                    />
                                </motion.mesh>
                            );
                        },
                    )} */}
                </motion.group>
            </Center>
        </>
    );
}
export default Model;
