"use client";

import { Center, useTexture } from "@react-three/drei";
import { useLoader, useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";
import { uniform } from "three/tsl";

const DARK_BACKGROUND = "#0D0D0D";
const LIGHT_BACKGROUND = "#F2F1F0";

type Props = {
    theme: "dark" | "light";
};

function Glassmorph({ theme }: Props) {
    const normalMap = useTexture("/normal.jpg");

    const { size, viewport } = useThree();

    const lightRef = useRef<THREE.AmbientLight | any>();

    const uniforms = useRef({
        color: { value: new THREE.Vector3(0.949, 0.945, 0.941) },
    });

    useEffect(() => {
        const colorPlane =
            theme === "dark"
                ? new THREE.Vector3(0.05, 0.05, 0.05)
                : new THREE.Vector3(0.949, 0.945, 0.941);

        console.log("Theme:", theme);
        uniforms.current.color.value = colorPlane;
    }, [theme]);

    const grid = useMemo(() => {
        const shapes: {
            shape: THREE.Shape;
            position: [number, number, number];
        }[] = [];

        const countWidth = viewport.width / 0.5;
        const countHeight = viewport.height / 0.5;
        const gridSize = 0.5; // Square size
        const radius = 0.1; // Corner radius
        const gap = 0.1; // Gap between squares

        for (let i = 0; i < countWidth; i++) {
            for (let j = 0; j < countHeight; j++) {
                const shape = new THREE.Shape();
                shape.absarc(
                    -gridSize / 2,
                    -gridSize / 2,
                    radius,
                    Math.PI,
                    1.5 * Math.PI,
                );
                shape.absarc(
                    gridSize / 2,
                    -gridSize / 2,
                    radius,
                    1.5 * Math.PI,
                    0,
                );
                shape.absarc(
                    gridSize / 2,
                    gridSize / 2,
                    radius,
                    0,
                    0.5 * Math.PI,
                );
                shape.absarc(
                    -gridSize / 2,
                    gridSize / 2,
                    radius,
                    0.5 * Math.PI,
                    Math.PI,
                );
                shape.closePath();

                shapes.push({
                    shape,
                    position: [
                        i * (gridSize + gap * 2.05),
                        j * (gridSize + gap * 2.05),
                        0,
                    ] as [number, number, number], // Ensure position is a tuple
                });
            }
        }

        normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
        normalMap.repeat.set(1, 1);

        console.group("Memo resized");
        console.log(
            "Memo resized viewport",
            viewport.width / 5,
            viewport.height / 5,
        );
        console.log("viewport", viewport.width, viewport.height);
        // console.log("client", clientWidth, clientHeight);
        console.groupEnd();
        return { shapes, normalMap };
    }, [viewport.width, viewport.height]);

    return (
        <>
            <motion.mesh position={[0, 0, -5]}>
                <planeGeometry args={[size.width, size.height]} />
                <shaderMaterial
                    uniforms={uniforms.current}
                    vertexShader={`
                        void main() {
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={`
                        uniform vec3 color;
                        void main() {
                            gl_FragColor = vec4(color, 1.0);
                        }
                    `}
                />{" "}
            </motion.mesh>

            <Center
                position={[0, 0, 2]}
                onCentered={(props) => {
                    console.log("Centered", props);
                }}
            >
                <motion.group>
                    {grid.shapes.map(({ shape, position }, index) => (
                        <motion.mesh key={index} position={position}>
                            <extrudeGeometry
                                args={[
                                    shape,
                                    {
                                        depth: 0.01,
                                        bevelEnabled: false,
                                    },
                                ]}
                            />
                            <meshPhysicalMaterial
                                opacity={1.0}
                                roughness={0.5}
                                transmission={1}
                                thickness={2}
                                clearcoat={1}
                                normalMap={grid.normalMap}
                                clearcoatNormalMap={grid.normalMap}
                                normalScale={new THREE.Vector2(1)}
                                clearcoatNormalScale={new THREE.Vector2(1)}
                                transparent={true}
                            />
                        </motion.mesh>
                    ))}
                </motion.group>
            </Center>
        </>
    );
}
export default Glassmorph;
