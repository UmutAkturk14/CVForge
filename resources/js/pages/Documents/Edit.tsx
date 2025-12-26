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

type ExtraField = { label: string; value: string };
type ResumeProfile = {
    first_name: string;
    last_name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary_markdown: string;
    extra_fields: ExtraField[];
};

type ResumeLink = { label: string; url: string };
type ResumeExperience = {
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description_markdown: string;
};
type ResumeEducation = {
    school: string;
    degree: string;
    field: string;
    location: string;
    start_date: string;
    end_date: string;
    description_markdown: string;
};
type ResumeSkill = { name: string; level: number };
type ResumeLanguage = { name: string; level: string };
type ResumeCustomItem = {
    label: string;
    description_markdown: string;
    start_date: string;
    end_date: string | null;
};
type ResumeCustomSection = { title: string; items: ResumeCustomItem[] };
type ResumeContent = {
    schema_version?: number;
    profile: ResumeProfile;
    links: ResumeLink[];
    experience: ResumeExperience[];
    education: ResumeEducation[];
    skills: ResumeSkill[];
    languages: ResumeLanguage[];
    custom_sections: ResumeCustomSection[];
    layout: { section_order: string[] };
};

type CoverLetterMeta = {
    company_name: string;
    job_title: string;
    job_location: string;
    recipient_name: string;
    recipient_title: string;
    job_reference: string;
    job_url: string;
};
type CoverLetterSender = {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    links: ResumeLink[];
    extra_fields: ExtraField[];
};
type CoverLetterSettings = {
    tone: string;
    length: string;
};
type CoverLetterBlock = {
    type: string;
    enabled: boolean;
    value?: string;
    markdown?: string;
};
type CoverLetterCustomSection = {
    title: string;
    enabled: boolean;
    markdown: string;
};
type CoverLetterContent = {
    schema_version?: number;
    meta: CoverLetterMeta;
    sender: CoverLetterSender;
    settings: CoverLetterSettings;
    blocks: CoverLetterBlock[];
    custom_sections: CoverLetterCustomSection[];
    layout: {
        include_sender_header: boolean;
        include_meta_line: boolean;
        paragraph_spacing: string;
    };
};

type EditProps = {
    document: Document;
};

type Section = {
    key: string;
    title: string;
    render: () => JSX.Element;
};

const defaultResumeContent = (): ResumeContent => ({
    schema_version: 1,
    profile: {
        first_name: '',
        last_name: '',
        headline: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        summary_markdown: '',
        extra_fields: [{ label: 'Citizenship', value: '' }],
    },
    links: [
        { label: 'LinkedIn', url: '' },
        { label: 'GitHub', url: '' },
    ],
    experience: [
        {
            company: '',
            role: '',
            location: '',
            start_date: '',
            end_date: '',
            is_current: true,
            description_markdown: '',
        },
    ],
    education: [
        {
            school: '',
            degree: '',
            field: '',
            location: '',
            start_date: '',
            end_date: '',
            description_markdown: '',
        },
    ],
    skills: [{ name: '', level: 3 }],
    languages: [{ name: '', level: '' }],
    custom_sections: [
        {
            title: 'Projects',
            items: [
                {
                    label: '',
                    description_markdown: '',
                    start_date: '',
                    end_date: '',
                },
            ],
        },
    ],
    layout: {
        section_order: [
            'profile',
            'links',
            'experience',
            'education',
            'skills',
            'languages',
            'custom_sections',
        ],
    },
});

