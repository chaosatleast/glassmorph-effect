import Ball from "@/components/Matterjs/Atom";
import Scene from "@/components/Matterjs/Scene";
import TextSlideUp from "@/components/TextSlideUp";
import { contents } from "@/libs/const";

export default function Home() {
    return (
        <div className="relative h-full w-full">
            <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center text-center text-4xl font-bold text-foreground">
                <TextSlideUp textType="word" staggerAmount={0.2}>
                    <>A Frontend Dev’s All-Time Struggles</>
                </TextSlideUp>

                <div className="font-mono text-2xl font-medium text-foreground">
                    <TextSlideUp textType="word" staggerAmount={0.3}>
                        <>CLICK & DRAG</>
                    </TextSlideUp>
                </div>
            </div>

            {/* <div className="absolute z-20 h-full w-full border border-foreground px-6 py-6"></div> */}
            <div className="h-full w-full">
                <Scene />
            </div>
            {/* <div className="absolute left-0 top-0 h-full w-full">
                <div className="flex">
                    {contents.map((content: string, index: number) => (
                        <div key={index} className="shrink-0">
                            <Ball key={index} text={content} />
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
}
