import React from "react";

import { motion } from "motion/react";

const pathVariants = {
    initial: {
        pathLength: 1,
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

export default function AnimatedSunIcon() {
    const [isHovered, setIsHovered] = React.useState(false);
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
                width="28" // Adjust the size here
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Sun center */}
                <motion.circle
                    cx="12"
                    cy="12"
                    r="4"
                    variants={pathVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                />

                {/* Sun rays */}
                <motion.path
                    d="M12 2v2"
                    variants={pathVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                />
                <motion.path
                    d="M12 20v2"
                    variants={pathVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                />
                <motion.path
                    d="M4.93 4.93l1.41 1.41"
                    variants={pathVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                />
                <motion.path
                    d="M17.66 17.66l1.41 1.41"
                    variants={pathVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                />
                <motion.path
                    d="M2 12h2"
                    variants={pathVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                />
                <motion.path
                    d="M20 12h2"
                    variants={pathVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                />
                <motion.path
                    d="M6.34 17.66l-1.41 1.41"
                    variants={pathVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                />
                <motion.path
                    d="M19.07 4.93l-1.41 1.41"
                    variants={pathVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                />
            </motion.svg>
        </motion.div>
    );
}
