"use client";
import { contents } from "@/libs/const";
import Matter, { IEvent, MouseConstraint } from "matter-js";
import p5 from "p5";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../LayoutWrapper";
import CreativeButton from "../CreativeButton";

interface ICustomMouse extends IEvent<MouseConstraint> {
    body: Matter.Body;
}

// const INITIAL_RADIUS = 50;
const BOUNDARY_HEIGHT = 30;

const PILL_LENGTH = 200;
const PILL_HEIGHT = 50;

const DARK_BACKGROUND = "#0d0d0d";
const DARK_FOREGROUND = "#f2f1f0";

const LIGHT_BACKGROUND = "#f2f1f0";
const LIGHT_FOREGROUND = "#0d0d0d";

const Scene2 = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const [shape, setShape] = useState<"atom" | "pill">("atom");

    const { theme } = useContext(ThemeContext);
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

    function createSingleAtom(x: number, y: number, radius: number) {
        const atom = Matter.Bodies.circle(
            x,
            y,
            radius, // Increased radius from 20 to 50
            {
                label: "atom", // Added label
                restitution: 1,
                frictionAir: 0.01,
                friction: 0,
                density: 1,
                render: {
                    fillStyle: "transparent",
                },
            },
        );
        return atom;
    }

    function createSinglePill(
        x: number,
        y: number,
        PILL_HEIGHT: number,
        PILL_LENGTH: number,
    ) {
        const pillRect = Matter.Bodies.rectangle(
            x,
            y,
            PILL_LENGTH,
            PILL_HEIGHT,
            {
                chamfer: { radius: PILL_HEIGHT / 2 },
                label: "atom", // Added label
                restitution: 1,
                frictionAir: 0.01,
                friction: 0,
                density: 1,
            },
        );
        return pillRect;
    }

    function createPills() {
        if (!sceneRef.current) return;
        const { clientHeight, clientWidth } = sceneRef.current;

        let INITIAL_RADIUS = 50;
        if (clientWidth < 769) {
            INITIAL_RADIUS = 50;
        } else {
            INITIAL_RADIUS = 70;
        }

        //  *create atom (pill)

        const atoms: Matter.Body[] = [];

        contents.forEach((content, index) => {
            const x =
                (index + 1) % 2 === 0
                    ? Math.random() * (clientWidth - PILL_LENGTH * 2) +
                      PILL_LENGTH
                    : Math.random() * (clientWidth - PILL_LENGTH * 2) +
                      PILL_LENGTH;

            const y =
                Math.random() * (clientHeight - PILL_HEIGHT * 2) + PILL_HEIGHT;

            const atom = createSinglePill(x, y, PILL_HEIGHT, PILL_LENGTH);
            atoms.push(atom);
        });

        return atoms;
    }

    function createAtoms() {
        if (!sceneRef.current) return;
        const { clientHeight, clientWidth } = sceneRef.current;

        let INITIAL_RADIUS = 50;
        if (clientWidth < 769) {
            INITIAL_RADIUS = 50;
        } else {
            INITIAL_RADIUS = 70;
        }

        //  *create atom (circle)

        const atoms: Matter.Body[] = [];

        contents.forEach((content, index) => {
            const x =
                (index + 1) % 2 === 0
                    ? Math.random() * (clientWidth - INITIAL_RADIUS * 2) +
                      INITIAL_RADIUS
                    : Math.random() * (clientWidth - INITIAL_RADIUS * 2) +
                      INITIAL_RADIUS;

            const y =
                Math.random() * (clientHeight - INITIAL_RADIUS * 2) +
                INITIAL_RADIUS;

            const atom = createSingleAtom(x, y, INITIAL_RADIUS);
            atoms.push(atom);
        });

        return atoms;
    }

    useEffect(() => {
        if (!sceneRef.current) return; // Ensure the ref is attached
        const { clientHeight, clientWidth } = sceneRef.current;

        const engine = Matter.Engine.create();

        const boundaries = createBoundaries();
        if (!boundaries) return;
        Matter.World.add(engine.world, boundaries);

        let atomsArr = [];
        const atoms = createAtoms();
        console.log("atoms", atoms);
        if (!atoms) return;
        Matter.World.add(engine.world, atoms);
        atomsArr.push(...atoms);

        // *Add runner
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        const mouse = Matter.Mouse.create(sceneRef.current);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,

            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false,
                },
            },
        });

        Matter.World.add(engine.world, mouseConstraint);

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

        // *Track the currently dragged body
        let draggedBody: Matter.Body | null = null;

        // *Start drag event
        Matter.Events.on(mouseConstraint, "startdrag", (event) => {
            const e = event as ICustomMouse;
            if (atomsArr.includes(e.body)) {
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

        // *Enforce boundaries on every update
        Matter.Events.on(engine, "beforeUpdate", () => {
            let INITIAL_RADIUS = 50;
            if (clientWidth < 769) {
                INITIAL_RADIUS = 50;
            } else {
                INITIAL_RADIUS = 70;
            }

            atomsArr.forEach((ball) => enforceBoundaries(ball, INITIAL_RADIUS));

            if (draggedBody) {
                enforceBoundaries(draggedBody, INITIAL_RADIUS * 2);
            }
        });

        // * Mouse leave and enter events
        sceneRef.current.addEventListener("mouseleave", () => {
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

        function handleResize() {
            console.log("Resizing");
            Matter.Composite.clear(engine.world, false);

            atomsArr.length = 0;

            const boundaries = createBoundaries();
            if (!boundaries) return;
            Matter.World.add(engine.world, boundaries);

            const newAtoms = createAtoms();
            console.log("atoms", newAtoms);
            if (!newAtoms) return;
            atomsArr.push(...newAtoms);
            Matter.World.add(engine.world, newAtoms);

            const mouseConstraint = Matter.MouseConstraint.create(engine, {
                mouse: mouse,

                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false,
                    },
                },
            });

            Matter.World.add(engine.world, mouseConstraint);
            Matter.Engine.update(engine);
        }

        window.addEventListener("resize", () => handleResize());

        const p5Instance = new p5((p: p5) => {
            p.setup = () => {
                if (!sceneRef.current) return;

                p.createCanvas(clientWidth, clientHeight);
            };

            p.draw = () => {
                if (!sceneRef.current) return;

                let color =
                    theme === "dark" ? DARK_BACKGROUND : LIGHT_BACKGROUND;

                let itemColor =
                    theme === "dark" ? DARK_BACKGROUND : LIGHT_BACKGROUND;

                let strokeColor: p5.Color = p.color(
                    theme === "dark" ? DARK_FOREGROUND : LIGHT_FOREGROUND,
                );
                p.background(color);
                Matter.Engine.update(engine);

                let index = 0;
                strokeColor = p.color(strokeColor);
                strokeColor.setAlpha(150);
                Matter.Composite.allBodies(engine.world).forEach((body) => {
                    if (
                        body.label === "atom" &&
                        body.circleRadius &&
                        index < contents.length
                    ) {
                        if (draggedBody === body) {
                            strokeColor.setAlpha(255);
                            p.fill(strokeColor);

                            p.ellipse(
                                body.position.x,
                                body.position.y,
                                body.circleRadius * 2,
                            );
                            p.textSize(15);
                            p.noStroke();

                            p.fill(itemColor);
                            p.text(
                                contents[index],
                                draggedBody.position.x,
                                draggedBody.position.y,
                            );
                            p.textAlign(p.CENTER, p.CENTER);
                        } else {
                            strokeColor.setAlpha(150);
                            p.fill(itemColor);
                            p.stroke(strokeColor);
                            p.ellipse(
                                body.position.x,
                                body.position.y,
                                body.circleRadius * 2,
                            );

                            p.fill(strokeColor);
                            p.textSize(15);
                            p.noStroke();
                            p.text(
                                contents[index++],
                                body.position.x,
                                body.position.y,
                            );
                            p.textAlign(p.CENTER, p.CENTER);
                        }
                        if (index === contents.length - 1) index = 0;
                    }
                });
            };

            p.windowResized = () => {
                if (!sceneRef.current) return;
                const { clientWidth, clientHeight } = sceneRef.current;
                p.background(0);
                p.resizeCanvas(clientWidth, clientHeight);
                Matter.Engine.update(engine);
            };
        }, sceneRef.current);

        console.log("p5.js instance created");

        // Cleanup function to remove p5.js instance on unmount
        return () => {
            p5Instance.remove();
            window.removeEventListener("resize", () => handleResize());
        };
    }, [theme]);

    return (
        <div className="relative h-full w-full">
            <div className="absolute left-1/4 top-10 flex gap-x-4">
                <CreativeButton
                    onClick={() => {
                        setShape("atom");
                    }}
                    isActive={shape === "atom"}
                >
                    Atom
                </CreativeButton>

                <CreativeButton
                    onClick={() => {
                        setShape("pill");
                    }}
                    isActive={shape === "pill"}
                >
                    Capsule
                </CreativeButton>
            </div>
            <div className="h-full w-full" ref={sceneRef}></div>
        </div>
    );
};

export default Scene2;
