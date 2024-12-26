"use client";
import { Center, useTexture } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Ribbon() {
    const textures = useTexture({
        front: "./banner_1.png",
        back: "./banner_2.png",
    });
    console.log("Textures:", textures);
    const ribbonGeometry = useMemo(() => {
        //  * creating tree curve
        const pointsPerLayer = 32;
        // * cone
        const radius = 25;
        const height = 50;
        const layers = 10;
        const totalPoints = pointsPerLayer * layers;
        const totalTurns = layers;
        const curvePoints: THREE.Vector3[] = [];

        for (let i = 0; i < totalPoints; i++) {
            // 1. Calculate the progression ratio (from 0 to 1)
            const t = i / (totalPoints - 1);

            // 2. Calculate the current height (y-coordinate)
            const y = t * height;

            // 3. Compute the current radius, which decreases linearly with height
            const currentRadius = radius * (1 - t);

            // 4. Compute the angle for the current point
            const angle = t * totalTurns * Math.PI * 2;

            // 5. Calculate the x and z coordinates based on the radius and angle
            const x = Math.cos(angle) * currentRadius;
            const z = Math.sin(angle) * currentRadius;

            // 6. Optional: Add a slight wave effect to the height
            const waveY = y + Math.sin(t * 20) * 0.1; // Adjust frequency and amplitude of the wave

            // 7. Add the point to the curve points array
            curvePoints.push(new THREE.Vector3(x, waveY, z));
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        curve.curveType = "catmullrom";
        curve.tension = 0.75;
        const points = curve.getPoints(50);

        // * creating ribbon plane
        const num = 1000;

        const finalPoints: any = [];
        const frenetFrames = curve.computeFrenetFrames(num, true);
        const spacedPoints = curve.getSpacedPoints(num);

        const dimensions = [-1.8, 1.8];

        let point = new THREE.Vector3();
        const binormalShift = new THREE.Vector3();

        dimensions.forEach((dimension) => {
            for (let i = 0; i <= num; i++) {
                point = spacedPoints[i];

                binormalShift
                    .copy(frenetFrames.normals[i])
                    .multiplyScalar(dimension);

                finalPoints.push(
                    new THREE.Vector3().copy(point).add(binormalShift),
                );
            }
        });

        const ribbon = new THREE.PlaneGeometry(1, 1, num, 1);

        ribbon.setFromPoints(finalPoints);
        ribbon.scale(-1, 1, 1);
        ribbon.normalizeNormals(); // 归一化法线
        ribbon.computeVertexNormals();

        ribbon.addGroup(0, 6000, 0);

        ribbon.computeVertexNormals();

        ribbon.addGroup(0, 6000, 1);

        textures.front.wrapS = THREE.RepeatWrapping;
        textures.front.wrapT = THREE.RepeatWrapping;
        textures.front.flipY = true;
        textures.front.minFilter = THREE.LinearFilter;
        textures.front.magFilter = THREE.LinearFilter;
        textures.front.repeat.set(20, 1);

        textures.back.wrapS = THREE.RepeatWrapping;
        textures.back.wrapT = THREE.RepeatWrapping;
        textures.back.flipY = true;
        textures.back.minFilter = THREE.LinearFilter;
        textures.back.magFilter = THREE.LinearFilter;
        textures.back.repeat.set(-20, 1);

        const frontMat = new THREE.MeshStandardMaterial({
            map: textures.front,
            side: THREE.FrontSide,
            roughness: 0.65,
            metalness: 0.2,
            flatShading: true,
        });

        const backMat = new THREE.MeshStandardMaterial({
            map: textures.back,
            side: THREE.BackSide,
            roughness: 0.65,
            metalness: 0.2,
            flatShading: true,
        });

        const ribbonMesh = new THREE.Mesh(ribbon, [frontMat, backMat]);
        ribbonMesh.layers.toggle(0);
        ribbon.name = "ribbon";

        return { curve, points, ribbon, ribbonMesh, finalPoints, textures };
    }, []);

    const ref = useRef<any>(null);

    // useFrame(({ clock }) => {
    //     const scaleFactor = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1; // 调整幅度和速度
    //     ref.current.scale.set(1, scaleFactor, 1);
    // });

    const variants = {
        spinning: {
            rotateY: [0, 360], // 从 0 旋转到 360
            transition: {
                repeat: Infinity,
                repeatType: "mirror", // 模拟“快慢交替”
                duration: 10, // 单次动画的总时长
                ease: [0.42, 0, 0.58, 1], // 自定义贝塞尔曲线
            },
        },
    };

    // useHelper(ref, VertexNormalsHelper, 0.5);

    return (
        <>
            <motion.ambientLight intensity={0.86} color={"#ffffff"} />
            <motion.directionalLight
                intensity={0.86}
                position={[0, 5, 5]}
                color={"#F2BF27"}
            />
            <motion.directionalLight
                intensity={0.86}
                position={[0, 5, -3]}
                color={"#F2BF27"}
            />
            <motion.directionalLight
                position={[0, 30, 20]}
                intensity={1.5}
                color={"#F2BF27"}
                // ref={lightRef}
            ></motion.directionalLight>

            <motion.group
                initial={{
                    rotateY: 0,
                }}
                animate={{
                    rotateY: [
                        0,
                        Math.PI / 2,
                        Math.PI,
                        (3 * Math.PI) / 2,
                        2 * Math.PI,
                    ],
                }}
                transition={{
                    times: [0, 0.2, 0.5, 0.8, 1], // Control timing of keyframes
                    duration: 20,
                    repeat: Infinity,
                    ease: [
                        "linear", // 0 to 90 degrees
                        "easeOut", // Slow down at 90 degrees
                    ],
                }}
            ></motion.group>

            <Center position={[0, 5, -60]}>
                <motion.group
                    position={[0, 0, 0]}
                    ref={ref}
                    initial={{
                        rotateY: 0,
                    }}
                    animate={{
                        rotateY: [
                            0,
                            Math.PI / 2,
                            Math.PI,
                            (3 * Math.PI) / 2,
                            2 * Math.PI,
                        ],
                    }}
                    transition={{
                        times: [0, 0.2, 0.5, 0.8, 1], // Control timing of keyframes
                        duration: 20,
                        repeat: Infinity,
                        ease: [
                            "linear", // 0 to 90 degrees
                            "easeOut", // Slow down at 90 degrees
                        ],
                    }}
                >
                    {/* <Star /> */}
                    <motion.mesh
                        // ref={ref}
                        layers={0}
                        name="ribbon"
                        castShadow
                        receiveShadow
                    >
                        <bufferGeometry {...ribbonGeometry.ribbon} />
                        <motion.meshStandardMaterial
                            // wireframe={true}
                            attach="material-0"
                            side={THREE.FrontSide}
                            map={ribbonGeometry.textures.front}
                            roughness={0.65}
                            metalness={0.2}
                            flatShading={true}
                        />
                        <motion.meshStandardMaterial
                            // wireframe={true}
                            attach="material-1"
                            side={THREE.BackSide}
                            map={ribbonGeometry.textures.back}
                            roughness={0.65}
                            metalness={0.2}
                            flatShading={true}
                        />
                    </motion.mesh>

                    {/* {ribbonGeometry.finalVertices.map(
                    (point: any, index: number) => (
                        <mesh
                            key={index}
                            position={[point.x, point.y, point.z]}
                        >
                            <sphereGeometry args={[0.1, 16, 16]} />
                            <meshBasicMaterial color="red" />
                        </mesh>
                    ),
                )} */}
                    {/* <Center bottom position={[0, -9, 0]}>
                    <Line points={ribbonGeometry.points} color="hotpink">
                        <lineBasicMaterial color="hotpink" />
                    </Line>
                </Center> */}
                </motion.group>
            </Center>
        </>
    );
}

export default Ribbon;
