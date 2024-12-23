import Scene1 from "@/components/Matterjs/Scene1";
import Scene2 from "@/components/Matterjs/Scene2";
import Scene3 from "@/components/Matterjs/Scene3";
import TextSlideUp from "@/components/TextSlideUp";

export default function Home() {
    return (
        <div className="relative h-full w-full">
            <div className="pointer-events-none absolute top-1/3 z-10 w-full text-center text-3xl font-bold text-neutral-300 mix-blend-difference lg:text-4xl">
                <TextSlideUp textType="word" staggerAmount={0.1}>
                    A Frontend Developer's All Time Struggles
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
