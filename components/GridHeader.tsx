// * Canvas  Grid
"use client";
import p5 from "p5";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "./LayoutWrapper";
import { rect } from "framer-motion/client";

const DARK_BACKGROUND = "#0D0D0D";
const LIGHT_BACKGROUND = "#F4F5F7";
const GRID_SPACING = 5;
const GRID_SIZE = 3;

function GridHeader() {
    const gridRef = useRef(null);

    const { theme } = useContext(ThemeContext);
    const [grid, setGrid] = useState(null);

    useEffect(() => {
        if (!gridRef.current) return;

        const { clientWidth, clientHeight } = gridRef.current;

        const p5Instance = new p5((p: p5) => {
            let rows: number, cols: number;
            let spacing: number;
            const size: number[][] = [];

            p.setup = () => {
                p.createCanvas(clientWidth, clientHeight);

                p.rectMode(p.CENTER);
                p.background(255, 0, 0, 0);

                spacing = GRID_SPACING;
                cols = p.width / spacing;
                rows = p.height / spacing;
                for (let i = 0; i < cols; i++) {
                    size[i] = [];
                    for (let j = 0; j < rows; j++) {
                        size[i][j] = GRID_SIZE;
                    }
                }
            };

            p.draw = () => {
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        p.fill(
                            theme === "dark"
                                ? DARK_BACKGROUND
                                : LIGHT_BACKGROUND,
                        );
                        p.noStroke();

                        p.rect(
                            spacing / 2 + i * spacing,
                            spacing / 2 + j * spacing,
                            size[i][j],
                            size[i][j],
                            0,
                        );
                    }
                }
            };

            p.windowResized = () => {
                console.log("Resized");
                if (!gridRef.current) return;

                const { clientWidth, clientHeight } = gridRef.current;

                // const color =
                //     theme === "dark" ? DARK_BACKGROUND : LIGHT_BACKGROUND;

                p.resizeCanvas(clientWidth, clientHeight);

                spacing = GRID_SPACING;
                cols = p.width / spacing;
                rows = p.height / spacing;
                for (let i = 0; i < cols; i++) {
                    size[i] = [];
                    for (let j = 0; j < rows; j++) {
                        size[i][j] = GRID_SIZE;
                    }
                }
            };
        }, gridRef.current);

        return () => {
            p5Instance.remove();
        };
    }, [theme]);

    return <div className="h-full w-full" ref={gridRef}></div>;
}

export default GridHeader;
