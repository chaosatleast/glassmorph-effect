"use client";

import { ArrowRight, MoonIcon, SunIcon } from "lucide-react";
import Image from "next/image";
import PrimaryButton from "./PrimaryButton";
import { useContext } from "react";
import { ThemeContext } from "./LayoutWrapper";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import LetsTalkButton from "./LetsTalkButton";
import TextWithIconStyle2 from "./TextWithIconStyle2";
import ModeButton from "./ModeButton";
import AnimatedSunIcon from "./AnimatedSunIcon";
import AnimatedMoonIcon from "./AnimatedMoonIcon";
import SlideDownAnimation from "./SlideDownAnimation";

// import PrimaryButton from "./PrimaryButton";

type Props = {
    imageUrl: string;
};

const GridHeader = dynamic(() => import("./GridHeader"), { ssr: false });

function Header({ imageUrl }: Props) {
    const themeContext = useContext(ThemeContext);
    const router = useRouter();
    return (
        <div className="flex h-20 w-full items-center justify-center">
            {/* <div className="absolute left-0 top-0 z-0 h-full w-full bg-blend-overlay">
                <GridHeader />
            </div>
            <div className="absolute left-0 top-0 z-[1] h-full w-full bg-gradient-to-t from-[rgb(var(--background))] to-transparent to-50%"></div> */}
            <div className="relative z-10 flex h-full w-full items-center justify-between px-5">
                <div className="flex flex-row items-center space-x-5">
                    <div
                        className="relative h-12 w-12"
                        onClick={() => router.push("/")}
                    >
                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt="Logo"
                                layout="fill"
                                objectFit="contain"
                                className="h-full w-full"
                            />
                        )}
                    </div>

                    <div className="text-t-tertiary hidden text-sm leading-snug md:block">
                        <SlideDownAnimation>
                            Learning is fun
                            <br /> while Painful –– FPS# 7
                        </SlideDownAnimation>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-x-3 lg:space-x-8">
                    <SlideDownAnimation>
                        <ModeButton
                            onClick={() => {
                                themeContext.setTheme(
                                    themeContext.theme === "dark"
                                        ? "light"
                                        : "dark",
                                );

                                console.log("Mode Clicked");
                            }}
                        >
                            {themeContext.theme === "dark" ? (
                                <AnimatedSunIcon />
                            ) : (
                                <AnimatedMoonIcon />
                            )}
                        </ModeButton>
                    </SlideDownAnimation>
                    <div className="hidden lg:block">
                        {" "}
                        <SlideDownAnimation>
                            <TextWithIconStyle2>PORTFOLIO</TextWithIconStyle2>
                        </SlideDownAnimation>
                    </div>
                    <div className="hidden lg:block">
                        <SlideDownAnimation>
                            <TextWithIconStyle2>BLOG</TextWithIconStyle2>
                        </SlideDownAnimation>
                    </div>
                    <SlideDownAnimation>
                        <LetsTalkButton>
                            <div className="font-semibold">LET's TALK</div>
                        </LetsTalkButton>
                    </SlideDownAnimation>
                </div>
            </div>
        </div>
    );
}

export default Header;
