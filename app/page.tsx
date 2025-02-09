import SlideUpAnimation from "@/components/SlideUpAnimation";
import TextRotateSlideUp from "@/components/TextRotateSlideUp";
import dynamic from "next/dynamic";

export default function Home() {
    return (
        <div className="min-h-svh w-screen">
            <div className="">
                <div className="flex h-screen w-full justify-end pb-5 pr-12 text-right">
                    <div className="font-geist-sans text-t-primary pointer-events-none relative flex h-full w-1/2 items-end text-9xl font-black">
                        <SlideUpAnimation>
                            <div className="text-[#f2f2f2]">
                                Frosted Glass Grid
                            </div>
                        </SlideUpAnimation>
                    </div>
                </div>
            </div>
        </div>
    );
}
