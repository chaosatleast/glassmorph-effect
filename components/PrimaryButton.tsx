"use client";

import React from "react";

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
};

function PrimaryButton({ children, onClick }: Props) {
    return (
        <button
            className="rounded-md border border-solid border-foreground bg-background px-2 py-1"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default PrimaryButton;
