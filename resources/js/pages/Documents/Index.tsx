import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import { type FormEvent } from 'react';

type DocumentType = 'resume' | 'cover_letter';
type DocumentStatus = 'draft' | 'final' | 'archived';

type Document = {
    id: number;
    title: string;
    type: DocumentType;
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
    filters?: Partial<Pick<Document, 'type' | 'status'>>;
};

export default function DocumentsIndex({
    documents,
    filters = {},
}: IndexProps) {
    const resolvedType = filters.type as DocumentType | undefined;
    const pageTitle =
        resolvedType === 'resume'
            ? 'Resumes'
            : resolvedType === 'cover_letter'
              ? 'Cover letters'
              : 'Documents';
    const breadcrumbQuery = {
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.status ? { status: filters.status } : {}),
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: pageTitle,
            href: documentsIndex({ query: breadcrumbQuery }),
        },
    ];
    const form = useForm({
        type: (filters.type as DocumentType) ?? 'resume',
        title: '',
        import_from: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(storeDocument().url, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const handleDelete = (documentId: number) => {
        if (!confirm('Delete this document?')) {
            return;
        }

        router.delete(destroyDocument(documentId).url, {
            preserveScroll: true,
        });
    };

    const formatType = (type: DocumentType) =>
        type === 'cover_letter' ? 'Cover letter' : 'Resume';

    const formatStatus = (status: DocumentStatus) =>
        status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold">{pageTitle}</h1>
                    <p className="text-sm text-muted-foreground">
                        {resolvedType === 'resume'
                            ? 'Create and refine resume versions tailored to each role.'
                            : resolvedType === 'cover_letter'
                              ? 'Track cover letters and keep them aligned with every application.'
                              : 'Create and manage resumes and cover letters in one place.'}
                    </p>
                </div>
                <div className="rounded-xl border border-sidebar-border/70 bg-card shadow-xs dark:border-sidebar-border">
                    <form
                        onSubmit={submit}
                        className="grid gap-4 border-b border-sidebar-border/70 p-4 sm:grid-cols-3 sm:items-end dark:border-sidebar-border"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                name="type"
                                value={form.data.type}
                                onChange={(event) => {
                                    form.setData('type', event.target.value as DocumentType);
                                    form.setData('import_from', '');
                                }}
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                            >
                                <option value="resume">Resume</option>
                                <option value="cover_letter">Cover letter</option>
                            </select>
                            <InputError message={form.errors.type} />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={form.data.title}
                                onChange={(event) =>
                                    form.setData('title', event.target.value)
                                }
                                placeholder="e.g. Product Manager Resume"
                                aria-invalid={Boolean(form.errors.title)}
                                autoComplete="off"
                            />
                            <InputError message={form.errors.title} />
                        </div>

                        <div className="space-y-2 sm:col-span-3">
                            <Label htmlFor="import_from">Import from existing</Label>
                            <select
                                id="import_from"
                                name="import_from"
                                value={form.data.import_from}
                                onChange={(event) =>
                                    form.setData('import_from', event.target.value)
                                }
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                            >
                                <option value="">Do not import</option>
                                {documents.data
                                    .filter((doc) => doc.type === form.data.type)
                                    .map((doc) => (
                                        <option key={doc.id} value={doc.id}>
                                            {doc.title} ({doc.type})
                                        </option>
                                    ))}
                            </select>
                            <InputError message={form.errors.import_from} />
                        </div>

                        <div className="sm:col-span-3">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full sm:w-auto"
                            >
                                {form.processing ? 'Creating…' : 'Create'}
                            </Button>
                        </div>
                    </form>

                    <div className="p-4">
                        {documents.data.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-sidebar-border/70 p-6 text-center text-sm text-muted-foreground dark:border-sidebar-border">
                                No documents yet. Create your first one above.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[560px] divide-y divide-sidebar-border/70 text-sm dark:divide-sidebar-border">
                                    <thead className="text-left text-xs uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-2 font-semibold">
                                                Title
                                            </th>
                                            <th className="px-3 py-2 font-semibold">
                                                Type
                                            </th>
                                            <th className="px-3 py-2 font-semibold">
                                                Status
                                            </th>
                                            <th className="px-3 py-2 font-semibold">
                                                Updated
                                            </th>
                                            <th className="px-3 py-2 font-semibold text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                        {documents.data.map((document) => (
                                            <tr key={document.id}>
                                                <td className="px-3 py-3">
                                                    <Link
                                                        href={showDocument(
                                                            document.id,
                                                        )}
                                                        className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
                                                        prefetch
                                                    >
                                                        {document.title}
                                                    </Link>
                                                </td>
                                                <td className="px-3 py-3 text-muted-foreground">
                                                    {formatType(document.type)}
                                                </td>
                                                <td className="px-3 py-3 text-muted-foreground">
                                                    {formatStatus(
                                                        document.status,
                                                    )}
                                                </td>
                                                <td className="px-3 py-3 text-muted-foreground">
                                                    {new Date(
                                                        document.updated_at,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                document.id,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
