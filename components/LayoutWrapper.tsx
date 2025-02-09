"use client";
import { usePathname } from "next/navigation";
import React, { createContext, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Image from "next/image";
import Scene from "./React3Fiber/Scene";

type Props = {
    children: React.ReactNode;
};

export const ThemeContext = createContext<{
    theme: "dark" | "light";
    setTheme: React.Dispatch<React.SetStateAction<"dark" | "light">>;
}>({
    theme: "dark",
    setTheme: () => {},
});

const imgDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;

function LayoutWrapper({ children }: Props) {
    const [theme, setTheme] = useState("light" as "dark" | "light");

    const pathname = usePathname();

    if (pathname.includes("/admin")) {
        return <> {children} </>;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <div
                className={"scrollbar-invisible touch-auto bg-background " + ""}
                style={{
                    scrollbarWidth: "none",
                }}
            >
                <div className="">
                    {/* Header  */}
                    <div className="fixed left-0 top-0 z-0 h-screen w-screen">
                        <div className="hidden h-full w-full md:block">
                            <Scene />
                        </div>
                    </div>

                    <div className="fixed top-0 z-50 w-full">
                        <Header
                            imageUrl={
                                theme === "dark"
                                    ? imgDomain +
                                      "logo-nobg/Chaosatleast-bg-transparent-white.png"
                                    : imgDomain +
                                      "logo-nobg/Chaosatleast-bg-transparent-black.png"
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        {/* Body */}

                        <div className="">{children}</div>
                        <div className="relative">
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </ThemeContext.Provider>
    );
}

export default LayoutWrapper;
