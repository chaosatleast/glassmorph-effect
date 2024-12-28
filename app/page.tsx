import Grid from "@/components/React3Fiber/Grid";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../components/React3Fiber/Scene"), {
    ssr: false,
});

export default function Home() {
    return (
        <div className="relative h-full w-full">
            <div className="absolute left-0 top-0 z-10 h-full w-full">
                {" "}
                <Scene />
            </div>
        </div>
    );
}
