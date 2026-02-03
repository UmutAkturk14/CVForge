import { dashboard, home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth, name } = usePage<SharedData>().props;

    return (
        <>
            <Head title={name}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-[#f6f3ef] text-[#1e1d1a] dark:bg-[#0e0c0b] dark:text-[#f3f1ed]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:py-16">
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href={home()}
                            className="text-lg font-semibold tracking-tight"
                        >
                            {name}
                        </Link>
                        <nav className="flex items-center gap-3 text-sm">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full border border-black/10 px-4 py-2 font-medium text-[#1e1d1a] transition hover:border-black/30 dark:border-white/15 dark:text-[#f3f1ed] dark:hover:border-white/40"
                                >
                                    Go to dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-full border border-transparent px-4 py-2 font-medium text-[#1e1d1a] transition hover:border-black/20 dark:text-[#f3f1ed] dark:hover:border-white/30"
                                    >
                                        Sign in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-full border border-black/15 bg-white px-4 py-2 font-medium text-[#1e1d1a] shadow-sm transition hover:border-black/30 dark:border-white/15 dark:bg-[#1a1715] dark:text-[#f3f1ed] dark:hover:border-white/40"
                                        >
                                            Create account
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                                    Resume + cover letters
                                </span>
                                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                                    Build standout resumes in minutes, not
                                    weekends.
                                </h1>
                                <p className="max-w-xl text-base text-[#5f5a55] dark:text-[#b9b4ad]">
                                    CVForge helps you craft polished resumes and
                                    cover letters with guided sections, focused
                                    templates, and instant PDF exports.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-full bg-[#1e1d1a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black dark:bg-[#f3f1ed] dark:text-[#0e0c0b] dark:hover:bg-white"
                                    >
                                        Continue building
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            className="rounded-full bg-[#1e1d1a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black dark:bg-[#f3f1ed] dark:text-[#0e0c0b] dark:hover:bg-white"
                                        >
                                            Start for free
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-[#1e1d1a] transition hover:border-black/30 dark:border-white/15 dark:text-[#f3f1ed] dark:hover:border-white/40"
                                        >
                                            Sign in
                                        </Link>
                                    </>
                                )}
                            </div>

                            <div className="grid gap-3 text-sm text-[#6a655f] dark:text-[#b1aba3]">
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#c9c1b6] dark:bg-[#6b6259]" />
                                    <span>
                                        Step-by-step sections for experience,
                                        education, and skills.
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#c9c1b6] dark:bg-[#6b6259]" />
                                    <span>
                                        Save multiple versions and tailor each
                                        one to the job.
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#c9c1b6] dark:bg-[#6b6259]" />
                                    <span>
                                        Export clean PDFs whenever you are ready
                                        to apply.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-[0_24px_60px_-40px_rgba(15,14,12,0.6)] dark:border-white/10 dark:bg-[#151311]">
                                <img
                                    src="https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?q=80&w=696&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Typewriter on a desk"
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-xs font-medium text-[#1e1d1a] shadow-lg lg:block dark:border-white/10 dark:bg-[#1b1917] dark:text-[#f3f1ed]">
                                Export in one click
                            </div>
                            <div className="absolute -top-6 -right-4 hidden rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-xs font-medium text-[#1e1d1a] shadow-lg lg:block dark:border-white/10 dark:bg-[#1b1917] dark:text-[#f3f1ed]">
                                ATS-friendly layouts
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
