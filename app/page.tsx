import dynamic from "next/dynamic";

const Tree = dynamic(() => import("@/components/React3Fiber/Tree"), {
    ssr: false,
});

export default function Home() {
    return (
        <div className="relative h-full w-full">
            <Tree />
        </div>
    );
}
