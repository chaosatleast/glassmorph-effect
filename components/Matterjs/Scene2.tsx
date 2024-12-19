"use client";
import { contents } from "@/libs/const";
import Matter, { IEvent, MouseConstraint } from "matter-js";
import p5 from "p5";
import { useContext, useEffect, useRef, useState } from "react";
import CreativeButton from "../CreativeButton";
import { ThemeContext } from "../LayoutWrapper";

interface ICustomMouse extends IEvent<MouseConstraint> {
    body: Matter.Body;
}

// const INITIAL_RADIUS = 50;
const BOUNDARY_HEIGHT = 30;

const DARK_BACKGROUND = "#0d0d0d";
const DARK_FOREGROUND = "#f2f1f0";

const LIGHT_BACKGROUND = "#f2f1f0";
const LIGHT_FOREGROUND = "#0d0d0d";

const LIGHT_PRIMARY_COLOR = "#007aff";
const DARK_PRIMARY_COLOR = "#e6f285";

const Scene2 = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const [shape, setShape] = useState<"atom" | "pill">("pill");

    const [pillArea, setPillArea] = useState({
        width: 200,
        height: 50,
    });

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
        height: number,
        width: number,
    ) {
        const pillRect = Matter.Bodies.rectangle(x, y, width, height, {
            chamfer: { radius: height / 2 },
            label: "atom", // Added label
            restitution: 0.8,
            frictionAir: 0.01,
            friction: 0.05,
            density: 0.001,
        });
        return pillRect;
    }

    function createPills() {
        if (!sceneRef.current) return;

        const { clientHeight, clientWidth } = sceneRef.current;
        const atoms: Matter.Body[] = [];

        let PILL_HEIGHT = 50;
        let PILL_WIDTH = 200;
        if (clientWidth < 769) {
            PILL_HEIGHT = 40;
            PILL_WIDTH = 150;
        } else {
            PILL_HEIGHT = 70;
            PILL_WIDTH = 250;
        }

        contents.forEach((content, index) => {
            const x =
                (index + 1) % 2 === 0
                    ? Math.random() * (clientWidth - PILL_WIDTH) +
                      PILL_WIDTH / 2
                    : Math.random() * (clientWidth - PILL_WIDTH) +
                      PILL_WIDTH / 2;

            const y =
                Math.random() * (clientHeight - PILL_HEIGHT) + PILL_HEIGHT / 2;

            const atom = createSinglePill(x, y, PILL_HEIGHT, PILL_WIDTH);
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

        const engine = Matter.Engine.create({});

        // const render = Matter.Render.create({
        //     element: sceneRef.current,
        //     engine: engine,
        //     options: {
        //         width: clientWidth,
        //         height: clientHeight,
        //         wireframes: false,
        //         background: "transparent",
        //     },
        // });
        // Matter.Render.run(render);

        const boundaries = createBoundaries();
        if (!boundaries) return;
        Matter.World.add(engine.world, boundaries);

        const atomsArr: Matter.Body[] = [];

        if (shape === "pill") {
            const pills = createPills();
            if (!pills) return;
            atomsArr.push(...pills);
            Matter.World.add(engine.world, pills);
            console.log("pills", pills);
        } else {
            const atoms = createAtoms();
            if (!atoms) return;
            atomsArr.push(...atoms);
            Matter.World.add(engine.world, atoms);
        }

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

        // *Enforce boundaries for circle
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

        // *Enforce boundaries for pill
        function enforceBoundariesPill(body: Matter.Body) {
            const minX = BOUNDARY_HEIGHT;
            const maxX = clientWidth - BOUNDARY_HEIGHT;
            const minY = BOUNDARY_HEIGHT;
            const maxY = clientHeight - BOUNDARY_HEIGHT;

            let { x, y } = body.position;
            let { x: vx, y: vy } = body.velocity;

            // Correct position and velocity when out of bounds horizontally
            if (x < minX) {
                x = minX;
                vx = Math.abs(vx); // Reverse velocity to keep it within bounds
            } else if (x > maxX) {
                x = maxX;
                vx = -Math.abs(vx); // Reverse velocity to keep it within bounds
            }

            // Correct position and velocity when out of bounds vertically
            if (y < minY) {
                y = minY;
                vy = Math.abs(vy); // Reverse velocity to keep it within bounds
            } else if (y > maxY) {
                y = maxY;
                vy = -Math.abs(vy); // Reverse velocity to keep it within bounds
            }
            Matter.Body.setVelocity(body, { x: vx, y: vy });
            Matter.Body.setPosition(body, { x, y });
        }

        // *Track the currently dragged body
        let draggedBody: Matter.Body | null = null;

        // *Start drag event
        Matter.Events.on(mouseConstraint, "startdrag", (event) => {
            const e = event as ICustomMouse;

            if (atomsArr.includes(e.body) && shape === "atom") {
                draggedBody = e.body;
                Matter.Body.scale(draggedBody, 2, 2);
            }
            if (atomsArr.includes(e.body) && shape === "pill") {
                draggedBody = e.body;

                Matter.Body.scale(draggedBody, 1.25, 1.25);
            }
        });

        // *Stop drag event
        Matter.Events.on(mouseConstraint, "enddrag", (event) => {
            const e = event as ICustomMouse;
            if (draggedBody === e.body && shape === "atom") {
                Matter.Body.scale(draggedBody, 0.5, 0.5);
                draggedBody = null;
            }
            if (draggedBody === e.body && shape === "pill") {
                Matter.Body.scale(draggedBody, 0.8, 0.8);
                draggedBody = null;
            }
        });

        // *Enforce boundaries on every update
        Matter.Events.on(engine, "beforeUpdate", () => {
            if (shape === "pill") {
                atomsArr.forEach((ball) => enforceBoundariesPill(ball));

                if (draggedBody) {
                    enforceBoundariesPill(draggedBody);
                }
            } else {
                let INITIAL_RADIUS = 50;
                if (clientWidth < 769) {
                    INITIAL_RADIUS = 50;
                } else {
                    INITIAL_RADIUS = 70;
                }
                atomsArr.forEach((ball) =>
                    enforceBoundaries(ball, INITIAL_RADIUS),
                );

                if (draggedBody) {
                    enforceBoundaries(draggedBody, INITIAL_RADIUS * 2);
                }
            }
        });

        // * Mouse leave and enter events
        sceneRef.current.addEventListener("mouseleave", () => {
            if (draggedBody) {
                if (shape === "atom") {
                    Matter.Body.scale(draggedBody, 0.5, 0.5);
                } else {
                    Matter.Body.scale(draggedBody, 0.8, 0.8);
                }

                const boundingX =
                    draggedBody.bounds.max.x - draggedBody.bounds.min.x;
                const boundingY =
                    draggedBody.bounds.max.y - draggedBody.bounds.min.y;

                Matter.Body.setPosition(draggedBody, {
                    x: boundingX,
                    y: boundingY,
                });

                draggedBody = null;
                mouseConstraint.mouse.button = -1;
            }
        });

        function handleResize() {
            Matter.Composite.clear(engine.world, false);

            atomsArr.length = 0;

            const boundaries = createBoundaries();
            if (!boundaries) return;
            Matter.World.add(engine.world, boundaries);

            if (shape === "pill") {
                const pills = createPills();
                if (!pills) return;
                atomsArr.push(...pills);
                Matter.World.add(engine.world, pills);
            } else {
                const atoms = createAtoms();
                if (!atoms) return;
                atomsArr.push(...atoms);
                Matter.World.add(engine.world, atoms);
            }

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

        const p5Instance = new p5((p: p5) => {
            p.setup = () => {
                if (!sceneRef.current) return;

                p.createCanvas(clientWidth, clientHeight);
            };

            p.draw = () => {
                const color =
                    theme === "dark" ? DARK_BACKGROUND : LIGHT_BACKGROUND;

                const itemColor =
                    theme === "dark" ? DARK_PRIMARY_COLOR : LIGHT_PRIMARY_COLOR;

                let strokeColor: p5.Color = p.color(
                    theme === "dark" ? DARK_BACKGROUND : LIGHT_BACKGROUND,
                );

                const draggedColor = p.color(
                    theme === "dark" ? DARK_FOREGROUND : LIGHT_FOREGROUND,
                );

                p.background(color);
                Matter.Engine.update(engine);

                let index = 0;
                strokeColor = p.color(strokeColor);

                Matter.Composite.allBodies(engine.world).forEach((body) => {
                    if (body.label === "atom" && index < contents.length) {
                        if (draggedBody === body) {
                            p.fill(draggedColor);

                            if (shape === "pill") {
                                p.rect(
                                    body.position.x,
                                    body.position.y,
                                    pillArea.width * 1.25,
                                    pillArea.height * 1.25,
                                    (pillArea.height * 1.25) / 2,
                                );
                            } else {
                                if (body.circleRadius) {
                                    p.ellipse(
                                        body.position.x,
                                        body.position.y,
                                        body.circleRadius * 2,
                                    );
                                }
                            }

                            p.textSize(15);
                            p.noStroke();

                            p.fill(strokeColor);
                            p.text(
                                contents[index],
                                draggedBody.position.x,
                                draggedBody.position.y,
                            );
                            p.textAlign(p.CENTER, p.CENTER);
                        } else {
                            p.fill(itemColor);
                            p.stroke(strokeColor);

                            if (shape === "pill") {
                                p.rectMode(p.CENTER);
                                p.push();

                                // Center the canvas at the pill's position
                                p.translate(body.position.x, body.position.y);

                                // Rotate the canvas to match the pill's angle
                                p.rotate(body.angle);

                                // Draw the pill with rounded corners
                                p.rectMode(p.CENTER);
                                p.rect(
                                    0,
                                    0,
                                    pillArea.width,
                                    pillArea.height,
                                    pillArea.height / 2,
                                );
                                p.textAlign(p.CENTER, p.CENTER);
                                p.fill(strokeColor);
                                p.textSize(15);
                                p.noStroke();

                                p.text(contents[index++], 0, 0);
                                p.pop();
                            } else {
                                if (body.circleRadius) {
                                    p.ellipse(
                                        body.position.x,
                                        body.position.y,
                                        body.circleRadius * 2,
                                    );
                                    p.textAlign(p.CENTER, p.CENTER);
                                    p.fill(strokeColor);
                                    p.textSize(15);
                                    p.noStroke();

                                    p.text(
                                        contents[index++],
                                        body.position.x,
                                        body.position.y,
                                    );
                                }
                            }
                        }
                        if (index === contents.length - 1) index = 0;
                    }
                });
            };

            p.windowResized = () => {
                if (!sceneRef.current) return;
                const { clientWidth, clientHeight } = sceneRef.current;
                p.background(0);
                p.clear();
                p.resizeCanvas(clientWidth, clientHeight);

                Matter.Engine.update(engine);
            };
        }, sceneRef.current);

        console.log("p5.js instance created");

        if (typeof window !== "undefined") {
            window.addEventListener("resize", () => {
                handleResize();
            });
        }

        // Cleanup function to remove p5.js instance on unmount
        return () => {
            p5Instance.remove();
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, [theme, shape, pillArea]);

    useEffect(() => {
        const handleResize = () => {
            if (!sceneRef.current) return;
            const { clientWidth } = sceneRef.current;
            if (clientWidth < 769) {
                setPillArea({ width: 150, height: 40 });
            } else {
                setPillArea({ width: 250, height: 70 });
            }
        };

        handleResize();

        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize);
        }
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    return (
        <div className="relative h-full w-full">
            <div className="absolute left-1/4 top-0 flex gap-x-4">
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
