"use client";
import { contents } from "@/libs/const";
import Matter from "matter-js";
import p5 from "p5";
import { useEffect, useRef } from "react";

const INITIAL_RADIUS = 70;
const BOUNDARY_HEIGHT = 50;

const PILL_LENGTH = 200;
const PILL_HEIGHT = 50;

const Scene2 = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<p5 | null>(null); // Ref to store p5 instance

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

    function createSingleAtom(x: number, y: number) {
        const atom = Matter.Bodies.circle(
            x,
            y,
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
        return atom;
    }

    function createAtoms() {
        if (!sceneRef.current) return;
        const { clientHeight, clientWidth } = sceneRef.current;

        //  *create atom (circle)

        // * Add first item into array
        const atom = createSingleAtom(clientWidth / 2, clientHeight / 2);
        const atoms = [atom];

        for (let index = 0; index < contents.length - 1; index++) {
            // * check if the previous atom is overlapping with the current atom
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
                newAtom = createSingleAtom(x, y);
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

            // * If not overlapping, add the current atom into the array
            atoms.push(newAtom);
        }

        return atoms;
    }

    useEffect(() => {
        if (!sceneRef.current || !canvasRef.current) return; // Ensure the ref is attached
        const { clientHeight, clientWidth } = sceneRef.current;

        const engine = Matter.Engine.create();

        const render = Matter.Render.create({
            element: sceneRef.current,
            engine,
            options: {
                width: clientWidth,
                height: clientHeight,
                wireframes: false,
            },
        });

        const boundaries = createBoundaries();
        if (!boundaries) return;
        Matter.World.add(engine.world, boundaries);

        const atoms = createAtoms();

        console.log("atoms", atoms);
        if (!atoms) return;
        Matter.World.add(engine.world, atoms);

        // const p5Instance = new p5((p: p5) => {
        //     p.setup = () => {
        //         p.background(255);
        //         p.createCanvas(clientWidth, clientHeight).parent(
        //             canvasRef.current as HTMLElement,
        //         );
        //         console.log("p5.js setup initialized");
        //     };

        //     p.draw = () => {
        //         p.background(255); // Clear the background every frame
        //         p.fill(0); // Set fill color to black
        //         p.ellipse(p.mouseX, p.mouseY, 50, 50); // Draw a circle at mouse position
        //     };
        // });

        // p5InstanceRef.current = p5Instance;

        // Cleanup function to remove p5.js instance on unmount
        return () => {
            // if (p5InstanceRef.current) {
            //     p5InstanceRef.current.remove();
            //     p5InstanceRef.current = null;
            // }
            // console.log("p5.js instance removed");
        };
    }, []);

    useEffect(() => {}, []);

    return (
        <div className="relative h-full w-full" ref={sceneRef}>
            {/* <div ref={canvasRef} className="h-full w-full"></div> */}
        </div>
    );
};

export default Scene2;
