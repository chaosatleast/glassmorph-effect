"use client";

import { contents } from "@/libs/const";
import Matter, { IEvent, MouseConstraint } from "matter-js";
import { motion } from "motion/react";
import p5 from "p5";
import { useEffect, useRef } from "react";

type CircleRefProps = {
    body: Matter.Body;
    circleRadius: number;
    color?: string;
    strokeColor?: string;
};

const INITIAL_RADIUS = 100;

const SCALE_FACTOR = 1.2;

interface ICustomMouse extends IEvent<MouseConstraint> {
    body: Matter.Body;
}

function Scene() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const circleBodyRef = useRef<CircleRefProps[]>([]);
    const wallBodyRef = useRef<Matter.Body[]>([]);
    const mouseConstraintRef = useRef<Matter.MouseConstraint>();

    const refs = useRef<HTMLDivElement[]>([]);

    const p5InstanceRef = useRef<p5 | null>(null); // Ref to store p5 instance

    refs.current = [];

    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Composite = Matter.Composite;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;
    const Body = Matter.Body;
    const Events = Matter.Events;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;

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
        console.log("Creating Walls");
        const h = 40;
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

    const createAtoms = (
        engine: Matter.Engine,
        x: number,
        y: number,
        radius: number,
    ) => {
        const body = Bodies.circle(x, y, radius, {
            restitution: 0.8, // Lower restitution for less bouncing
            friction: 0.05, // Small friction to prevent sliding forever
            density: 0.01, // Light body, adjust if needed
            velocity: { x: 0, y: 0 }, // Start with zero velocity
            isStatic: false, // Dynamic body, will interact with other bodies
            frictionAir: 0.01, // Light air resistance
        });

        Composite.add(engine.world, body);
        return body;
    };

    const beforeUpdate = () => {
        console.log("Before Update");
        circleBodyRef.current.forEach((atom) => {
            const maxSpeed = 10;
            const velocity = atom.body.velocity;
            console.log("Before Update");
            Matter.Body.setVelocity(atom.body, {
                x: Math.max(-maxSpeed, Math.min(velocity.x, maxSpeed)),
                y: Math.max(-maxSpeed, Math.min(velocity.y, maxSpeed)),
            });

            const x = Math.max(50, atom.body.position.x);
            const y = Math.max(50, atom.body.position.y);
            if (x !== atom.body.position.x || y !== atom.body.position.y) {
                Matter.Body.setPosition(atom.body, { x, y });
            }
        });
    };

    const sketchCanvas = () => {
        if (!sceneRef.current) return;
        if (p5InstanceRef.current) {
            return;
        }

        const { clientHeight, clientWidth } = sceneRef.current;

        console.log("Sceneref: ", clientHeight, clientWidth);

        const engine = Engine.create({
            gravity: { x: 0, y: 1 },
            timing: {
                timeScale: 1,
            },
            constraintIterations: 2,
        });

        if (!canvasRef.current) return;

        const mouse = Matter.Mouse.create(canvasRef.current);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }, // Hide the line connecting the mouse
            },
        });

        const render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                pixelRatio: window.devicePixelRatio,
                width: clientWidth,
                height: clientHeight,
                wireframes: true,
                background: "red",
                showDebug: true,
                showCollisions: true,
                showPerformance: true,
            },
        });

        createWalls(engine);
        const runner = Runner.create();
        Render.run(render);
        Runner.run(runner, engine);

        mouseConstraintRef.current = mouseConstraint;
        Matter.Composite.add(engine.world, mouseConstraint);

        // Matter.Events.on(mouseConstraint, "startdrag", (event) => {
        //     const body = event.source.body;
        //     const ref = circleBodyRef.current.find(
        //         (item) => item.body.id == body.id,
        //     );

        //     console.log("startdrag >> refbody", ref);
        //     console.log("startdrag >> actualbody", body);

        //     if (body.circleRadius == INITIAL_RADIUS) {
        //         body.circleRadius = body.circleRadius * SCALE_FACTOR;
        //         Matter.Body.scale(body, SCALE_FACTOR, SCALE_FACTOR);
        //     }
        // });

        // Matter.Events.on(mouseConstraint, "enddrag", (event) => {
        //     const e = event as ICustomMouse;
        //     const body = e.body;
        //     // event.source.body = body;

        //     console.log("enddrag >> actualbody", event);

        //     Matter.Body.scale(body, 0.8, 0.8);
        // });

        // Engine Events
        // Events.on(engine, "beforeUpdate", () => {
        //     Composite.allBodies(engine.world).forEach((atom) => {
        //         if (atom.circleRadius) {
        //             const maxSpeed = 10;
        //             const velocity = atom.velocity;
        //             console.log("Before Update");
        //             Matter.Body.setVelocity(atom, {
        //                 x: Math.max(-maxSpeed, Math.min(velocity.x, maxSpeed)),
        //                 y: Math.max(-maxSpeed, Math.min(velocity.y, maxSpeed)),
        //             });

        //             const x = Math.max(50, atom.position.x);
        //             const y = Math.max(50, atom.position.y);
        //             if (x !== atom.position.x || y !== atom.position.y) {
        //                 Matter.Body.setPosition(atom, { x, y });
        //             }
        //         }
        //     });
        // });

        // p5InstanceRef.current = new p5((sketch) => {
        //     sketch.setup = () => {
        //         sketch.noCanvas();

        //         createWalls(engine);
        //         contents.forEach((content: string, index: number) => {
        //             const x =
        //                 Math.random() * (clientWidth - 2 * INITIAL_RADIUS) +
        //                 INITIAL_RADIUS;
        //             const y =
        //                 Math.random() * (clientHeight - 2 * INITIAL_RADIUS) +
        //                 INITIAL_RADIUS;
        //             const body = createAtoms(engine, x, y, INITIAL_RADIUS);
        //             console.log(body);
        //             circleBodyRef.current.push({
        //                 body,
        //                 circleRadius: INITIAL_RADIUS,
        //                 color: "red",
        //             });
        //         });

        //         Render.run(render);
        //         Runner.run(runner, engine);
        //     };

        //     sketch.draw = () => {
        //         sketch.background(125);
        //         Matter.Engine.update(engine);

        //         circleBodyRef.current.forEach((atom) => {
        //             const { x, y } = atom.body.position;
        //             const radius = atom.body.circleRadius || 100;

        //             sketch.fill(200, 0, 0);
        //             sketch.ellipse(x, y, radius * 2, radius * 2);
        //         });
        //     };

        //     sketch.windowResized = () => {
        //         console.log("resize canvas");
        //         if (!sceneRef.current) return;
        //         const { clientHeight, clientWidth } = sceneRef.current;

        //         sketch.background(125);
        //         circleBodyRef.current = [];

        //         Composite.clear(engine.world, false);
        //         createWalls(engine);
        //         contents.forEach((content: string, index: number) => {
        //             const radius = 100;
        //             const x =
        //                 Math.random() * (clientWidth - 2 * radius) + radius;
        //             const y =
        //                 Math.random() * (clientHeight - 2 * radius) + radius;
        //             const body = createAtoms(engine, x, y, radius);

        //             circleBodyRef.current.push({
        //                 body,
        //                 circleRadius: radius,
        //                 color: "red",
        //             });
        //         });

        //         sketch.resizeCanvas(clientWidth, clientHeight);
        //         sketch.background(125);
        //     };
        // });

        console.log("Canvas Ref", canvasRef.current);
    };

    useEffect(() => {
        sketchCanvas();
        return () => {
            // p5InstanceRef.current?.remove();
            // p5InstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        // const render = Render.create({
        //     element: sceneRef.current,
        //     engine: engine,
        //     canvas: canvasRef.current,
        //     options: {
        //         pixelRatio: window.devicePixelRatio,
        //         width: clientWidth,
        //         height: clientHeight,
        //         wireframes: false,
        //         background: "transparent",
        //         showDebug: true,
        //         showCollisions: true,
        //         showPerformance: true,
        //     },
        // });

        // Add walls to the scene

        // const mouse = Mouse.create(sceneRef.current);
        // const mouseConstraint = MouseConstraint.create(engine, {
        //     mouse: mouse,
        //     constraint: {
        //         stiffness: 0.2,
        //         render: { visible: true },
        //     },
        // });

        // Composite.add(engine.world, mouseConstraint);
        // render.mouse = mouse;

        // const runner = Runner.create();
        // Runner.run(runner, engine);
        // // Render.run(render);

        // console.log(circleBodyRef.current.map((item) => item.position));
        // Events.on(engine, "beforeUpdate", () => beforeUpdate());

        // Events.on(engine, "afterUpdate", () => afterUpdate());

        return () => {
            circleBodyRef.current = [];
        };
    }, []);

    // useEffect(() => {
    //     console.log(circleBodyRef.current.map((item) => item.position));
    // }, [circleBodyRef.current]);

    // useEffect(() => {
    //     // Matter.js code goes here
    //     if (!sceneRef.current || !canvasRef.current) return;

    //     console.log(
    //         sceneRef.current.offsetWidth,
    //         sceneRef.current.offsetHeight,
    //     );
    //     const engine = Engine.create({
    //         gravity: { x: 0, y: 1 },
    //     });
    //     const render = Render.create({
    //         element: sceneRef.current,
    //         engine: engine,
    //         // canvas: canvasRef.current,
    //         options: {
    //             pixelRatio: window.devicePixelRatio,
    //             width: sceneRef.current.offsetWidth,
    //             height: sceneRef.current.offsetHeight,
    //             wireframes: false,
    //             background: "transparent",
    //             showDebug: true,
    //             showCollisions: true,
    //             showPerformance: true,
    //         },
    //     });

    //     // Add walls to the scene
    //     createWalls(engine);

    //     // create atom or pill
    //     createCircles(engine);

    //     const mouse = Mouse.create(sceneRef.current);
    //     const mouseConstraint = MouseConstraint.create(engine, {
    //         mouse: mouse,
    //         constraint: {
    //             stiffness: 0.2,
    //             render: { visible: true },
    //         },
    //     });

    //     Composite.add(engine.world, mouseConstraint);
    //     render.mouse = mouse;

    //     const runner = Runner.create();
    //     Runner.run(runner, engine);
    //     Render.run(render);

    //     // Engine Events
    //     Events.on(engine, "beforeUpdate", () => beforeUpdate());

    //     Events.on(engine, "afterUpdate", () => afterUpdate());

    //     window.addEventListener("resize", () => {
    //         Events.off(engine, "afterUpdate", () => afterUpdate());
    //         Events.off(engine, "beforeUpdate", () => beforeUpdate());

    //         handleResize(engine, render);

    //         Events.on(engine, "beforeUpdate", () => beforeUpdate());
    //         Events.on(engine, "afterUpdate", () => afterUpdate());
    //     });
    //     return () => {
    //         Render.stop(render);
    //         Engine.clear(engine);
    //         window.removeEventListener("resize", () => {
    //             handleResize(engine, render);
    //         });
    //     };
    // }, [refs]);

    // useEffect(() => {
    //     console.log(refs.current.length); // This should print 10 if all 10 balls are correctly created.
    // }, [refs]);

    return (
        <div
            className="h-full w-full"
            // initial={{ scale: 5 }}
            // whileInView={{ scale: 1 }}
            ref={sceneRef}
        >
            {/* <div ref={canvasRef} className="h-full w-full"></div> */}
        </div>
    );
}

export default Scene;
