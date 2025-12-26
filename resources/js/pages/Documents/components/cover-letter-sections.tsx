import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoverLetterContent, CoverLetterCustomSection, CoverLetterSender, Section } from '../types';

type CoverLetterSectionsProps = {
    cover: CoverLetterContent;
    updateCoverLetterField: <
        Key extends keyof Pick<CoverLetterContent, 'meta' | 'sender' | 'settings'>,
        NestedKey extends keyof CoverLetterContent[Key],
    >(
        key: Key,
        nested: NestedKey,
        value: CoverLetterContent[Key][NestedKey],
    ) => void;
    updateCoverLetterSenderList: <
        Key extends keyof Pick<CoverLetterSender, 'links' | 'extra_fields'>,
    >(
        key: Key,
        index: number,
        value: CoverLetterSender[Key][number],
    ) => void;
    addCoverLetterSenderItem: <
        Key extends keyof Pick<CoverLetterSender, 'links' | 'extra_fields'>,
    >(
        key: Key,
        blankItem: CoverLetterSender[Key][number],
    ) => void;
    updateCoverLetterBlock: (index: number, value: CoverLetterContent['blocks'][number]) => void;
    updateCoverLetterCustomSection: (
        index: number,
        value: CoverLetterCustomSection,
    ) => void;
    updateContent: (
        updater: (previous: CoverLetterContent) => CoverLetterContent,
    ) => void;
};

