"use client";

import React from "react";
import { motion } from "motion/react";

function ModeButton({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return <motion.div onClick={onClick}>{children}</motion.div>;
}

export default ModeButton;
