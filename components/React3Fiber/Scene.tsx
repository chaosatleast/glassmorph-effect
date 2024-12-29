"use client";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../LayoutWrapper";
import Glassmorph from "./Glassmorph";
import Model from "./Model";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export default function Scene() {
    const { theme } = React.useContext(ThemeContext);
    // Step 1: Track window size using useState
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Step 2: Update window size on resize using useEffect
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Add resize event listener
        window.addEventListener("resize", handleResize);

        // Cleanup event listener
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Step 3: Use useMemo to calculate the aspect ratio based on window size
    const aspectRatio = useMemo(() => {
        return windowSize.width / windowSize.height;
    }, [windowSize]); // Recalculate only when windowSize changes

    const frustumSize = 10;

    const camera: any = useMemo(
        () => ({
            position: [0, 0, 100],
            top: frustumSize / 2,
            bottom: frustumSize / -2,
            left: (-frustumSize * aspectRatio) / 2,
            right: (frustumSize * aspectRatio) / 2,
            zoom: 80,
            // near: -100000,
            // far: 100000,
        }),
        [aspectRatio],
    );
    return (
        <Canvas
            orthographic={true}
            camera={camera}
            gl={{
                alpha: true,
                toneMapping: THREE.NoToneMapping,
                outputColorSpace: THREE.LinearSRGBColorSpace,
            }}
        >
            <ambientLight
                intensity={10}
                color={"#ffffff"}
                position={[0, 0, 1]}
            />
            <Glassmorph theme={theme} />
            <Model />

            {/* <mesh position={[0, 0, -5]} scale={5}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={"#ff0000"} />
            </mesh> */}
            <OrbitControls />
        </Canvas>
    );
}
