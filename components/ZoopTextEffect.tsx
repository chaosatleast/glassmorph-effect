"use client";

import { motion, stagger, useAnimation, useInView } from "motion/react";
import React from "react";
import SplitType from "split-type";

import { animate } from "motion";

const textWhiteVariants = {
    initial: {
        y: "100%",
    },
    animate: {
        y: "0%",
    },
};

const tectBlackVariants = {
    initial: {
        y: "0%",
    },
    animate: {
        y: "-100%",
    },
};

const textVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
};

function ZoopTextEffect({
    children,
    staggerAmount = 0.05,
}: {
    children: React.ReactNode;
    staggerAmount?: number;
}) {
    const controls = useAnimation();
    const [isCenter, setIsCenter] = React.useState(false);
    const textRef = React.useRef<HTMLDivElement>(null);
    const textBlackRef = React.useRef<HTMLDivElement>(null);
    const textWhiteRef = React.useRef<HTMLDivElement>(null);
    const isWhiteTextInView = useInView(textWhiteRef, {
        // once: true, // Trigger only once
        amount: 1,
    });

    const isBlackTextInView = useInView(textBlackRef, {
        // once: true,
        amount: 1,
    });

    const staggerMenuItems = stagger(staggerAmount, {
        ease: (p) => Math.sin(p),
    });

    React.useEffect(() => {
        if (!textWhiteRef.current) return;

        if (isWhiteTextInView) {
            const textSplit: SplitType = new SplitType(textWhiteRef.current, {
                types: "words,chars",
            });
            if (textSplit?.words || textSplit?.chars || textSplit?.lines) {
                const charElements =
                    textWhiteRef.current.querySelectorAll(".char");
                console.log("Char Elements:", charElements);
                animate(
                    charElements,
                    { y: ["110%", "0%"] },

                    {
                        duration: 0.5,
                        delay: staggerMenuItems,
                        ease: "easeInOut",
                    },
                );
            }

            return () => {
                textSplit.revert();
            };
        }
    }, [isWhiteTextInView]);

    React.useEffect(() => {
        if (!textBlackRef.current) return;
        if (isBlackTextInView) {
            const textSplit: SplitType = new SplitType(textBlackRef.current, {
                types: "words,chars",
            });
            if (textSplit?.words || textSplit?.chars || textSplit?.lines) {
                const charElements =
                    textBlackRef.current.querySelectorAll(".char");
                console.log("Char Elements:", charElements);
                animate(
                    charElements,
                    { y: ["0", "-110%"] },

                    {
                        duration: 0.5,
                        delay: staggerMenuItems,
                        ease: "easeInOut",
                    },
                );
            }
            return () => {
                textSplit.revert();
            };
        }
    }, [isBlackTextInView]);

    return (
        <motion.div className="relative block overflow-hidden" ref={textRef}>
            <motion.div
                className="text h-fit select-none leading-none text-black"
                ref={textBlackRef}
            >
                {children}
            </motion.div>
            <motion.div
                className="absolute inset-0 select-none leading-none"
                ref={textWhiteRef}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

export default ZoopTextEffect;
