"use client";
import { motion } from "motion/react";
import { useState } from "react";

const pathVariants = {
    initial: {
        pathLength: 10,
        color: "rgb(var(--t-tertiary))",
        transition: {
            duration: 0.5,
            ease: "easeInOut",
        },
    },
    hover: {
        pathLength: [0, 1, 0],
        color: "rgb(var(--t-tertiary))",
        transition: {
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
        },
    },
};

export default function AnimatedMoonIcon() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className=""
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2 }} // Enlarge slightly on hover
            whileTap={{ scale: 0.95 }} // Shrink slightly on tap
        >
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="24" // Adjust size here
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <motion.path
                    d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
                    variants={pathVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                />
            </motion.svg>
        </motion.div>
    );
}
