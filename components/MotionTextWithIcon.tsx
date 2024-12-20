"use client";

import { motion } from "framer-motion";
import React from "react";

const iconVariants = {
    initial: {
        opacity: 0,
        scale: 0,
        y: 10,
        x: -10,
    },
    hover: {
        x: 1,
        y: 1,
        scale: 1,
        opacity: 0.5,
        transition: {
            duration: 0.5,
            delay: 0.1,
        },
    },
};

const icon2Variants = {
    initial: {
        opacity: 1,
        scale: 1,
        display: "block",
    },
    hover: {
        opacity: 0,
        scale: 0,
        display: "none",
    },
};

type Props = {
    children: React.ReactNode;
    icon: React.ReactNode;
};

const MotionTextWithIcon: React.FC<Props> = ({ children, icon }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            className="relative flex h-fit w-fit flex-row items-center text-foreground"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered ? 0.5 : 1 }}
            >
                {children}
            </motion.div>

            <div className="absolute -right-6 top-0">
                <motion.div
                    className="absolute right-0 top-0"
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                    variants={icon2Variants}
                >
                    {icon}
                </motion.div>
                <motion.div
                    className="absolute right-0 top-0"
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                    variants={iconVariants}
                >
                    {icon}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default MotionTextWithIcon;
