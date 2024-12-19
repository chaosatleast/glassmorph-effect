"use client";

import { motion, stagger, useAnimate, useInView } from "framer-motion";
import React from "react";
import SplitType from "split-type";

type Props = {
    children: React.ReactNode;
    textType: "word" | "char" | "line";
    staggerAmount?: number;
};

function TextSlideUp({ children, textType, staggerAmount }: Props) {
    const [scope, animate] = useAnimate();
    const isInView = useInView(scope, { once: true });

    const staggerMenuItems = stagger(staggerAmount, {
        ease: (p) => Math.sin(p),
    });

    React.useEffect(() => {
        if (!scope.current) return;

        if (isInView) {
            const textSplit: SplitType = new SplitType(scope.current, {
                types: "words,chars",
            });

            if (textSplit?.words || textSplit?.chars || textSplit?.lines) {
                animate(
                    `.${textType}`,
                    { opacity: [0, 1], y: [20, 0] },
                    {
                        duration: 0.3,
                        ease: "easeOut",
                        delay: staggerMenuItems,
                    },
                );
            }
        }
    }, [isInView]);

    return (
        <div>
            <motion.div className="text select-none" ref={scope}>
                {children}
            </motion.div>
        </div>
    );
}

export default TextSlideUp;
