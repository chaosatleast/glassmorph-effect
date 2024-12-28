"use client";

import { Center, useMatcapTexture } from "@react-three/drei";
import { useLoader, useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useContext, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";
import { ThemeContext } from "../LayoutWrapper";
import { view } from "motion/react-m";

function Model() {
    const model = useLoader(SVGLoader, "./logo.svg");
    const [matcap] = useMatcapTexture("313131_BBBBBB_878787_A3A4A4");

    const { size, viewport } = useThree();
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
        console.log("model Geometry:", modelGeometry.group.children);
    }, [modelGeometry]);

    const lightRef = useRef<THREE.AmbientLight | any>();

    const { theme } = useContext(ThemeContext);

    const intensityRef = useRef(3);

    // useHelper(lightRef, THREE.DirectionalLightHelper, 2);

    const meshScale = useMemo(() => {
        console.log("Viewport:", size.width);
        const C = 500;

        const width = size.width;
        // if (viewport.width < 12) {
        //     return 0.003;
        // } else if (viewport.width < 12) {
        //     return 0.0035;
        // }
        const result = 0.003 + (width / (width + C)) * 0.003 - 0.002;
        console.log("Result:", result);
        return result;
    }, [viewport.width]);
    return (
        <>
            <Center
                position={[0, 0, 0]}
                onCentered={(props) => {
                    console.log("Centered", props);
                }}
            >
                <motion.group scale={meshScale}>
                    <motion.mesh>
                        <sphereGeometry args={[500, 32, 32]} />
                        <meshMatcapMaterial matcap={matcap} color={"#e6f285"} />
                    </motion.mesh>
                </motion.group>
            </Center>
            {/* <Center
                position={[0, 0, 0]}
                onCentered={(props) => {
                    console.log("Centered", props);
                }}
            >
                <motion.group scale={meshScale}>
                    {modelGeometry.group.children.map(
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
                    )}
                </motion.group>
            </Center> */}
        </>
    );
}
export default Model;
