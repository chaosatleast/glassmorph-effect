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
                <div className="mx-auto max-w-6xl bg-background">
                    <Header
                        imageUrl={
                            theme === "dark"
                                ? imgDomain + "ChaosAtleast_white.png"
                                : imgDomain + "ChaosAtleast_black.png"
                        }
                    />
                </div>
                <div className="screen-width h-full w-full pb-32 pt-16">
                    {children}
                </div>
                <div className="h-full w-full">
                    <div className="fixed bottom-0 z-10 w-full">
                        <Footer />
                    </div>
                </div>
            </div>
        </ThemeContext.Provider>
    );
}

export default LayoutWrapper;
