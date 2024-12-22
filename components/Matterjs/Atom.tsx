"use client";

import { motion, useAnimate } from "framer-motion";
import { div, s } from "framer-motion/client";
import Matter from "matter-js";
import React, { forwardRef, use, useEffect, useRef, useState } from "react";

type Props = {
    text: string;
};

const Atom = forwardRef<HTMLDivElement | null, Props>(function Atom(
    { text },
    ref,
) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-36 w-36 items-center justify-center rounded-full border border-foreground bg-transparent text-center text-lg text-foreground opacity-90"
        >
            {text}
        </motion.div>
    );
});

export default Atom;
