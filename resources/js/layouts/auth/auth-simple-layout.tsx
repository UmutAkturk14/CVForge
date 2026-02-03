import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-[#f6f3ef] px-6 py-10 text-[#1e1d1a] dark:bg-[#0e0c0b] dark:text-[#f3f1ed]">
            <div className="w-full max-w-md">
                <div className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_24px_60px_-40px_rgba(15,14,12,0.6)] backdrop-blur dark:border-white/10 dark:bg-[#151311]">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2 text-center">
                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                                {name}
                            </span>
                            <h1 className="text-2xl font-semibold">{title}</h1>
                            <p className="text-sm text-[#6a655f] dark:text-[#b1aba3]">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
