// * Canvas  Grid
"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import p5 from "p5";
import { ThemeContext } from "../LayoutWrapper";
import { color } from "motion/react";

const DARK_BACKGROUND = "#0D0D0D";
const LIGHT_BACKGROUND = "#F2F1F0";
const SPACING = 100;

function Grid() {
    const gridRef = useRef(null);

    const { theme } = useContext(ThemeContext);
    const [grid, setGrid] = useState(null);

    useEffect(() => {
        if (!gridRef.current) return;

        const { clientWidth, clientHeight } = gridRef.current;

        const p5Instance = new p5((p: p5) => {
            let rows: number, cols: number;
            let spacing: number;

            p.setup = () => {
                p.createCanvas(clientWidth, clientHeight);

                if (clientWidth < 426) {
                    spacing = 30;
                } else if (clientWidth < 769) {
                    spacing = 45;
                } else if (clientWidth < 1441) {
                    spacing = 60;
                } else {
                    spacing = 100;
                }
                cols = p.width / spacing;
                rows = p.height / spacing;
            };

            p.draw = () => {
                const color =
                    theme === "dark" ? DARK_BACKGROUND : LIGHT_BACKGROUND;

                p.noFill();

                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        p.noFill();
                        // p.noStroke();
                        p.rect(i * spacing, j * spacing, spacing, spacing, 10);
                    }
                }
            };

            p.windowResized = () => {
                console.log("Resized");
                if (!gridRef.current) return;

                const { clientWidth, clientHeight } = gridRef.current;

                const color =
                    theme === "dark" ? DARK_BACKGROUND : LIGHT_BACKGROUND;

                p.createCanvas(clientWidth, clientHeight);
                p.background(color);

                if (clientWidth < 426) {
                    spacing = 30;
                } else if (clientWidth < 769) {
                    spacing = 45;
                } else if (clientWidth < 1441) {
                    spacing = 60;
                } else {
                    spacing = 100;
                }
                cols = p.width / spacing;
                rows = p.height / spacing;
                p.redraw();
            };
        }, gridRef.current);

        return () => {
            p5Instance.remove();
        };
    }, [theme, gridRef]);

    return <div className="grid-plane h-full w-full" ref={gridRef}></div>;
}

export default Grid;
