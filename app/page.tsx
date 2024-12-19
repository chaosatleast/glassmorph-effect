import TextSlideUp from "@/components/TextSlideUp";
import dynamic from "next/dynamic";

const Scene2 = dynamic(() => import("@/components/Matterjs/Scene2"), {
    ssr: false,
});

export default function Home() {
    return (
        <div className="relative h-full w-full">
            <div className="mx-lg pointer-events-none absolute top-1/3 z-10 w-full text-center text-3xl font-bold text-neutral-100 mix-blend-difference lg:text-4xl">
                <TextSlideUp textType="word" staggerAmount={0.1}>
                    A Frontend Developer&apos;s <br /> All Time Struggles
                </TextSlideUp>

                <TextSlideUp textType="word" staggerAmount={0.4}>
                    <div className="pt-2 font-mono text-lg font-thin md:text-2xl">
                        CLICK & DRAG
                    </div>
                </TextSlideUp>
            </div>

            <Scene2 />
        </div>
    );
}
