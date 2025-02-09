"use client";

import React from "react";
import { motion } from "motion/react";
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
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
};

function TextWithIconStyle2({ children }: { children: React.ReactNode }) {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            className="text-t-secondary after:bg-t-tertiary relative flex h-fit w-fit flex-row items-center after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:w-full after:md:bottom-0.5"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div className="text-base">{children}</motion.div>

            <motion.div
                className="absolute -right-6 top-0"
                variants={arrowVariants}
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
            >
                <ArrowRight className="" strokeWidth={1}></ArrowRight>
            </motion.div>
        </motion.div>
    );
}

export default TextWithIconStyle2;
