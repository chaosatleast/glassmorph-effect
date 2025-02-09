"use client";

import { Center, useMatcapTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function Model() {
    const { viewport, size } = useThree();
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshMatcapMaterial>(null);
    const [blueTexture] = useMatcapTexture("0C0CC3_04049F_040483_04045C", 256);

    const [redTexture] = useMatcapTexture("BD0D0D_970404_7B0404_550404", 256);
    const [activeMatcap, setActiveMatcap] = useState(redTexture);
    // Store Mouse Target Position & Lerped Position
    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseLerped = useRef({ x: 0, y: 0 });
    const targetRotation = useRef(new THREE.Quaternion());

    function changeObjectColor(clientX: number) {
        const screenCenterX = window.innerWidth / 2; // Use window instead of size.width

        // Switch Matcap Texture Based on Cursor Position
        if (clientX >= screenCenterX) {
            setActiveMatcap(redTexture);
        } else {
            setActiveMatcap(blueTexture);
        }
    }

    function generateRandomRotation() {
        const randomEuler = new THREE.Euler(
            THREE.MathUtils.randFloatSpread(Math.PI), // Random rotation in radians
            THREE.MathUtils.randFloatSpread(Math.PI),
            0,
        );
        targetRotation.current.setFromEuler(randomEuler);
    }

    // Convert 2D Mouse Position to 3D Viewport Space
    function mapPointerTo3D(x: number, y: number) {
        return {
            x: (x / size.width) * viewport.width - viewport.width / 2,
            y: -(y / size.height) * viewport.height + viewport.height / 2,
        };
    }

    // Update Mouse Target Position on Move
    function handlePointerMove(e: MouseEvent) {
        const { x, y } = mapPointerTo3D(e.clientX, e.clientY);
        mouseTarget.current.x = x;
        mouseTarget.current.y = y;
        generateRandomRotation();
        changeObjectColor(e.clientX);
    }

    useEffect(() => {
        // Attach Global Event Listener
        window.addEventListener("mousemove", handlePointerMove);

        return () => {
            window.removeEventListener("mousemove", handlePointerMove);
        };
    }, []);

    // Lerp Mouse Position to Create Smooth Damping Effect
    useFrame((_, delta) => {
        mouseLerped.current.x = THREE.MathUtils.lerp(
            mouseLerped.current.x,
            mouseTarget.current.x,
            0.05,
        );
        mouseLerped.current.y = THREE.MathUtils.lerp(
            mouseLerped.current.y,
            mouseTarget.current.y,

            0.05,
        );

        if (meshRef.current) {
            meshRef.current.position.set(
                mouseLerped.current.x,
                mouseLerped.current.y,
                -10,
            );
            meshRef.current.quaternion.slerp(targetRotation.current, 0.05);
        }
    });

    return (
        <Center>
            <mesh ref={meshRef} scale={3}>
                <boxGeometry args={[1, 1, 1]} />
                <meshMatcapMaterial ref={materialRef} matcap={activeMatcap} />
            </mesh>
        </Center>
    );
}

export default Model;
