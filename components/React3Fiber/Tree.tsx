"use client";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useContext } from "react";
import { ThemeContext } from "../LayoutWrapper";
import Ribbon from "./Ribbon";
import Snow from "./Snow";
import Star from "./Star";

function Tree() {
    const { theme } = useContext(ThemeContext);

    const radius = theme === "dark" ? 0.1 : 0;
    const threshold = theme === "dark" ? 1 : 0;
    return (
        <>
            <Canvas gl={{ antialias: false, alpha: true }}>
                <Snow />
                <Star />

                <Ribbon />

                <EffectComposer enableNormalPass={false}>
                    <Bloom
                        luminanceThreshold={threshold}
                        mipmapBlur
                        radius={radius}
                        intensity={1.25}
                    />
                </EffectComposer>
            </Canvas>
        </>
    );
}

export default Tree;
