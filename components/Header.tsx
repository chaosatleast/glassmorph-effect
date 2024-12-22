"use client";

import { SunIcon } from "lucide-react";
import Image from "next/image";
import PrimaryButton from "./PrimaryButton";
import { useContext } from "react";
import { ThemeContext } from "./LayoutWrapper";
// import PrimaryButton from "./PrimaryButton";

type Props = {
    imageUrl: string;
};

function Header({ imageUrl }: Props) {
    const themeContext = useContext(ThemeContext);
    return (
        <div className="flex h-full w-full items-center justify-center px-5">
            <div className="screen-width-header flex h-full w-full items-center justify-between">
                <div className="relative h-10 w-10 rounded-full">
                    {imageUrl && (
                        <Image
                            src={imageUrl}
                            alt="Logo"
                            layout="fill"
                            objectFit="contain"
                            className="h-full w-full rounded-full"
                        />
                    )}
                </div>

                <div className="flex items-center justify-center space-x-2">
                    <PrimaryButton
                        onClick={() => {
                            themeContext.setTheme(
                                themeContext.theme === "dark"
                                    ? "light"
                                    : "dark",
                            );

                            console.log("Mode Clicked");
                        }}
                    >
                        <SunIcon className="h-6 w-5 text-foreground" />
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}

export default Header;
