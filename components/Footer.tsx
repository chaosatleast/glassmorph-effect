"use client";

import { ArrowUpRight, Copyright } from "lucide-react";
import React from "react";
import MotionTextWithIcon from "./MotionTextWithIcon";

function Footer() {
    return (
        <div className="z-10 mx-auto h-24 px-24 text-neutral-200">
            <div className="flex h-full w-full flex-row items-center justify-between">
                <div className="flex h-full w-2/3 items-center justify-start space-x-32">
                    <div className="grid h-full grid-cols-1 space-x-4 lg:grid-cols-2">
                        <div className="text-sm text-foreground opacity-80">
                            If you want to know my,
                        </div>
                        <div className="social-link-text">
                            <MotionTextWithIcon
                                icon={
                                    <ArrowUpRight
                                        className="social-link-arrow-icon"
                                        strokeWidth={2.5}
                                    />
                                }
                            >
                                <div className="social-link-text">
                                    PORTFOLIO
                                </div>
                            </MotionTextWithIcon>
                            <MotionTextWithIcon
                                icon={
                                    <ArrowUpRight
                                        className="social-link-arrow-icon"
                                        strokeWidth={2.5}
                                    />
                                }
                            >
                                <div className="social-link-text">GITHUB</div>
                            </MotionTextWithIcon>
                        </div>
                    </div>
                    <div className="grid h-full grid-cols-1 space-x-4 lg:grid-cols-2">
                        <div className="text-sm text-foreground opacity-80">
                            If you want to contact me,
                        </div>
                        <div className="social-link-text">
                            <MotionTextWithIcon
                                icon={
                                    <ArrowUpRight
                                        className="social-link-arrow-icon"
                                        strokeWidth={2.5}
                                    />
                                }
                            >
                                <div className="social-link-text">LINKEDIN</div>
                            </MotionTextWithIcon>
                            <MotionTextWithIcon
                                icon={
                                    <ArrowUpRight
                                        className="social-link-arrow-icon"
                                        strokeWidth={2.5}
                                    />
                                }
                            >
                                <div className="social-link-text">EMAIL</div>
                            </MotionTextWithIcon>
                            <MotionTextWithIcon
                                icon={
                                    <ArrowUpRight
                                        className="social-link-arrow-icon"
                                        strokeWidth={2.5}
                                    />
                                }
                            >
                                <div className="social-link-text">
                                    INSTAGRAM
                                </div>
                            </MotionTextWithIcon>
                        </div>
                    </div>
                </div>
                <div className="flex h-full w-1/3 items-start justify-end">
                    <div className="flex items-center justify-center text-foreground">
                        <Copyright
                            strokeWidth={2}
                            size={14}
                            className="mb-6 mr-1 inline"
                        />
                        <span className="">
                            Alice, @chaosatleast 2024. <br /> All rights
                            reserved.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
