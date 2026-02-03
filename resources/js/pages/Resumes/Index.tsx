import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import {
    destroy as destroyDocument,
    index as documentsIndex,
    show as showDocument,
    store as storeDocument,
} from '@/routes/documents';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

type DocumentStatus = 'draft' | 'final' | 'archived';

type Document = {
    id: number;
    title: string;
    type: 'resume';
    status: DocumentStatus;
    template_key: string | null;
    content: Record<string, unknown> | null;
    updated_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type DocumentPaginator = {
    data: Document[];
    links: PaginationLink[];
};

type IndexProps = {
    documents: DocumentPaginator;
    filters?: Partial<Pick<Document, 'status'>>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resumes',
        href: '/resumes',
    },
];

const formatStatus = (status: DocumentStatus) =>
    status.charAt(0).toUpperCase() + status.slice(1);

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));

export default function ResumesIndex({ documents }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const form = useForm({
        title: '',
        type: 'resume',
        import_from: '',
    });

    const handleDelete = (documentId: number) => {
        if (!confirm('Delete this resume?')) {
            return;
        }

        router.delete(destroyDocument(documentId).url, {
            preserveScroll: true,
        });
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(storeDocument().url, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset('title');
                setIsCreateOpen(false);
            },
        });
    };

    const counts = documents.data.reduce(
        (acc, document) => {
            acc.total += 1;
            acc[document.status] += 1;
            return acc;
        },
        { total: 0, draft: 0, final: 0, archived: 0 },
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resumes" />

            <div className="flex flex-1 flex-col gap-8 px-6 py-8">
                <section className="rounded-3xl border border-black/10 bg-[#f6f3ef] p-8 text-[#1e1d1a] shadow-[0_24px_60px_-40px_rgba(15,14,12,0.6)] dark:border-white/10 dark:bg-[#151311] dark:text-[#f3f1ed]">
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                                Resumes
                            </span>
                            <h1 className="text-2xl font-semibold sm:text-3xl">
                                Keep every resume tailored and ready to send.
                            </h1>
                            <p className="max-w-2xl text-sm text-[#5f5a55] dark:text-[#b9b4ad]">
                                Track versions by role, keep drafts organized,
                                and export polished PDFs whenever you are ready
                                to apply.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(true)}
                                className="rounded-full bg-[#1e1d1a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black dark:bg-[#f3f1ed] dark:text-[#0e0c0b] dark:hover:bg-white"
                            >
                                Create new resume
                            </button>
                            <Link
                                href={documentsIndex()}
                                className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-[#1e1d1a] transition hover:border-black/30 dark:border-white/15 dark:text-[#f3f1ed] dark:hover:border-white/40"
                            >
                                Open document manager
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-white/80 p-4 text-sm text-[#6a655f] dark:border-white/10 dark:bg-[#151311] dark:text-[#b1aba3]">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                            Total
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-[#1e1d1a] dark:text-[#f3f1ed]">
                            {counts.total}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/80 p-4 text-sm text-[#6a655f] dark:border-white/10 dark:bg-[#151311] dark:text-[#b1aba3]">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                            Drafts
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-[#1e1d1a] dark:text-[#f3f1ed]">
                            {counts.draft}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/80 p-4 text-sm text-[#6a655f] dark:border-white/10 dark:bg-[#151311] dark:text-[#b1aba3]">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                            Final
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-[#1e1d1a] dark:text-[#f3f1ed]">
                            {counts.final}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/80 p-4 text-sm text-[#6a655f] dark:border-white/10 dark:bg-[#151311] dark:text-[#b1aba3]">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                            Archived
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-[#1e1d1a] dark:text-[#f3f1ed]">
                            {counts.archived}
                        </p>
                    </div>
                </section>

                <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {documents.data.length === 0 ? (
                        <div className="col-span-full rounded-3xl border border-dashed border-black/15 bg-white/70 p-10 text-center text-sm text-[#6a655f] dark:border-white/15 dark:bg-[#151311] dark:text-[#b1aba3]">
                            <p className="text-base font-medium text-[#1e1d1a] dark:text-[#f3f1ed]">
                                No resumes yet.
                            </p>
                            <p className="mt-2">
                                Create your first resume to get started.
                            </p>
                            <Button className="mt-6" asChild>
                                <button type="button" onClick={() => setIsCreateOpen(true)}>
                                    Create resume
                                </button>
                            </Button>
                        </div>
                    ) : (
                        documents.data.map((document) => (
                            <div
                                key={document.id}
                                className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#151311]"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-[#6a655f] dark:border-white/15 dark:text-[#b1aba3]">
                                            {formatStatus(document.status)}
                                        </span>
                                        <span className="text-xs text-[#8a837a] dark:text-[#a9a39b]">
                                            Updated {formatDate(document.updated_at)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#1e1d1a] dark:text-[#f3f1ed]">
                                            {document.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-[#6a655f] dark:text-[#b1aba3]">
                                            Resume · {document.template_key ?? 'Classic'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        href={showDocument(document.id)}
                                        className="rounded-full bg-[#1e1d1a] px-4 py-2 text-sm font-medium text-white transition hover:bg-black dark:bg-[#f3f1ed] dark:text-[#0e0c0b] dark:hover:bg-white"
                                    >
                                        Open resume
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="rounded-full"
                                        onClick={() => handleDelete(document.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create a new resume</DialogTitle>
                        <DialogDescription>
                            Give your resume a name and pick a starting template.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="resume-title">Resume name</Label>
                            <Input
                                id="resume-title"
                                name="title"
                                value={form.data.title}
                                onChange={(event) => form.setData('title', event.target.value)}
                                placeholder="e.g. Product Designer Resume"
                                autoFocus
                                aria-invalid={Boolean(form.errors.title)}
                            />
                            <InputError message={form.errors.title} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resume-import">Import from existing</Label>
                            <select
                                id="resume-import"
                                name="import_from"
                                value={form.data.import_from}
                                onChange={(event) =>
                                    form.setData('import_from', event.target.value)
                                }
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                            >
                                <option value="">Do not import</option>
                                {documents.data.map((document) => (
                                    <option key={document.id} value={document.id}>
                                        {document.title}
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.import_from} />
                        </div>
                        <DialogFooter className="gap-2 sm:gap-3">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Creating…' : 'Create resume'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
