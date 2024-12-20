"use client";

import { contents } from "@/libs/const";
import gsap from "gsap";
import Matter from "matter-js";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import Atom from "./Atom";

function Scene() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const circleBodyRef = useRef<Matter.Body[]>([]);
    const wallBodyRef = useRef<Matter.Body[]>([]);

    const refs = useRef<HTMLDivElement[]>([]);
    refs.current = [];

    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Composite = Matter.Composite;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;
    const Body = Matter.Body;
    const Events = Matter.Events;

    // Single Walls With Ref
    const createWall = (x: number, y: number, w: number, h: number) => {
        const body = Bodies.rectangle(x, y, w, h, {
            isStatic: true,
            render: { fillStyle: "transparent" },
        });
        wallBodyRef.current.push(body);

        return body;
    };

    // Walls
    const createWalls = (engine: Matter.Engine) => {
        const h = 20;
        if (!sceneRef.current) return;
        const walls = [
            createWall(
                sceneRef.current.offsetWidth / 2,
                0,
                sceneRef.current.offsetWidth,
                h,
            ),
            createWall(
                sceneRef.current.offsetWidth / 2,
                sceneRef.current.offsetHeight,
                sceneRef.current.offsetWidth,
                h,
            ),
            createWall(
                0,
                sceneRef.current.offsetHeight / 2,
                h,
                sceneRef.current.offsetHeight,
            ),
            createWall(
                sceneRef.current.offsetWidth,
                sceneRef.current.offsetHeight / 2,
                h,
                sceneRef.current.offsetHeight,
            ),
        ];

        if (!walls) return;
        Composite.add(engine.world, walls);
    };

    const createCircles = (engine: Matter.Engine) => {
        if (!sceneRef.current || !canvasRef.current) return;

        const canvasWidth = sceneRef.current.offsetWidth;
        const canvasHeight = sceneRef.current.offsetHeight;

        const circles = refs.current.map((atom, index) => {
            console.log("CreateBody", index);
            var circleElemWidth = atom.offsetWidth;
            var circleElemHeight = atom.offsetHeight;
            const radius = Math.max(circleElemWidth, circleElemHeight) / 2;

            const x = Math.random() * (canvasWidth - 2 * radius) + radius; // 随机 x 坐标
            const y = Math.random() * (canvasHeight - 2 * radius) + radius; // 随机 y 坐标

            const body = Bodies.circle(x, y, radius, {
                restitution: 1,
                friction: 0,
                frictionAir: 0,
                density: 0.01,
                velocity: { x: 0, y: 0 },
                render: { fillStyle: "blue" },
            });

            Composite.add(engine.world, body);

            return body;
        });

        if (!circles) return;

        circleBodyRef.current = circles;
    };

    const beforeUpdate = () => {
        circleBodyRef.current.forEach((atom) => {
            const maxSpeed = 10;
            const velocity = atom.velocity;

            Matter.Body.setVelocity(atom, {
                x: Math.max(-maxSpeed, Math.min(velocity.x, maxSpeed)),
                y: Math.max(-maxSpeed, Math.min(velocity.y, maxSpeed)),
            });

            const x = Math.max(50, atom.position.x);
            const y = Math.max(50, atom.position.y);
            if (x !== atom.position.x || y !== atom.position.y) {
                Matter.Body.setPosition(atom, { x, y });
            }
        });
    };

    const afterUpdate = () => {
        refs.current.forEach((ref, index) => {
            gsap.set(ref, {
                x:
                    circleBodyRef.current[index].position.x -
                    ref?.offsetWidth / 2,
                y:
                    circleBodyRef.current[index].position.y -
                    ref?.offsetHeight / 2,

                rotation: circleBodyRef.current[index].angle,
            });
        });
    };

    const handleResize = (engine: Matter.Engine, render: Matter.Render) => {
        if (!sceneRef.current || !canvasRef.current) return;
        Composite.clear(engine.world, false);

        createWalls(engine);

        refs.current.forEach((ref, index) => {
            ref.style.left = `${0}px`;
            ref.style.top = `${0}px`;
            ref.style.transform = `rotate(0deg)`;
        });

        // create atom or pill
        createCircles(engine);
    };

    useEffect(() => {
        // Matter.js code goes here
        if (!sceneRef.current || !canvasRef.current) return;

        console.log(
            sceneRef.current.offsetWidth,
            sceneRef.current.offsetHeight,
        );
        const engine = Engine.create({
            gravity: { x: 0, y: 1 },
        });
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            canvas: canvasRef.current,
            options: {
                pixelRatio: window.devicePixelRatio,
                width: sceneRef.current.offsetWidth,
                height: sceneRef.current.offsetHeight,
                wireframes: false,
                background: "transparent",

                showDebug: true,
                showCollisions: true,
                showPerformance: true,
            },
        });

        // Add walls to the scene
        createWalls(engine);

        // create atom or pill
        createCircles(engine);

        // console.log(
        //     "Circles",
        //     circles.map((circle) => circle.body.position),
        // );
        // console.log(
        //     "Circles",
        //     circles.map((circle) => ({
        //         circleElemPosX: circle.circleElemPosX,
        //         circleElemPosY: circle.circleElemPosY,
        //     })),
        // );

        // Runner
        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        // Engine Events
        Events.on(engine, "beforeUpdate", () => beforeUpdate());

        Events.on(engine, "afterUpdate", () => afterUpdate());

        window.addEventListener("resize", () => {
            Events.off(engine, "afterUpdate", () => afterUpdate());
            Events.off(engine, "beforeUpdate", () => beforeUpdate());

            handleResize(engine, render);

            Events.on(engine, "beforeUpdate", () => beforeUpdate());
            Events.on(engine, "afterUpdate", () => afterUpdate());
        });
        return () => {
            Render.stop(render);
            Engine.clear(engine);
            window.removeEventListener("resize", () => {
                handleResize(engine, render);
            });
        };
    }, [refs]);

    useEffect(() => {
        console.log(refs.current.length); // This should print 10 if all 10 balls are correctly created.
    }, [refs]);

    return (
        <motion.div
            className="my-auto h-full max-h-screen w-full rounded-2xl"
            // initial={{ scale: 5 }}
            // whileInView={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        >
            <div ref={sceneRef} className="relative h-full w-full">
                <canvas ref={canvasRef} className=""></canvas>

                {contents.map((content: string, index: number) => (
                    <div
                        key={index}
                        className={
                            "atom absolute left-0 top-0 h-36 w-36 shrink-0 rounded-full"
                        }
                        ref={(el: HTMLDivElement) => {
                            refs.current?.push(el);
                        }}
                    >
                        {" "}
                        <Atom key={index} text={content} />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default Scene;
