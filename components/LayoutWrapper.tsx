"use client";
import React, { createContext, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

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
    const [theme, setTheme] = useState("dark" as "dark" | "light");
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <div
                className={
                    "fixed h-screen w-full bg-background " +
                    (theme == "dark" ? "dark" : "")
                }
            >
                <div className="relative h-full w-full">
                    <div className="absolute top-0 z-50 h-16 w-full">
                        <Header
                            imageUrl={
                                theme === "dark"
                                    ? imgDomain + "ChaosAtleast_white.png"
                                    : imgDomain + "ChaosAtleast_black.png"
                            }
                        />
                    </div>
                    <div className="relative top-16 h-[calc(100%_-_230px)] w-full md:h-[calc(100%_-_180px)]">
                        {children}
                    </div>
                    <div className="absolute bottom-0 z-50 w-full">
                        <Footer />
                    </div>
                </div>
            </div>
        </ThemeContext.Provider>
    );
}

export default LayoutWrapper;
