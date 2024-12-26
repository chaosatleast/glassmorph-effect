"use client";
import { Center, PointMaterial, Points, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ThemeContext } from "../LayoutWrapper";

const Snow = () => {
    // snowflake points
    const pointsRef = useRef<THREE.BufferGeometry | null>(null);
    const positionRef = useRef();
    const velocityRef = useRef();

    const particleCount = 5000;

    const { size } = useThree();

    const maxRange = size.height,
        minRange = maxRange / 2;

    const minHeight = size.height;

    const snowflakeTex1 = useTexture("/SnowFlake_1.png");
    const snowflakeTex2 = useTexture("/SnowFlake_2.png");
    console.log("Snowflake Textures:", snowflakeTex1, snowflakeTex2);

    // generate the position of the snowflakes
    const particles = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const position = [];
        const velocity = [];

        for (let i = 0; i < particleCount; i++) {
            // 初始位置随机分布
            position.push(
                Math.random() * maxRange - minRange, // x 位置
                Math.random() * minHeight + minRange, // y 位置
                Math.random() * maxRange - minRange, // z 位置
            );

            // 初始速度，y 方向下落
            // 初始速度，加入缓慢的 z 方向运动
            velocity.push(
                Math.random() * 0.2 - 0.1, // x 速度（-0.1 到 0.1）
                Math.random() * 0.07 + 0.03, // y 速度（0.03 到 0.1）
                Math.random() * 0.1 - 0.05, // z 速度（-0.05 到 0.05）
            );
        }

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(position, 3),
        );
        geometry.setAttribute(
            "velocity",
            new THREE.Float32BufferAttribute(velocity, 3),
        );

        return geometry;
    }, [particleCount]);

    useFrame(() => {
        const positionArray = particles.attributes.position.array;
        const velocityArray = particles.attributes.velocity.array;

        for (let i = 0; i < particleCount; i++) {
            const yIndex = i * 3 + 1; // y coordinate index
            const xIndex = i * 3; // x coordinate index
            const zIndex = i * 3 + 2; // z coordinate index
            const yVelocity = velocityArray[i * 3 + 1];
            const xVelocity = velocityArray[i * 3]; // x velocity
            // Snow falling

            // Dynamically adjust y velocity (the lower the height, the slower the speed)
            const dynamicYVelocity =
                yVelocity * (0.05 + positionArray[yIndex] / maxRange);

            // Snow falling
            positionArray[xIndex] += xVelocity; // Move in the x direction
            positionArray[yIndex] -= dynamicYVelocity; // Move down in the y direction

            // If the snowflake exceeds the bottom boundary, reset to the top
            if (positionArray[yIndex] < minRange) {
                positionArray[xIndex] = Math.random() * maxRange - minRange; // Reset x
                positionArray[yIndex] = Math.random() * minHeight + minRange; // Reset y
                positionArray[zIndex] = Math.random() * maxRange - minRange; // Reset z
            }
            // If it drifts out of the horizontal range, reset x
            if (
                positionArray[xIndex] < -minRange ||
                positionArray[xIndex] > minRange
            ) {
                positionArray[xIndex] = Math.random() * maxRange - minRange;
            }
        }
        particles.attributes.position.needsUpdate = true;
    });

    useEffect(() => {
        console.log("Particles:", particles.attributes);
    }, []);

    const { theme } = useContext(ThemeContext);
    const opacity = theme === "dark" ? 0.8 : 0.0;

    return (
        <Center position={[0, 0, -200]}>
            <Points
                positions={particles.attributes.position.array as Float32Array}
            >
                <PointMaterial
                    transparent={true} // 开启透明度支持
                    size={3}
                    depthTest={false}
                    blending={THREE.AdditiveBlending}
                    map={snowflakeTex1}
                    opacity={opacity}
                    alphaTest={0}
                    emissive="#f2f1f0"
                    emissiveIntensity={4}
                />
            </Points>
        </Center>
    );
};

export default Snow;
