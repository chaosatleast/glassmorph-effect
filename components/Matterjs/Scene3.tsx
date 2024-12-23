"use client";
// pages/index.js

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import p5 from "p5";

const Scene3 = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Setup Matter.js engine
        const engine = Matter.Engine.create();
        const world = engine.world;

        let rectBody: any;

        // p5.js sketch setup
        const sketch = (p) => {
            p.setup = () => {
                p.createCanvas(800, 600);

                // Create the rectangle body with Matter.js
                rectBody = Matter.Bodies.rectangle(400, 300, 100, 50);
                Matter.Body.setAngularVelocity(rectBody, 0.2);
                Matter.Composite.add(world, rectBody);
            };

            p.draw = () => {
                p.background(255); // Clear the canvas

                // Update the Matter.js engine
                Matter.Engine.update(engine);

                // Display the rectangle using p5.js
                p.push();
                p.rectMode(p.CENTER);
                const { x, y } = rectBody.position;
                const angle = rectBody.angle;
                p.translate(x, y);
                p.rotate(angle);
                p.rect(0, 0, 100, 50);
                p.pop();
            };
        };

        // Initialize the p5 sketch
        if (canvasRef.current) new p5(sketch, canvasRef.current);

        return () => {
            // Clean up p5 instance on unmount
            // p5.remove();
        };
    }, []);

    return <div ref={canvasRef} />;
};

export default Scene3;
