import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as documentsIndex } from '@/routes/documents';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-8 px-6 py-8">
                <section className="rounded-3xl border border-black/10 bg-[#f6f3ef] p-8 text-[#1e1d1a] shadow-[0_24px_60px_-40px_rgba(15,14,12,0.6)] dark:border-white/10 dark:bg-[#151311] dark:text-[#f3f1ed]">
                    <div className="flex flex-col gap-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                            Your workspace
                        </span>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold sm:text-3xl">
                                Keep every application polished and ready.
                            </h1>
                            <p className="max-w-2xl text-sm text-[#5f5a55] dark:text-[#b9b4ad]">
                                Manage resumes and cover letters in one place,
                                track drafts, and jump back in whenever you need
                                to tailor a new version.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={documentsIndex()}
                                className="rounded-full bg-[#1e1d1a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black dark:bg-[#f3f1ed] dark:text-[#0e0c0b] dark:hover:bg-white"
                            >
                                View all documents
                            </Link>
                            <Link
                                href={documentsIndex({
                                    query: { status: 'draft' },
                                })}
                                className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-[#1e1d1a] transition hover:border-black/30 dark:border-white/15 dark:text-[#f3f1ed] dark:hover:border-white/40"
                            >
                                Review drafts
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-[#151311]">
                        <div className="flex h-full flex-col gap-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">Resumes</h2>
                                <p className="text-sm text-[#6a655f] dark:text-[#b1aba3]">
                                    Keep tailored resumes organized by role,
                                    format, or experience level.
                                </p>
                            </div>
                            <div className="grid gap-3 text-sm text-[#6a655f] dark:text-[#b1aba3]">
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#c9c1b6] dark:bg-[#6b6259]" />
                                    <span>
                                        Track role-specific versions without
                                        losing your core story.
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#c9c1b6] dark:bg-[#6b6259]" />
                                    <span>
                                        Export polished PDFs as soon as the
                                        draft is ready.
                                    </span>
                                </div>
                            </div>
                            <div className="mt-auto flex flex-wrap gap-3">
                                <Link
                                    href={documentsIndex({
                                        query: { type: 'resume' },
                                    })}
                                    className="rounded-full bg-[#1e1d1a] px-4 py-2 text-sm font-medium text-white transition hover:bg-black dark:bg-[#f3f1ed] dark:text-[#0e0c0b] dark:hover:bg-white"
                                >
                                    View resumes
                                </Link>
                                <Link
                                    href={documentsIndex({
                                        query: { type: 'resume' },
                                    })}
                                    className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#1e1d1a] transition hover:border-black/30 dark:border-white/15 dark:text-[#f3f1ed] dark:hover:border-white/40"
                                >
                                    Create new resume
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-[#151311]">
                        <div className="flex h-full flex-col gap-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">
                                    Cover letters
                                </h2>
                                <p className="text-sm text-[#6a655f] dark:text-[#b1aba3]">
                                    Pair every resume with a focused letter that
                                    matches the job description.
                                </p>
                            </div>
                            <div className="grid gap-3 text-sm text-[#6a655f] dark:text-[#b1aba3]">
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#c9c1b6] dark:bg-[#6b6259]" />
                                    <span>
                                        Save your best openings and reuse them
                                        with quick edits.
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#c9c1b6] dark:bg-[#6b6259]" />
                                    <span>
                                        Keep each letter aligned with the
                                        resume you submit.
                                    </span>
                                </div>
                            </div>
                            <div className="mt-auto flex flex-wrap gap-3">
                                <Link
                                    href={documentsIndex({
                                        query: { type: 'cover_letter' },
                                    })}
                                    className="rounded-full bg-[#1e1d1a] px-4 py-2 text-sm font-medium text-white transition hover:bg-black dark:bg-[#f3f1ed] dark:text-[#0e0c0b] dark:hover:bg-white"
                                >
                                    View cover letters
                                </Link>
                                <Link
                                    href={documentsIndex({
                                        query: { type: 'cover_letter' },
                                    })}
                                    className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#1e1d1a] transition hover:border-black/30 dark:border-white/15 dark:text-[#f3f1ed] dark:hover:border-white/40"
                                >
                                    Create new letter
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-[#6a655f] dark:border-white/10 dark:bg-[#151311] dark:text-[#b1aba3]">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                            Quick tip
                        </div>
                        <p className="mt-2">
                            Refresh your summary for each role to highlight the
                            most relevant wins.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-[#6a655f] dark:border-white/10 dark:bg-[#151311] dark:text-[#b1aba3]">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                            Export
                        </div>
                        <p className="mt-2">
                            Keep your PDFs consistent with the same template and
                            font pairing.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-[#6a655f] dark:border-white/10 dark:bg-[#151311] dark:text-[#b1aba3]">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                            Workflow
                        </div>
                        <p className="mt-2">
                            Duplicate a resume and adjust only the experience
                            bullets needed for the job.
                        </p>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
