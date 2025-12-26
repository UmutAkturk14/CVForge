import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import {
    destroy as destroyDocument,
    index as documentsIndex,
    show as showDocument,
    update as updateDocument,
} from '@/routes/documents';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { CoverLetterPreview } from './components/CoverLetterPreview';
import { ResumePreview } from './components/ResumePreview';
import { createCoverLetterSections } from './components/cover-letter-sections';
import { createResumeSections } from './components/resume-sections';
import {
    defaultCoverLetterContent,
    defaultResumeContent,
    type CoverLetterContent,
    type CoverLetterCustomSection,
    type CoverLetterSender,
    type Document,
    type DocumentStatus,
    type EditProps,
    type ResumeContent,
    type ResumeCustomSection,
    type Section,
    type TemplateKey,
} from './types';

export default function EditDocument({ document }: EditProps) {
    const initialContent = useMemo<ResumeContent | CoverLetterContent>(() => {
        if (document.type === 'resume') {
            return { ...defaultResumeContent(), ...(document.content ?? {}) };
        }

        return { ...defaultCoverLetterContent(), ...(document.content ?? {}) };
    }, [document.content, document.type]);

    const [content, setContent] = useState<ResumeContent | CoverLetterContent>(
        initialContent,
    );
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);

    const form = useForm({
        title: document.title,
        status: document.status,
        template_key:
            (document.template_key as TemplateKey | null) ?? 'classic',
        content: initialContent,
    });

    useEffect(() => {
        form.setData('content', content);
    }, [content]);

    useEffect(() => {
        setActiveSectionIndex(0);
    }, [document.type]);

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: 'Documents',
                href: documentsIndex(),
            },
            {
                title: document.title,
                href: showDocument(document.id),
            },
        ],
        [document.id, document.title],
    );

    const statusLabel = (status: DocumentStatus) =>
        status.charAt(0).toUpperCase() + status.slice(1);

    const handleDelete = () => {
        if (!confirm('Delete this document?')) {
            return;
        }

        router.delete(destroyDocument(document.id).url);
    };

    const updateContent = (
        updater: (
            previous: ResumeContent | CoverLetterContent,
        ) => ResumeContent | CoverLetterContent,
    ) => {
        setContent((previous) => updater(previous));
    };

    const updateResumeField = <Key extends keyof ResumeContent['profile']>(
        field: Key,
        value: ResumeContent['profile'][Key],
    ) => {
        updateContent((prev) => ({
            ...(prev as ResumeContent),
            profile: {
                ...(prev as ResumeContent).profile,
                [field]: value,
            },
        }));
    };

    const updateResumeArrayItem = <
        Key extends keyof Pick<
            ResumeContent,
            'links' | 'experience' | 'education' | 'skills' | 'languages'
        >,
    >(
        key: Key,
        index: number,
        value: unknown,
    ) => {
        updateContent((prev) => {
            const current = prev as ResumeContent;
            const nextItems = [...(current[key] as unknown[])];
            nextItems[index] = value;
            return {
                ...current,
                [key]: nextItems as ResumeContent[Key],
            };
        });
    };

    const addResumeItem = <
        Key extends keyof Pick<
            ResumeContent,
            'links' | 'experience' | 'education' | 'skills' | 'languages'
        >,
    >(
        key: Key,
        blankItem: ResumeContent[Key][number],
    ) => {
        updateContent((prev) => {
            const current = prev as ResumeContent;
            return {
                ...current,
                [key]: [
                    ...(current[key] as unknown[]),
                    blankItem,
                ] as ResumeContent[Key],
            };
        });
    };

    const updateCustomSection = (index: number, value: ResumeCustomSection) => {
        updateContent((prev) => {
            const current = prev as ResumeContent;
            const nextSections = [...current.custom_sections];
            nextSections[index] = value;
            return {
                ...current,
                custom_sections: nextSections,
            };
        });
    };

    const updateCoverLetterField = <
        Key extends keyof Pick<
            CoverLetterContent,
            'meta' | 'sender' | 'settings' | 'layout'
        >,
        NestedKey extends keyof CoverLetterContent[Key],
    >(
        key: Key,
        nested: NestedKey,
        value: CoverLetterContent[Key][NestedKey],
    ) => {
        updateContent((prev) => ({
            ...(prev as CoverLetterContent),
            [key]: {
                ...(prev as CoverLetterContent)[key],
                [nested]: value,
            },
        }));
    };

    const updateCoverLetterSenderList = <
        Key extends keyof Pick<CoverLetterSender, 'links' | 'extra_fields'>,
    >(
        key: Key,
        index: number,
        value: CoverLetterSender[Key][number],
    ) => {
        updateContent((prev) => {
            const current = prev as CoverLetterContent;
            const nextList = [...current.sender[key]];
            nextList[index] = value;
            return {
                ...current,
                sender: {
                    ...current.sender,
                    [key]: nextList as CoverLetterSender[Key],
                },
            };
        });
    };

    const addCoverLetterSenderItem = <
        Key extends keyof Pick<CoverLetterSender, 'links' | 'extra_fields'>,
    >(
        key: Key,
        blankItem: CoverLetterSender[Key][number],
    ) => {
        updateContent((prev) => {
            const current = prev as CoverLetterContent;
            return {
                ...current,
                sender: {
                    ...current.sender,
                    [key]: [
                        ...current.sender[key],
                        blankItem,
                    ] as CoverLetterSender[Key],
                },
            };
        });
    };

    const updateCoverLetterBlock = (
        index: number,
        value: CoverLetterContent['blocks'][number],
    ) => {
        updateContent((prev) => {
            const current = prev as CoverLetterContent;
            const nextBlocks = [...current.blocks];
            nextBlocks[index] = value;
            return { ...current, blocks: nextBlocks };
        });
    };

    const updateCoverLetterCustomSection = (
        index: number,
        value: CoverLetterCustomSection,
    ) => {
        updateContent((prev) => {
            const current = prev as CoverLetterContent;
            const next = [...current.custom_sections];
            next[index] = value;
            return { ...current, custom_sections: next };
        });
    };

    const saveDocument = (onSuccess?: () => void) => {
        form.transform((data) => ({
            ...data,
            template_key:
                data.template_key?.trim() === '' ? null : data.template_key,
            content,
        }));

        form.patch(updateDocument(document.id).url, {
            preserveScroll: true,
            onSuccess,
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        saveDocument();
    };

    const sections: Section[] = useMemo(() => {
        if (document.type === 'resume') {
            return createResumeSections({
                resume: content as ResumeContent,
                updateResumeField,
                updateResumeArrayItem,
                addResumeItem,
                updateCustomSection,
                updateContent,
            });
        }

        return createCoverLetterSections({
            cover: content as CoverLetterContent,
            updateCoverLetterField,
            updateCoverLetterSenderList,
            addCoverLetterSenderItem,
            updateCoverLetterBlock,
            updateCoverLetterCustomSection,
            updateContent: (updater) =>
                updateContent((prev) =>
                    updater(prev as CoverLetterContent),
                ),
        });
    }, [content, document.type]);

    const currentSection = sections[activeSectionIndex] ?? sections[0];
    const templateKey = (form.data.template_key as TemplateKey) ?? 'classic';
    const isFirstSection = activeSectionIndex === 0;
    const isLastSection = activeSectionIndex === sections.length - 1;

    const handleNavigate = (direction: -1 | 1) => {
        const nextIndex =
            direction === 1
                ? Math.min(activeSectionIndex + 1, sections.length - 1)
                : Math.max(activeSectionIndex - 1, 0);

        if (nextIndex === activeSectionIndex || form.processing) {
            return;
        }

        saveDocument(() => setActiveSectionIndex(nextIndex));
    };

    const handleExport = () => {
        if (form.processing) {
            return;
        }

        saveDocument(() => {
            window.open(`/documents/${document.id}/export`, '_blank');
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={document.title} />

            <div className="flex flex-col gap-6 p-4 lg:flex-row lg:gap-8">
                <div className="w-full space-y-4 lg:w-1/2">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {document.type === 'cover_letter'
                                    ? 'Cover letter'
                                    : 'Resume'}
                            </p>
                            <h1 className="text-2xl font-semibold">
                                {document.title}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={handleExport}
                                disabled={form.processing}
                            >
                                Export as PDF
                            </Button>
                            <Link
                                href={documentsIndex()}
                                className="text-sm text-primary underline-offset-4 hover:underline"
                                prefetch
                            >
                                Back to documents
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-xs dark:border-sidebar-border">
                        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={form.data.title}
                                        onChange={(event) =>
                                            form.setData(
                                                'title',
                                                event.target.value,
                                            )
                                        }
                                        aria-invalid={Boolean(form.errors.title)}
                                        autoComplete="off"
                                    />
                                    <InputError message={form.errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={form.data.status}
                                        onChange={(event) =>
                                            form.setData(
                                                'status',
                                                event.target.value as DocumentStatus,
                                            )
                                        }
                                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                    >
                                        <option value="draft">
                                            {statusLabel('draft')}
                                        </option>
                                        <option value="final">
                                            {statusLabel('final')}
                                        </option>
                                        <option value="archived">
                                            {statusLabel('archived')}
                                        </option>
                                    </select>
                                    <InputError message={form.errors.status} />
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="template_key">Template</Label>
                                    <select
                                        id="template_key"
                                        name="template_key"
                                        value={form.data.template_key ?? 'classic'}
                                        onChange={(event) =>
                                            form.setData(
                                                'template_key',
                                                event.target
                                                    .value as TemplateKey,
                                            )
                                        }
                                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                    >
                                        <option value="classic">Classic</option>
                                        <option value="modern">Modern</option>
                                    </select>
                                    <InputError message={form.errors.template_key} />
                                </div>

                                {document.type === 'resume' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="font">Font</Label>
                                        <select
                                            id="font"
                                            name="font"
                                            value={(content as ResumeContent).font ?? 'Garamond'}
                                            onChange={(event) =>
                                                setContent((prev) => ({
                                                    ...(prev as ResumeContent),
                                                    font: event.target.value,
                                                }))
                                            }
                                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        >
                                            <option value="Garamond">Garamond</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Montserrat">Montserrat</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm">
                                    <span className="font-medium">
                                        Step {activeSectionIndex + 1} of{' '}
                                        {sections.length}:{' '}
                                        {currentSection?.title}
                                    </span>
                                </div>

                                <div>{currentSection?.render()}</div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isFirstSection || form.processing}
                                        onClick={() => handleNavigate(-1)}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={form.processing}
                                        onClick={() =>
                                            isLastSection
                                                ? saveDocument()
                                                : handleNavigate(1)
                                        }
                                    >
                                        {isLastSection ? 'Save' : 'Save & Next'}
                                    </Button>
                                </div>

                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="ml-auto"
                                    onClick={handleDelete}
                                    disabled={form.processing}
                                >
                                    Delete
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="hidden w-full lg:block lg:w-1/2">
                    <div className="h-full min-h-[480px] rounded-xl border border-dashed border-sidebar-border/70 bg-muted/40 p-6 text-sm text-muted-foreground shadow-inner dark:border-sidebar-border">
                        {document.type === 'resume' ? (
                            <ResumePreview
                                resume={content as ResumeContent}
                                variant={templateKey}
                            />
                        ) : (
                            <CoverLetterPreview
                                cover={content as CoverLetterContent}
                                variant={templateKey}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
