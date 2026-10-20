"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { AuthLayout } from "../layouts/auth-layout";
import { SignInView } from "../views/sign-in-view";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <AuthLoading>
                <AuthLayout>
                    <div
                        className="flex min-h-[160px] flex-col items-center justify-center gap-4"
                        role="status"
                        aria-label="Loading KIBO"
                    >
                        <div className="relative flex h-20 w-20 items-center justify-center">
                            <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />

                            <div className="relative h-16 w-16 animate-[pulse_1.8s_ease-in-out_infinite] overflow-hidden rounded-full border-2 border-primary/40 shadow-lg shadow-primary/20">
                                <img
                                    src="/logo.png"
                                    alt="KIBO"
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </div>
                        </div>

                        <p className="animate-pulse text-sm text-muted-foreground">
                            KIBO is getting ready...
                        </p>
                    </div>
                </AuthLayout>
            </AuthLoading>
            <Authenticated>
                {children}
            </Authenticated>
            <Unauthenticated>
                <AuthLayout>
                    <SignInView />
                </AuthLayout>
            </Unauthenticated>
        </>
    );
};