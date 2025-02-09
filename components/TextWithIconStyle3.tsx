"use client";

import React from "react";
import { color, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const arrowVariants = {
    initial: {
        rotate: 0,
        opacity: 0,
        x: 10,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
    hover: {
        rotate: -45,
        opacity: 1,
        x: -4,
        color: "rgb(var(--n-primary))",
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
};

const textVariants = {
    initial: {
        color: "rgb(var(--t-secondary))",
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
    hover: {
        color: "rgb(var(--n-primary))",
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
};

function TextWithIconStyle3({
    children,
    icon,
}: {
    children: React.ReactNode;
    icon?: React.ReactNode;
}) {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            className="text-t-secondary relative flex h-fit w-fit cursor-pointer flex-row items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="text-base"
                variants={textVariants}
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
            >
                {children}
            </motion.div>

            <motion.div
                className="absolute -right-6 top-0"
                variants={arrowVariants}
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
            >
                {icon ? (
                    icon
                ) : (
                    <ArrowRight className="" strokeWidth={1.5}></ArrowRight>
                )}
            </motion.div>
        </motion.div>
    );
}

export default TextWithIconStyle3;