const defaultCoverLetterContent = (): CoverLetterContent => ({
    schema_version: 1,
    meta: {
        company_name: '',
        job_title: '',
        job_location: '',
        recipient_name: '',
        recipient_title: '',
        job_reference: '',
        job_url: '',
    },
    sender: {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        links: [
            { label: 'Portfolio', url: '' },
            { label: 'LinkedIn', url: '' },
        ],
        extra_fields: [{ label: 'Availability', value: '' }],
    },
    settings: {
        tone: 'professional',
        length: 'medium',
    },
    blocks: [
        { type: 'date', enabled: true, value: '' },
        {
            type: 'recipient',
            enabled: true,
            markdown: 'Dear {{recipient_name}},',
        },
        {
            type: 'opening',
            enabled: true,
            markdown:
                'I’m writing to apply for the **{{job_title}}** role at **{{company_name}}**.',
        },
        {
            type: 'body',
            enabled: true,
            markdown:
                'Highlight 2-3 wins that match the role.\n- Delivered ...\n- Improved ...\n- Collaborated on ...\n',
        },
        {
            type: 'closing',
            enabled: true,
            markdown:
                'Thank you for your time and consideration. I’d welcome the chance to discuss how I can contribute.',
        },
        { type: 'signature', enabled: true, markdown: 'Sincerely,\n\n**{{full_name}}**' },
    ],
    custom_sections: [
        {
            title: 'Additional Notes',
            enabled: false,
            markdown: '',
        },
    ],
    layout: {
        include_sender_header: true,
        include_meta_line: true,
        paragraph_spacing: 'normal',
    },
});

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
        template_key: document.template_key ?? '',
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

    const updateResumeField = <Key extends keyof ResumeProfile>(
        field: Key,
        value: ResumeProfile[Key],
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
                [key]: [...(current[key] as unknown[]), blankItem] as ResumeContent[Key],
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
        Key extends keyof Pick<CoverLetterContent, 'meta' | 'sender' | 'settings'>,
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
                    [key]: [...current.sender[key], blankItem] as CoverLetterSender[Key],
                },
            };
        });
    };

    const updateCoverLetterBlock = (index: number, value: CoverLetterBlock) => {
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
            template_key: data.template_key?.trim() === '' ? null : data.template_key,
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

    const renderResumeProfile = (resume: ResumeContent) => (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                        id="first_name"
                        value={resume.profile.first_name}
                        onChange={(event) =>
                            updateResumeField('first_name', event.target.value)
                        }
                        autoComplete="given-name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                        id="last_name"
                        value={resume.profile.last_name}
                        onChange={(event) =>
                            updateResumeField('last_name', event.target.value)
                        }
                        autoComplete="family-name"
                    />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                        id="headline"
                        value={resume.profile.headline}
                        onChange={(event) =>
                            updateResumeField('headline', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="summary_markdown">Summary</Label>
                    <textarea
                        id="summary_markdown"
                        value={resume.profile.summary_markdown}
                        onChange={(event) =>
                            updateResumeField(
                                'summary_markdown',
                                event.target.value,
                            )
                        }
                        rows={4}
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={resume.profile.email}
                        onChange={(event) =>
                            updateResumeField('email', event.target.value)
                        }
                        autoComplete="email"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={resume.profile.phone}
                        onChange={(event) =>
                            updateResumeField('phone', event.target.value)
                        }
                        autoComplete="tel"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={resume.profile.location}
                        onChange={(event) =>
                            updateResumeField('location', event.target.value)
                        }
                        autoComplete="address-level2"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        value={resume.profile.website}
                        onChange={(event) =>
                            updateResumeField('website', event.target.value)
                        }
                    />
                </div>
            </div>
        </div>
    );

    const renderResumeLinks = (resume: ResumeContent) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Links</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        addResumeItem('links', { label: '', url: '' })
                    }
                >
                    Add link
                </Button>
            </div>
            <div className="space-y-3">
                {resume.links.map((link, index) => (
                    <div
                        key={`link-${index}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Link {index + 1}
                            </span>
                            {resume.links.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => {
                                            const current = prev as ResumeContent;
                                            return {
                                                ...current,
                                                links: current.links.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            };
                                        })
                                    }
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            <Input
                                placeholder="Label"
                                value={link.label}
                                onChange={(event) =>
                                    updateResumeArrayItem('links', index, {
                                        ...link,
                                        label: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="URL"
                                value={link.url}
                                onChange={(event) =>
                                    updateResumeArrayItem('links', index, {
                                        ...link,
                                        url: event.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderResumeExperience = (resume: ResumeContent) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Experience</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        addResumeItem('experience', {
                            company: '',
                            role: '',
                            location: '',
                            start_date: '',
                            end_date: '',
                            is_current: false,
                            description_markdown: '',
                        })
                    }
                >
                    Add role
                </Button>
            </div>
            <div className="space-y-4">
                {resume.experience.map((exp, index) => (
                    <div
                        key={`exp-${index}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Experience {index + 1}
                            </span>
                            {resume.experience.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => {
                                            const current = prev as ResumeContent;
                                            return {
                                                ...current,
                                                experience: current.experience.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            };
                                        })
                                    }
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <Input
                                placeholder="Company"
                                value={exp.company}
                                onChange={(event) =>
                                    updateResumeArrayItem('experience', index, {
                                        ...exp,
                                        company: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Role"
                                value={exp.role}
                                onChange={(event) =>
                                    updateResumeArrayItem('experience', index, {
                                        ...exp,
                                        role: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Location"
                                value={exp.location}
                                onChange={(event) =>
                                    updateResumeArrayItem('experience', index, {
                                        ...exp,
                                        location: event.target.value,
                                    })
                                }
                            />
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    placeholder="Start"
                                    value={exp.start_date}
                                    onChange={(event) =>
                                        updateResumeArrayItem(
                                            'experience',
                                            index,
                                            {
                                                ...exp,
                                                start_date: event.target.value,
                                            },
                                        )
                                    }
                                />
                                <Input
                                    type="date"
                                    placeholder="End"
                                    disabled={exp.is_current}
                                    value={exp.end_date ?? ''}
                                    onChange={(event) =>
                                        updateResumeArrayItem(
                                            'experience',
                                            index,
                                            {
                                                ...exp,
                                                end_date:
                                                    event.target.value || null,
                                            },
                                        )
                                    }
                                />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input
                                    type="checkbox"
                                    checked={exp.is_current}
                                    onChange={(event) =>
                                        updateResumeArrayItem(
                                            'experience',
                                            index,
                                            {
                                                ...exp,
                                                is_current: event.target.checked,
                                                end_date: event.target.checked
                                                    ? null
                                                    : exp.end_date,
                                            },
                                        )
                                    }
                                />
                                Currently working here
                            </label>
                            <div className="sm:col-span-2">
                                <textarea
                                    placeholder="- Did X\n- Improved Y by 30%"
                                    value={exp.description_markdown}
                                    onChange={(event) =>
                                        updateResumeArrayItem(
                                            'experience',
                                            index,
                                            {
                                                ...exp,
                                                description_markdown:
                                                    event.target.value,
                                            },
                                        )
                                    }
                                    rows={4}
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderResumeEducation = (resume: ResumeContent) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Education</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        addResumeItem('education', {
                            school: '',
                            degree: '',
                            field: '',
                            location: '',
                            start_date: '',
                            end_date: '',
                            description_markdown: '',
                        })
                    }
                >
                    Add school
                </Button>
            </div>
            <div className="space-y-4">
                {resume.education.map((edu, index) => (
                    <div
                        key={`edu-${index}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Education {index + 1}
                            </span>
                            {resume.education.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => {
                                            const current = prev as ResumeContent;
                                            return {
                                                ...current,
                                                education: current.education.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            };
                                        })
                                    }
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <Input
                                placeholder="School"
                                value={edu.school}
                                onChange={(event) =>
                                    updateResumeArrayItem('education', index, {
                                        ...edu,
                                        school: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Degree"
                                value={edu.degree}
                                onChange={(event) =>
                                    updateResumeArrayItem('education', index, {
                                        ...edu,
                                        degree: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Field"
                                value={edu.field}
                                onChange={(event) =>
                                    updateResumeArrayItem('education', index, {
                                        ...edu,
                                        field: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Location"
                                value={edu.location}
                                onChange={(event) =>
                                    updateResumeArrayItem('education', index, {
                                        ...edu,
                                        location: event.target.value,
                                    })
                                }
                            />
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    value={edu.start_date}
                                    onChange={(event) =>
                                        updateResumeArrayItem(
                                            'education',
                                            index,
                                            {
                                                ...edu,
                                                start_date: event.target.value,
                                            },
                                        )
                                    }
                                />
                                <Input
                                    type="date"
                                    value={edu.end_date}
                                    onChange={(event) =>
                                        updateResumeArrayItem(
                                            'education',
                                            index,
                                            {
                                                ...edu,
                                                end_date: event.target.value,
                                            },
                                        )
                                    }
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <textarea
                                    placeholder="- Relevant coursework..."
                                    value={edu.description_markdown}
                                    onChange={(event) =>
                                        updateResumeArrayItem(
                                            'education',
                                            index,
                                            {
                                                ...edu,
                                                description_markdown:
                                                    event.target.value,
                                            },
                                        )
                                    }
                                    rows={3}
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderResumeSkillsLanguages = (resume: ResumeContent) => (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Skills</h3>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                            addResumeItem('skills', { name: '', level: 3 })
                        }
                    >
                        Add skill
                    </Button>
                </div>
                <div className="space-y-2">
                    {resume.skills.map((skill, index) => (
                        <div
                            key={`skill-${index}`}
                            className="grid grid-cols-[2fr,1fr] gap-2"
                        >
                            <Input
                                placeholder="Skill"
                                value={skill.name}
                                onChange={(event) =>
                                    updateResumeArrayItem('skills', index, {
                                        ...skill,
                                        name: event.target.value,
                                    })
                                }
                            />
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                value={skill.level}
                                onChange={(event) =>
                                    updateResumeArrayItem('skills', index, {
                                        ...skill,
                                        level: Number(event.target.value || 0),
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Languages</h3>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                            addResumeItem('languages', { name: '', level: '' })
                        }
                    >
                        Add language
                    </Button>
                </div>
                <div className="space-y-2">
                    {resume.languages.map((language, index) => (
                        <div
                            key={`lang-${index}`}
                            className="grid grid-cols-2 gap-2"
                        >
                            <Input
                                placeholder="Language"
                                value={language.name}
                                onChange={(event) =>
                                    updateResumeArrayItem('languages', index, {
                                        ...language,
                                        name: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Level (e.g. C1)"
                                value={language.level}
                                onChange={(event) =>
                                    updateResumeArrayItem('languages', index, {
                                        ...language,
                                        level: event.target.value,
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderResumeCustomSections = (resume: ResumeContent) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Custom sections</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        updateContent((prev) => {
                            const current = prev as ResumeContent;
                            return {
                                ...current,
                                custom_sections: [
                                    ...current.custom_sections,
                                    {
                                        title: 'Custom',
                                        items: [
                                            {
                                                label: '',
                                                description_markdown: '',
                                                start_date: '',
                                                end_date: '',
                                            },
                                        ],
                                    },
                                ],
                            };
                        })
                    }
                >
                    Add section
                </Button>
            </div>
            <div className="space-y-4">
                {resume.custom_sections.map((section, sectionIndex) => (
                    <div
                        key={`custom-${sectionIndex}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <Input
                            className="mb-2"
                            placeholder="Section title"
                            value={section.title}
                            onChange={(event) =>
                                updateCustomSection(sectionIndex, {
                                    ...section,
                                    title: event.target.value,
                                })
                            }
                        />
                        <div className="space-y-3">
                            {section.items.map((item, itemIndex) => (
                                <div
                                    key={`custom-${sectionIndex}-${itemIndex}`}
                                    className="grid gap-2 sm:grid-cols-2"
                                >
                                    <Input
                                        placeholder="Label"
                                        value={item.label}
                                        onChange={(event) =>
                                            updateCustomSection(sectionIndex, {
                                                ...section,
                                                items: section.items.map(
                                                    (existing, idx) =>
                                                        idx === itemIndex
                                                            ? {
                                                                  ...existing,
                                                                  label: event
                                                                      .target
                                                                      .value,
                                                              }
                                                            : existing,
                                                ),
                                            })
                                        }
                                    />
                                    <Input
                                        type="date"
                                        placeholder="Start date"
                                        value={item.start_date}
                                        onChange={(event) =>
                                            updateCustomSection(sectionIndex, {
                                                ...section,
                                                items: section.items.map(
                                                    (existing, idx) =>
                                                        idx === itemIndex
                                                            ? {
                                                                  ...existing,
                                                                  start_date:
                                                                      event
                                                                          .target
                                                                          .value,
                                                              }
                                                            : existing,
                                                ),
                                            })
                                        }
                                    />
                                    <Input
                                        type="date"
                                        placeholder="End date"
                                        value={item.end_date ?? ''}
                                        onChange={(event) =>
                                            updateCustomSection(sectionIndex, {
                                                ...section,
                                                items: section.items.map(
                                                    (existing, idx) =>
                                                        idx === itemIndex
                                                            ? {
                                                                  ...existing,
                                                                  end_date:
                                                                      event
                                                                          .target
                                                                          .value || '',
                                                              }
                                                            : existing,
                                                ),
                                            })
                                        }
                                    />
                                    <div className="sm:col-span-2">
                                        <textarea
                                            placeholder="Description"
                                            value={item.description_markdown}
                                            onChange={(event) =>
                                                updateCustomSection(
                                                    sectionIndex,
                                                    {
                                                        ...section,
                                                        items: section.items.map(
                                                            (existing, idx) =>
                                                                idx === itemIndex
                                                                    ? {
                                                                          ...existing,
                                                                          description_markdown:
                                                                              event
                                                                                  .target
                                                                                  .value,
                                                                      }
                                                                    : existing,
                                                        ),
                                                    },
                                                )
                                            }
                                            rows={3}
                                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCoverMeta = (cover: CoverLetterContent) => (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="company_name">Company name</Label>
                <Input
                    id="company_name"
                    value={cover.meta.company_name}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'meta',
                            'company_name',
                            event.target.value,
                        )
                    }
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="job_title">Job title</Label>
                <Input
                    id="job_title"
                    value={cover.meta.job_title}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'meta',
                            'job_title',
                            event.target.value,
                        )
                    }
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="job_location">Job location</Label>
                <Input
                    id="job_location"
                    value={cover.meta.job_location}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'meta',
                            'job_location',
                            event.target.value,
                        )
                    }
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="recipient_name">Recipient name</Label>
                <Input
                    id="recipient_name"
                    value={cover.meta.recipient_name}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'meta',
                            'recipient_name',
                            event.target.value,
                        )
                    }
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="recipient_title">Recipient title</Label>
                <Input
                    id="recipient_title"
                    value={cover.meta.recipient_title}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'meta',
                            'recipient_title',
                            event.target.value,
                        )
                    }
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="job_reference">Job reference</Label>
                <Input
                    id="job_reference"
                    value={cover.meta.job_reference}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'meta',
                            'job_reference',
                            event.target.value,
                        )
                    }
                />
            </div>
            <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="job_url">Job URL</Label>
                <Input
                    id="job_url"
                    value={cover.meta.job_url}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'meta',
                            'job_url',
                            event.target.value,
                        )
                    }
                />
            </div>
        </div>
    );

    const renderCoverSender = (cover: CoverLetterContent) => (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
                <Input
                    placeholder="Full name"
                    value={cover.sender.full_name}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'sender',
                            'full_name',
                            event.target.value,
                        )
                    }
                />
                <Input
                    placeholder="Email"
                    value={cover.sender.email}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'sender',
                            'email',
                            event.target.value,
                        )
                    }
                />
                <Input
                    placeholder="Phone"
                    value={cover.sender.phone}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'sender',
                            'phone',
                            event.target.value,
                        )
                    }
                />
                <Input
                    placeholder="Location"
                    value={cover.sender.location}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'sender',
                            'location',
                            event.target.value,
                        )
                    }
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Links</span>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                            addCoverLetterSenderItem('links', {
                                label: '',
                                url: '',
                            })
                        }
                    >
                        Add link
                    </Button>
                </div>
                <div className="space-y-2">
                    {cover.sender.links.map((link, index) => (
                        <div
                            key={`sender-link-${index}`}
                            className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Link {index + 1}
                                </span>
                                {cover.sender.links.length > 1 && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                            updateContent((prev) => {
                                                const current = prev as CoverLetterContent;
                                                return {
                                                    ...current,
                                                    sender: {
                                                        ...current.sender,
                                                        links: current.sender.links.filter(
                                                            (_, idx) => idx !== index,
                                                        ),
                                                    },
                                                };
                                            })
                                        }
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="Label"
                                    value={link.label}
                                    onChange={(event) =>
                                        updateCoverLetterSenderList(
                                            'links',
                                            index,
                                            {
                                                ...link,
                                                label: event.target.value,
                                            },
                                        )
                                    }
                                />
                                <Input
                                    placeholder="URL"
                                    value={link.url}
                                    onChange={(event) =>
                                        updateCoverLetterSenderList(
                                            'links',
                                            index,
                                            {
                                                ...link,
                                                url: event.target.value,
                                            },
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Extra fields</span>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                            addCoverLetterSenderItem('extra_fields', {
                                label: '',
                                value: '',
                            })
                        }
                    >
                        Add field
                    </Button>
                </div>
                <div className="space-y-2">
                    {cover.sender.extra_fields.map((field, index) => (
                        <div
                            key={`extra-${index}`}
                            className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Field {index + 1}
                                </span>
                                {cover.sender.extra_fields.length > 1 && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                            updateContent((prev) => {
                                                const current = prev as CoverLetterContent;
                                                return {
                                                    ...current,
                                                    sender: {
                                                        ...current.sender,
                                                        extra_fields:
                                                            current.sender.extra_fields.filter(
                                                                (_, idx) => idx !== index,
                                                            ),
                                                    },
                                                };
                                            })
                                        }
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="Label"
                                    value={field.label}
                                    onChange={(event) =>
                                        updateCoverLetterSenderList(
                                            'extra_fields',
                                            index,
                                            {
                                                ...field,
                                                label: event.target.value,
                                            },
                                        )
                                    }
                                />
                                <Input
                                    placeholder="Value"
                                    value={field.value}
                                    onChange={(event) =>
                                        updateCoverLetterSenderList(
                                            'extra_fields',
                                            index,
                                            {
                                                ...field,
                                                value: event.target.value,
                                            },
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCoverSettings = (cover: CoverLetterContent) => (
        <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <select
                    id="tone"
                    value={cover.settings.tone}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'settings',
                            'tone',
                            event.target.value,
                        )
                    }
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <select
                    id="length"
                    value={cover.settings.length}
                    onChange={(event) =>
                        updateCoverLetterField(
                            'settings',
                            'length',
                            event.target.value,
                        )
                    }
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                </select>
            </div>
        </div>
    );

    const renderCoverBlocks = (cover: CoverLetterContent) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Blocks</h3>
            </div>
            <div className="space-y-3">
                {cover.blocks.map((block, index) => (
                    <div
                        key={`block-${index}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {block.type}
                            </span>
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input
                                    type="checkbox"
                                    checked={block.enabled}
                                    onChange={(event) =>
                                        updateCoverLetterBlock(index, {
                                            ...block,
                                            enabled: event.target.checked,
                                        })
                                    }
                                />
                                Enabled
                            </label>
                        </div>
                        {block.type === 'date' ? (
                            <Input
                                className="mt-2"
                                placeholder="Date (optional)"
                                value={block.value ?? ''}
                                onChange={(event) =>
                                    updateCoverLetterBlock(index, {
                                        ...block,
                                        value: event.target.value,
                                    })
                                }
                            />
                        ) : (
                            <textarea
                                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 mt-2 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                rows={block.type === 'body' ? 5 : 3}
                                value={block.markdown ?? ''}
                                onChange={(event) =>
                                    updateCoverLetterBlock(index, {
                                        ...block,
                                        markdown: event.target.value,
                                    })
                                }
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCoverCustomSections = (cover: CoverLetterContent) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Custom sections</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        updateContent((prev) => {
                            const current = prev as CoverLetterContent;
                            return {
                                ...current,
                                custom_sections: [
                                    ...current.custom_sections,
                                    {
                                        title: 'Custom',
                                        enabled: false,
                                        markdown: '',
                                    },
                                ],
                            };
                        })
                    }
                >
                    Add section
                </Button>
            </div>
            <div className="space-y-3">
                {cover.custom_sections.map((section, index) => (
                    <div
                        key={`cover-custom-${index}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <div className="flex items-center justify-between">
                            <Input
                                className="mr-3"
                                placeholder="Title"
                                value={section.title}
                                onChange={(event) =>
                                    updateCoverLetterCustomSection(index, {
                                        ...section,
                                        title: event.target.value,
                                    })
                                }
                            />
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input
                                    type="checkbox"
                                    checked={section.enabled}
                                    onChange={(event) =>
                                        updateCoverLetterCustomSection(index, {
                                            ...section,
                                            enabled: event.target.checked,
                                        })
                                    }
                                />
                                Enabled
                            </label>
                        </div>
                        <textarea
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 mt-2 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                            rows={3}
                            placeholder="Details"
                            value={section.markdown}
                            onChange={(event) =>
                                updateCoverLetterCustomSection(index, {
                                    ...section,
                                    markdown: event.target.value,
                                })
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const sections: Section[] = useMemo(() => {
        if (document.type === 'resume') {
            const resume = content as ResumeContent;
            return [
                {
                    key: 'profile',
                    title: 'Profile',
                    render: () => renderResumeProfile(resume),
                },
                {
                    key: 'links',
                    title: 'Links',
                    render: () => renderResumeLinks(resume),
                },
                {
                    key: 'experience',
                    title: 'Experience',
                    render: () => renderResumeExperience(resume),
                },
                {
                    key: 'education',
                    title: 'Education',
                    render: () => renderResumeEducation(resume),
                },
                {
                    key: 'skills',
                    title: 'Skills & Languages',
                    render: () => renderResumeSkillsLanguages(resume),
                },
                {
                    key: 'custom_sections',
                    title: 'Custom sections',
                    render: () => renderResumeCustomSections(resume),
                },
            ];
        }

        const cover = content as CoverLetterContent;

        return [
            {
                key: 'meta',
                title: 'Meta',
                render: () => renderCoverMeta(cover),
            },
            {
                key: 'sender',
                title: 'Sender',
                render: () => renderCoverSender(cover),
            },
            {
                key: 'settings',
                title: 'Settings',
                render: () => renderCoverSettings(cover),
            },
            {
                key: 'blocks',
                title: 'Blocks',
                render: () => renderCoverBlocks(cover),
            },
            {
                key: 'custom_sections',
                title: 'Custom sections',
                render: () => renderCoverCustomSections(cover),
            },
        ];
    }, [content, document.type]);

    const currentSection = sections[activeSectionIndex] ?? sections[0];
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
                        <Link
                            href={documentsIndex()}
                            className="text-sm text-primary underline-offset-4 hover:underline"
                            prefetch
                        >
                            Back to documents
                        </Link>
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

                            <div className="space-y-2">
                                <Label htmlFor="template_key">Template key</Label>
                                <Input
                                    id="template_key"
                                    name="template_key"
                                    value={form.data.template_key ?? ''}
                                    onChange={(event) =>
                                        form.setData(
                                            'template_key',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Optional"
                                    aria-invalid={Boolean(form.errors.template_key)}
                                    autoComplete="off"
                                />
                                <InputError message={form.errors.template_key} />
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
                                        disabled={isLastSection || form.processing}
                                        onClick={() => handleNavigate(1)}
                                    >
                                        Save & Next
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
                        <div className="mb-3 flex items-center justify-between">
                            <span className="font-medium text-foreground">
                                JSON Preview
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Live data
                            </span>
                        </div>
                        <pre className="max-h-[70vh] overflow-auto rounded-lg bg-background/60 p-3 text-xs text-foreground">
{JSON.stringify(content, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
