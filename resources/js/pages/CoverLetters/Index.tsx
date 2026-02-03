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
import { type CoverLetterContent } from '@/pages/Documents/types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

type DocumentStatus = 'draft' | 'final' | 'archived';

type Document = {
    id: number;
    title: string;
    type: 'cover_letter';
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
        title: 'Cover letters',
        href: '/coverletters',
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

export default function CoverLettersIndex({ documents }: IndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const form = useForm({
        title: '',
        type: 'cover_letter',
        import_from: '',
    });

    const handleDelete = (documentId: number) => {
        if (!confirm('Delete this cover letter?')) {
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
            <Head title="Cover letters" />

            <div className="flex flex-1 flex-col gap-8 px-6 py-8">
                <section className="rounded-3xl border border-black/10 bg-[#f6f3ef] p-8 text-[#1e1d1a] shadow-[0_24px_60px_-40px_rgba(15,14,12,0.6)] dark:border-white/10 dark:bg-[#151311] dark:text-[#f3f1ed]">
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a837a] dark:text-[#a9a39b]">
                                Cover letters
                            </span>
                            <h1 className="text-2xl font-semibold sm:text-3xl">
                                Write thoughtful letters that match every role.
                            </h1>
                            <p className="max-w-2xl text-sm text-[#5f5a55] dark:text-[#b9b4ad]">
                                Keep your best openings, align each letter with
                                the resume it supports, and export whenever you
                                are ready to apply.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(true)}
                                className="rounded-full bg-[#1e1d1a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black dark:bg-[#f3f1ed] dark:text-[#0e0c0b] dark:hover:bg-white"
                            >
                                Create new letter
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
                                No cover letters yet.
                            </p>
                            <p className="mt-2">
                                Create your first cover letter to get started.
                            </p>
                            <Button className="mt-6" asChild>
                                <button type="button" onClick={() => setIsCreateOpen(true)}>
                                    Create cover letter
                                </button>
                            </Button>
                        </div>
                    ) : (
                        documents.data.map((document) => (
                            <div
                                key={document.id}
                                className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#151311]"
                            >
                                {(() => {
                                    const content =
                                        document.content as Partial<CoverLetterContent> | null;
                                    const meta = content?.meta;
                                    const sender = content?.sender;
                                    const jobLocation = (
                                        meta as { job_location?: string } | undefined
                                    )?.job_location;
                                    const recipient = [meta?.recipient_name, meta?.recipient_title]
                                        .filter(Boolean)
                                        .join(' · ');
                                    const contact = [
                                        sender?.full_name,
                                        sender?.email,
                                        sender?.phone,
                                    ]
                                        .filter(Boolean)
                                        .join(' · ');
                                    const language = content?.language?.toUpperCase();
                                    const infoRows = [
                                        { label: 'Company', value: meta?.company_name },
                                        { label: 'Role', value: meta?.job_title },
                                        { label: 'Location', value: jobLocation },
                                        { label: 'Recipient', value: recipient },
                                        { label: 'Contact', value: contact },
                                        { label: 'Language', value: language },
                                    ].filter((row) => row.value);

                                    return (
                                        <>
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
                                                        Cover letter ·{' '}
                                                        {document.template_key ?? 'Classic'}
                                                    </p>
                                                </div>
                                                <dl className="grid gap-2 text-xs text-[#6a655f] dark:text-[#b1aba3]">
                                                    {infoRows.length > 0 ? (
                                                        infoRows
                                                            .slice(0, 4)
                                                            .map((row) => (
                                                                <div
                                                                    key={row.label}
                                                                    className="flex items-start justify-between gap-3"
                                                                >
                                                                    <dt className="font-medium text-[#8a837a] dark:text-[#a9a39b]">
                                                                        {row.label}
                                                                    </dt>
                                                                    <dd className="text-right text-[#3f3a34] dark:text-[#e2ded8]">
                                                                        {row.value}
                                                                    </dd>
                                                                </div>
                                                            ))
                                                    ) : (
                                                        <div className="text-[#8a837a] dark:text-[#a9a39b]">
                                                            Add company and contact details to
                                                            make this letter stand out.
                                                        </div>
                                                    )}
                                                </dl>
                                            </div>
                                            <div className="mt-6 flex flex-wrap gap-3">
                                                <Link
                                                    href={showDocument(document.id)}
                                                    className="rounded-full bg-[#1e1d1a] px-4 py-2 text-sm font-medium text-white transition hover:bg-black dark:bg-[#f3f1ed] dark:text-[#0e0c0b] dark:hover:bg-white"
                                                >
                                                    Open letter
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    className="rounded-full"
                                                    onClick={() => handleDelete(document.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        ))
                    )}
                </section>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create a new cover letter</DialogTitle>
                        <DialogDescription>
                            Add a title and choose the template for this letter.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="letter-title">Letter name</Label>
                            <Input
                                id="letter-title"
                                name="title"
                                value={form.data.title}
                                onChange={(event) => form.setData('title', event.target.value)}
                                placeholder="e.g. Acme Marketing Lead Letter"
                                autoFocus
                                aria-invalid={Boolean(form.errors.title)}
                            />
                            <InputError message={form.errors.title} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="letter-import">Import from existing</Label>
                            <select
                                id="letter-import"
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
                                {form.processing ? 'Creating…' : 'Create letter'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
