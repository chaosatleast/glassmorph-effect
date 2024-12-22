"use client";
import { contents } from "@/libs/const";
import Matter, { Composite, IEvent, MouseConstraint, Runner } from "matter-js";
import React, { useEffect } from "react";

interface ICustomMouse extends IEvent<MouseConstraint> {
    body: Matter.Body;
}
const INITIAL_RADIUS = 70;
const BOUNDARY_HEIGHT = 50;

const PILL_LENGTH = 200;
const PILL_HEIGHT = 50;

function Scene1() {
    const sceneRef = React.useRef<HTMLDivElement>(null);

    function createBoundaries() {
        if (!sceneRef.current) return;

        const boundaries = [
            Matter.Bodies.rectangle(
                sceneRef.current.clientWidth / 2,
                0, // Ceiling
                sceneRef.current.clientWidth,
                BOUNDARY_HEIGHT,
                { isStatic: true, restitution: 0.0, label: "boundary" }, // Added label
            ),
            Matter.Bodies.rectangle(
                sceneRef.current.clientWidth / 2,
                sceneRef.current.clientHeight, // Ground
                sceneRef.current.clientWidth,
                BOUNDARY_HEIGHT,
                { isStatic: true, restitution: 0.0, label: "boundary" }, // Added label
            ),
            Matter.Bodies.rectangle(
                0,
                sceneRef.current.clientHeight / 2,
                BOUNDARY_HEIGHT,
                sceneRef.current.clientHeight,
                { isStatic: true, restitution: 0.0, label: "boundary" }, // Added label
            ),
            Matter.Bodies.rectangle(
                sceneRef.current.clientWidth,
                sceneRef.current.clientHeight / 2,
                BOUNDARY_HEIGHT,
                sceneRef.current.clientHeight,
                { isStatic: true, restitution: 0.0, label: "boundary" }, // Added label
            ),
        ];

        return boundaries;
    }

    function createAtoms() {
        if (!sceneRef.current) return;
        const { clientHeight, clientWidth } = sceneRef.current;
        const atom = Matter.Bodies.circle(
            clientWidth / 2,
            clientHeight / 2,
            INITIAL_RADIUS, // Increased radius from 20 to 50
            {
                label: "atom", // Added label
                restitution: 1,
                frictionAir: 0.01,
                friction: 0,
                density: 1,
                render: {
                    fillStyle: "red",
                },
            },
        );

        const atoms = [atom];
        for (let i = 0; i < contents.length; i++) {
            let x, y, newAtom;
            let overlapping;
            do {
                overlapping = false;
                x = Math.max(
                    INITIAL_RADIUS,
                    Math.min(
                        clientWidth - INITIAL_RADIUS,
                        Math.random() * clientWidth,
                    ),
                );
                y = Math.max(
                    INITIAL_RADIUS,
                    Math.min(
                        clientHeight - INITIAL_RADIUS,
                        Math.random() * clientHeight,
                    ),
                );
                newAtom = Matter.Bodies.circle(x, y, INITIAL_RADIUS, {
                    label: "atom", // Added label
                    restitution: 0.5, // Reduced from 1 to 0.5
                    frictionAir: 0.02, // Optional: Increase air friction to reduce velocity
                    friction: 0.01, // Optional: Add slight surface friction
                    density: 0.01,
                    render: {
                        fillStyle: "red",
                    },
                });

                for (const existingBall of atoms) {
                    if (
                        Matter.Collision.collides(newAtom, existingBall)
                            ?.collided
                    ) {
                        overlapping = true;
                        break;
                    }
                }
            } while (overlapping);

            atoms.push(newAtom);
        }
        return atoms;
    }

    function handleWindowResize(engine: Matter.Engine, render: Matter.Render) {
        if (!sceneRef.current) return;
        const { clientHeight, clientWidth } = sceneRef.current;
        Composite.clear(engine.world, false);

        const boundaries = createBoundaries();
        if (!boundaries) return;
        Matter.World.add(engine.world, boundaries);

        const balls = createAtoms();
        if (!balls) return;
        Matter.World.add(engine.world, balls);
    }

    useEffect(() => {
        if (!sceneRef.current) return;
        console.log("Client Height:", sceneRef.current.clientHeight);
        console.log("Client Width:", sceneRef.current.clientWidth);
        console.log("Offset Height:", sceneRef.current.offsetHeight);
        console.log("Offset Width:", sceneRef.current.offsetWidth);

        const { clientHeight, clientWidth } = sceneRef.current;

        const engine = Matter.Engine.create();
        const render = Matter.Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: clientWidth,
                height: clientHeight,
                wireframes: false,
            },
        });

        //* Add boundaries to prevent balls from leaving the scene with labels
        const boundaries = createBoundaries();
        if (!boundaries) return;
        Matter.World.add(engine.world, boundaries);

        //  Pills
        const pillRect = Matter.Bodies.rectangle(
            clientWidth / 2,
            clientHeight / 2,
            PILL_LENGTH,
            PILL_HEIGHT,
            {
                chamfer: { radius: PILL_HEIGHT / 2 },
                label: "atom", // Added label
                restitution: 1,
                frictionAir: 0.01,
                friction: 0,
                density: 1,
                render: {
                    fillStyle: "blue",
                },
            },
        );

        const pill = Matter.Body.create({
            parts: [pillRect],
        });

        Composite.add(engine.world, pill);

        // *Add atoms to the scene
        const balls = createAtoms();
        if (!balls) return;
        Matter.World.add(engine.world, balls);

        // *mouse constraint
        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.5,
                render: {
                    visible: false,
                },
            },
        });

        Matter.World.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        console.log("Mouse Constraint:", mouseConstraint);

        // *Track the currently dragged body
        let draggedBody: Matter.Body | null = null;

        // *Start drag event
        Matter.Events.on(mouseConstraint, "startdrag", (event) => {
            const e = event as ICustomMouse;
            if (balls.includes(e.body)) {
                draggedBody = e.body;
                Matter.Body.scale(draggedBody, 2, 2);
            }
        });

        // *Stop drag event
        Matter.Events.on(mouseConstraint, "enddrag", (event) => {
            const e = event as ICustomMouse;
            if (draggedBody === e.body) {
                Matter.Body.scale(draggedBody, 0.5, 0.5);
                draggedBody = null;
            }
        });

        function enforceBoundaries(body: Matter.Body, radius: number) {
            const { x, y } = body.position;

            const clampedX = Math.max(
                radius,
                Math.min(clientWidth - radius, x),
            );
            const clampedY = Math.max(
                radius,
                Math.min(clientHeight - radius, y),
            );

            const maxSpeed = 10;
            const velocity = body.velocity;
            const speed = Math.sqrt(
                velocity.x * velocity.x + velocity.y * velocity.y,
            );
            if (speed > maxSpeed) {
                Matter.Body.setVelocity(body, {
                    x: (velocity.x / speed) * maxSpeed,
                    y: (velocity.y / speed) * maxSpeed,
                });
            }
            if (x !== clampedX || y !== clampedY) {
                Matter.Body.setPosition(body, {
                    x: clampedX,
                    y: clampedY,
                });
            }
        }

        // *Enforce boundaries on every update
        Matter.Events.on(engine, "beforeUpdate", () => {
            balls.forEach((ball) => enforceBoundaries(ball, INITIAL_RADIUS));

            if (draggedBody) {
                enforceBoundaries(draggedBody, INITIAL_RADIUS * 2);
            }
        });

        // * Mouse leave and enter events
        render.canvas.addEventListener("mouseleave", () => {
            console.log("Mouse Leave");

            if (draggedBody) {
                Matter.Body.scale(draggedBody, 0.5, 0.5);
                const boundingX =
                    draggedBody.bounds.max.x - draggedBody.bounds.min.x;
                const boundingY =
                    draggedBody.bounds.max.y - draggedBody.bounds.min.y;

                console.log("Bounding X:", boundingX);
                Matter.Body.setPosition(draggedBody, {
                    x: boundingX,
                    y: boundingY,
                });

                draggedBody = null;
                mouseConstraint.mouse.button = -1;
            }
        });

        const runner = Runner.create();
        Matter.Render.run(render);
        Runner.run(runner, engine);

        return () => {
            render.canvas.remove();
            render.textures = {};
        };
    }, []);

    return <div className="h-full w-full" ref={sceneRef}></div>;
}

export default Scene1;
