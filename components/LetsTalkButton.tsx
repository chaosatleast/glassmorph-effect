"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import { motion } from "motion/react";
import { rotate } from "three/tsl";
import { transition } from "three/examples/jsm/tsl/display/TransitionNode.js";
import { easeIn } from "motion";

const arrowBgVariants = {
    initial: {
        height: "40px",
        width: "40px",
        right: "5px",
        color: "rgb(var(--t-tertiary))",
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
    hover: {
        right: "0px",
        scale: 10,

        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
};

const textVariants = {
    initial: {
        color: "rgb(var(--t-primary))",
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
    hover: {
        color: "rgb(var(--background))",
        left: "10px",
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
};

const arrowVariants = {
    initial: {
        rotate: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
    hover: {
        rotate: -45,
        right: "15px",
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
};

function LetsTalkButton({ children }: { children: React.ReactNode }) {
    const [hovered, setHovered] = React.useState(false);

    return (
        <motion.div
            className="relative flex h-12 w-40 flex-row items-center overflow-hidden rounded-full border border-t-tertiary px-4 py-2 font-medium"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.div
                variants={textVariants}
                initial="initial"
                animate={hovered ? "hover" : "initial"}
                className="relative left-0 z-10"
            >
                {children}
            </motion.div>
            <motion.div
                className="absolute flex items-center justify-center rounded-full bg-t-tertiary text-background"
                variants={arrowBgVariants}
                initial="initial"
                animate={hovered ? "hover" : "initial"}
            ></motion.div>
            <motion.div
                className="absolute right-2.5"
                variants={arrowVariants}
                initial="initial"
                animate={hovered ? "hover" : "initial"}
            >
                <ArrowRight
                    className="h-7 w-7 text-background"
                    strokeWidth={1.5}
                />
            </motion.div>
        </motion.div>
    );
}

export default LetsTalkButton;
