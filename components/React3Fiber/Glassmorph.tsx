"use client";

import { Center, useMatcapTexture, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { fragmentChunk1, fragmentChunk2 } from "../Shaders/fragment";
import { vertexChunk1, vertexChunk2 } from "../Shaders/vertex";

const DARK_BACKGROUND = "#0D0D0D";
const LIGHT_BACKGROUND = "#F2F1F0";

type Props = {
    theme: "dark" | "light";
};

function Glassmorph({ theme }: Props) {
    const { size, viewport } = useThree();

    const uniforms = useRef({
        color: { value: new THREE.Vector3(0.949, 0.945, 0.941) },
        u_Color: { value: new THREE.Color(0xffffff) },
        u_Intensity: { value: 10.0 },
        u_Time: { value: 0.0 },
        u_Resolution: {
            value: new THREE.Vector2(size.width, size.height),
        },
        uMouse: { value: new THREE.Vector2(0.0, 0.0) },
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

        const gridSize = 1; // Square size
        const countWidth = viewport.width / gridSize;
        const countHeight = viewport.height / gridSize;
        const radius = 0.02; // Corner radius
        const gap = 0.12; // Gap between squares

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

        console.group("Memo resized");
        console.log(
            "Memo resized viewport",
            viewport.width / 5,
            viewport.height / 5,
        );
        console.log("viewport", viewport.width, viewport.height);
        console.groupEnd();
        return { shapes };
    }, [viewport.width, viewport.height]);

    //  mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / size.width;
            const y = 1 - e.clientY / size.height;
            uniforms.current.uMouse.value.x = x;
            uniforms.current.uMouse.value.y = y;

            console.log("Mouse", x, y);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useFrame(({ clock }) => {
        // 使用 clock.getElapsedTime() 来获取时间
        if (uniforms.current) {
            uniforms.current.u_Time.value = clock.getElapsedTime();
        }
    });

    function normalize(value: number, min: number, max: number) {
        return Math.min(Math.max((value - min) / (max - min), 0), 1);
    }

    function mouseToOpacity(x: number, y: number) {
        let opacity = 1.0;
        const distance = Math.sqrt(x * x + y * y);
        if (distance < 0.5) {
            opacity = 0.0;
        } else {
            opacity = 1.0;
        }
        console.log("Opacity", opacity);
        return opacity;
    }

    useEffect(() => {
        grid.shapes.map(({ shape, position }, index) => {
            console.log(
                "Shape x norm",
                normalize(position[0], 0, viewport.width),
            );
            console.log(
                "Shape y norm",
                normalize(position[1], 0, viewport.height),
            );
        });
    }, [grid.shapes]);
    return (
        <>
            <motion.mesh position={[0, 0, -20]}>
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
                position={[0, 0, 0]}
                onCentered={(props) => {
                    console.log("Centered", props);
                }}
            >
                <motion.group scale={1}>
                    {grid.shapes.map(({ shape, position }, index) => (
                        <motion.mesh key={index} position={position}>
                            <extrudeGeometry
                                args={[
                                    shape,
                                    {
                                        depth: 0,
                                        bevelEnabled: true,
                                        bevelSegments: 4,
                                        bevelSize: 0.1,
                                        bevelThickness: 0.1,
                                    },
                                ]}
                            />

                            <meshPhysicalMaterial
                                opacity={0}
                                // ior={1.5}
                                roughness={0.5}
                                transmission={1}
                                thickness={2}
                                // clearcoat={10}
                                // normalMap={grid.normalMap}
                                // clearcoatNormalMap={grid.normalMap}
                                // normalScale={new THREE.Vector2(10)}
                                // clearcoatNormalScale={new THREE.Vector2(10)}
                                onBeforeCompile={(shader) => {
                                    shader.uniforms = {
                                        ...shader.uniforms,
                                        ...uniforms.current,
                                    };

                                    shader.vertexShader =
                                        vertexChunk1 + shader.vertexShader;
                                    shader.vertexShader =
                                        shader.vertexShader.replace(
                                            "#include <project_vertex>",
                                            vertexChunk2,
                                        );

                                    shader.fragmentShader =
                                        fragmentChunk1 + shader.fragmentShader;

                                    shader.fragmentShader =
                                        shader.fragmentShader.replace(
                                            `#include <opaque_fragment>`, // 修改不透明材质的输出
                                            fragmentChunk2,
                                        );
                                }}
                            />
                        </motion.mesh>
                    ))}
                </motion.group>
            </Center>
        </>
    );
}
export default Glassmorph;
