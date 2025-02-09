"use client";

import { useAnimate, useInView } from "motion/react";
import React, { use, useState } from "react";
import { motion } from "framer-motion";

function SlideUpAnimation({
    children,
    isReverse = false,
}: {
    children: React.ReactNode;
    isReverse?: boolean;
}) {
    const [scope, animate] = useAnimate();
    const [overflow, setOverflow] = useState("hidden");

    const isInView = useInView(scope, {
        amount: 0,
    });

    React.useEffect(() => {
        if (!scope.current) return;

        if (isInView) {
            setOverflow("auto");
            animate(
                scope.current,
                {
                    y: ["100%", "0%"],
                },
                {
                    duration: 0.5,
                    ease: "easeOut",
                    delay: 1.0,
                },
            ).then(() => {
                setOverflow("visible");
            });
        }
    }, [isInView]);

    return (
        <motion.div className={`h-fit overflow-${overflow}`}>
            <motion.div
                className="h-full w-full"
                ref={scope}
                animate={
                    {
                        // rotate: isReverse ? -360 : 360,
                        // transition: {
                        //     delay: 0.5,
                        //     repeat: Infinity,
                        //     duration: 3,
                        //     type: "spring",
                        // },
                    }
                }
            >
                <div>{children}</div>
            </motion.div>
        </motion.div>
    );
}

export default SlideUpAnimation;
