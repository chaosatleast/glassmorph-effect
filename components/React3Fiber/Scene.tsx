"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";
import { ThemeContext } from "../LayoutWrapper";
import Glassmorph from "./Glassmorph";
import Model from "./Model";

export default function Scene() {
    const { theme } = React.useContext(ThemeContext);

    return (
        <Canvas
            gl={{
                alpha: true,
                toneMapping: THREE.NoToneMapping,
                outputColorSpace: THREE.LinearSRGBColorSpace,
            }}
            onCreated={({ gl }) => {}}
        >
            <ambientLight
                intensity={10}
                color={"#ffffff"}
                position={[0, 0, 10]}
            />
            <Glassmorph theme={theme} />
            {/* <RoundedGrid /> */}
            <Model />
            <OrbitControls />
        </Canvas>
    );
}