export const createCoverLetterSections = ({
    cover,
    updateCoverLetterField,
    updateCoverLetterSenderList,
    addCoverLetterSenderItem,
    updateCoverLetterBlock,
    updateCoverLetterCustomSection,
    updateContent,
}: CoverLetterSectionsProps): Section[] => {
    const renderCoverMeta = () => (
        <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="company_name">Company name</Label>
                    <Input
                        id="company_name"
                        value={cover.meta.company_name}
                        onChange={(event) =>
                            updateCoverLetterField('meta', 'company_name', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="job_title">Job title</Label>
                    <Input
                        id="job_title"
                        value={cover.meta.job_title}
                        onChange={(event) =>
                            updateCoverLetterField('meta', 'job_title', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="job_location">Job location</Label>
                    <Input
                        id="job_location"
                        value={cover.meta.job_location}
                        onChange={(event) =>
                            updateCoverLetterField('meta', 'job_location', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="recipient_name">Recipient name</Label>
                    <Input
                        id="recipient_name"
                        value={cover.meta.recipient_name}
                        onChange={(event) =>
                            updateCoverLetterField('meta', 'recipient_name', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="recipient_title">Recipient title</Label>
                    <Input
                        id="recipient_title"
                        value={cover.meta.recipient_title}
                        onChange={(event) =>
                            updateCoverLetterField('meta', 'recipient_title', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="job_reference">Reference</Label>
                    <Input
                        id="job_reference"
                        value={cover.meta.job_reference}
                        onChange={(event) =>
                            updateCoverLetterField('meta', 'job_reference', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="job_url">Job URL</Label>
                    <Input
                        id="job_url"
                        value={cover.meta.job_url}
                        onChange={(event) =>
                            updateCoverLetterField('meta', 'job_url', event.target.value)
                        }
                    />
                </div>
            </div>
        </div>
    );

    const renderCoverSender = () => (
        <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="full_name">Full name</Label>
                    <Input
                        id="full_name"
                        value={cover.sender.full_name}
                        onChange={(event) =>
                            updateCoverLetterField('sender', 'full_name', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={cover.sender.email}
                        onChange={(event) =>
                            updateCoverLetterField('sender', 'email', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={cover.sender.phone}
                        onChange={(event) =>
                            updateCoverLetterField('sender', 'phone', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={cover.sender.location}
                        onChange={(event) =>
                            updateCoverLetterField('sender', 'location', event.target.value)
                        }
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Links</span>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => addCoverLetterSenderItem('links', { label: '', url: '' })}
                    >
                        Add link
                    </Button>
                </div>
                <div className="space-y-2">
                    {cover.sender.links.map((link, index) => (
                        <div
                            key={`cover-link-${index}`}
                            className="flex items-center gap-2 rounded-md border border-sidebar-border/70 p-2 shadow-xs dark:border-sidebar-border"
                        >
                            <Input
                                placeholder="Label"
                                value={link.label}
                                onChange={(event) =>
                                    updateCoverLetterSenderList('links', index, {
                                        ...link,
                                        label: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="URL"
                                value={link.url}
                                onChange={(event) =>
                                    updateCoverLetterSenderList('links', index, {
                                        ...link,
                                        url: event.target.value,
                                    })
                                }
                            />
                            {cover.sender.links.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => ({
                                            ...prev,
                                            sender: {
                                                ...prev.sender,
                                                links: prev.sender.links.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            },
                                        }))
                                    }
                                >
                                    Delete
                                </Button>
                            )}
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
                                label: 'Availability',
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
                            key={`cover-extra-${index}`}
                            className="flex items-center gap-2 rounded-md border border-sidebar-border/70 p-2 shadow-xs dark:border-sidebar-border"
                        >
                            <Input
                                placeholder="Label"
                                value={field.label}
                                onChange={(event) =>
                                    updateCoverLetterSenderList('extra_fields', index, {
                                        ...field,
                                        label: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Value"
                                value={field.value}
                                onChange={(event) =>
                                    updateCoverLetterSenderList('extra_fields', index, {
                                        ...field,
                                        value: event.target.value,
                                    })
                                }
                            />
                            {cover.sender.extra_fields.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => ({
                                            ...prev,
                                            sender: {
                                                ...prev.sender,
                                                extra_fields: prev.sender.extra_fields.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            },
                                        }))
                                    }
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCoverSettings = () => (
        <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <select
                        id="tone"
                        value={cover.settings.tone}
                        onChange={(event) =>
                            updateCoverLetterField('settings', 'tone', event.target.value)
                        }
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                    >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="concise">Concise</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="length">Length</Label>
                    <select
                        id="length"
                        value={cover.settings.length}
                        onChange={(event) =>
                            updateCoverLetterField('settings', 'length', event.target.value)
                        }
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                    >
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2 rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={cover.layout.include_sender_header}
                        onChange={(event) =>
                            updateCoverLetterField(
                                'layout',
                                'include_sender_header',
                                event.target.checked,
                            )
                        }
                    />
                    Include sender header
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={cover.layout.include_meta_line}
                        onChange={(event) =>
                            updateCoverLetterField(
                                'layout',
                                'include_meta_line',
                                event.target.checked,
                            )
                        }
                    />
                    Include job info line
                </label>
                <div className="space-y-1">
                    <Label htmlFor="paragraph_spacing">Paragraph spacing</Label>
                    <select
                        id="paragraph_spacing"
                        value={cover.layout.paragraph_spacing}
                        onChange={(event) =>
                            updateCoverLetterField(
                                'layout',
                                'paragraph_spacing',
                                event.target.value,
                            )
                        }
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                    >
                        <option value="compact">Compact</option>
                        <option value="normal">Normal</option>
                        <option value="relaxed">Relaxed</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderCoverBlocks = () => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Blocks</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        updateContent((prev) => ({
                            ...prev,
                            blocks: [
                                ...prev.blocks,
                                {
                                    type: 'custom',
                                    enabled: true,
                                    markdown: '',
                                },
                            ],
                        }))
                    }
                >
                    Add block
                </Button>
            </div>
            <div className="space-y-3">
                {cover.blocks.map((block, index) => (
                    <div
                        key={`${block.type}-${index}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Label htmlFor={`block-type-${index}`} className="text-sm">
                                    Type
                                </Label>
                                <select
                                    id={`block-type-${index}`}
                                    value={block.type}
                                    onChange={(event) =>
                                        updateCoverLetterBlock(index, {
                                            ...block,
                                            type: event.target.value,
                                        })
                                    }
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                >
                                    <option value="date">Date</option>
                                    <option value="recipient">Recipient</option>
                                    <option value="opening">Opening</option>
                                    <option value="body">Body</option>
                                    <option value="closing">Closing</option>
                                    <option value="signature">Signature</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-2 text-sm">
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
                                placeholder="Date value"
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
                                rows={3}
                                placeholder="Content"
                                value={block.markdown ?? ''}
                                onChange={(event) =>
                                    updateCoverLetterBlock(index, {
                                        ...block,
                                        markdown: event.target.value,
                                    })
                                }
                            />
                        )}
                        {cover.blocks.length > 1 && (
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="mt-2"
                                onClick={() =>
                                    updateContent((prev) => ({
                                        ...prev,
                                        blocks: prev.blocks.filter((_, idx) => idx !== index),
                                    }))
                                }
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCoverCustomSections = () => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Custom sections</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        updateContent((prev) => ({
                            ...prev,
                            custom_sections: [
                                ...prev.custom_sections,
                                { title: 'Section', enabled: false, markdown: '' },
                            ],
                        }))
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
                        {cover.custom_sections.length > 1 && (
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="mt-2"
                                onClick={() =>
                                    updateContent((prev) => ({
                                        ...prev,
                                        custom_sections: prev.custom_sections.filter(
                                            (_, idx) => idx !== index,
                                        ),
                                    }))
                                }
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return [
        {
            key: 'meta',
            title: 'Job info',
            render: renderCoverMeta,
        },
        {
            key: 'sender',
            title: 'Sender',
            render: renderCoverSender,
        },
        {
            key: 'settings',
            title: 'Settings',
            render: renderCoverSettings,
        },
        {
            key: 'blocks',
            title: 'Blocks',
            render: renderCoverBlocks,
        },
        {
            key: 'custom_sections',
            title: 'Custom sections',
            render: renderCoverCustomSections,
        },
    ];
};
