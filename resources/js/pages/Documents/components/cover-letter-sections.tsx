import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoverLetterContent, Section } from '../types';

type CoverLetterSectionsProps = {
    cover: CoverLetterContent;
    updateCoverLetterField: <
        Key extends keyof Pick<CoverLetterContent, 'meta' | 'sender'>,
        NestedKey extends keyof CoverLetterContent[Key],
    >(
        key: Key,
        nested: NestedKey,
        value: CoverLetterContent[Key][NestedKey],
    ) => void;
    updateContent: (updater: (previous: CoverLetterContent) => CoverLetterContent) => void;
};

export const createCoverLetterSections = ({
    cover,
    updateCoverLetterField,
    updateContent,
}: CoverLetterSectionsProps): Section[] => {
    let bodyRef: HTMLTextAreaElement | null = null;
    const getBlock = (type: string): CoverLetterContent['blocks'][number] =>
        cover.blocks.find((block) => block.type === type) ?? { type, enabled: true, markdown: '' };

    const updateBlockByType = (
        type: string,
        value: Partial<CoverLetterContent['blocks'][number]>,
    ) => {
        updateContent((prev) => {
            const existing = prev.blocks.findIndex((block) => block.type === type);
            const nextBlocks = [...prev.blocks];

            if (existing >= 0) {
                nextBlocks[existing] = { ...nextBlocks[existing], ...value, type };
            } else {
                nextBlocks.push({ type, enabled: true, markdown: '', ...value });
            }

            return { ...prev, blocks: nextBlocks };
        });
    };

    const renderCoverMeta = () => (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
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
                    <button
                        type="button"
                        className="text-sm font-medium text-primary hover:underline"
                        onClick={() =>
                            updateContent((prev) => ({
                                ...prev,
                                sender: {
                                    ...prev.sender,
                                    links: [...prev.sender.links, { label: '', url: '' }],
                                },
                            }))
                        }
                    >
                        Add link
                    </button>
                </div>
                <div className="space-y-2">
                    {cover.sender.links.map((link, index) => (
                        <div
                            key={`cover-link-${index}`}
                            className="flex flex-col gap-2 rounded-md border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border sm:flex-row sm:items-center"
                        >
                            <Input
                                placeholder="Label"
                                value={link.label}
                                onChange={(event) =>
                                    updateContent((prev) => {
                                        const next = [...prev.sender.links];
                                        next[index] = { ...link, label: event.target.value };

                                        return {
                                            ...prev,
                                            sender: { ...prev.sender, links: next },
                                        };
                                    })
                                }
                            />
                            <Input
                                placeholder="URL"
                                value={link.url}
                                onChange={(event) =>
                                    updateContent((prev) => {
                                        const next = [...prev.sender.links];
                                        next[index] = { ...link, url: event.target.value };

                                        return {
                                            ...prev,
                                            sender: { ...prev.sender, links: next },
                                        };
                                    })
                                }
                            />
                            {cover.sender.links.length > 1 && (
                                <button
                                    type="button"
                                    className="text-sm text-destructive hover:underline"
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
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCoverContent = () => {
        const bodyBlock = getBlock('body');
        const signatureBlock = getBlock('signature');

        const applyFormatting = (prefix: string, suffix: string, fallback: string) => {
            const textarea = bodyRef;
            const current = bodyBlock.markdown ?? '';

            if (!textarea) {
                updateBlockByType('body', { markdown: `${current}${prefix}${fallback}${suffix}` });

                return;
            }

            const selectionStart = textarea.selectionStart ?? current.length;
            const selectionEnd = textarea.selectionEnd ?? current.length;
            const hasSelection = selectionEnd > selectionStart;
            const selected = hasSelection ? current.slice(selectionStart, selectionEnd) : fallback;

            const next =
                current.slice(0, selectionStart) +
                prefix +
                selected +
                suffix +
                current.slice(selectionEnd);

            updateBlockByType('body', { markdown: next });
        };

        const handleFormatting = (
            event: React.MouseEvent<HTMLButtonElement>,
            prefix: string,
            suffix: string,
            fallback: string,
        ) => {
            event.preventDefault();
            event.stopPropagation();
            bodyRef?.focus();
            applyFormatting(prefix, suffix, fallback);
        };

        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="body">Body</Label>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>Formatting</span>
                        <button
                            type="button"
                            className="rounded border border-border px-2 py-1 hover:bg-muted/60"
                            onMouseDown={(event) => handleFormatting(event, '**', '**', 'bold text')}
                        >
                            Bold
                        </button>
                        <button
                            type="button"
                            className="rounded border border-border px-2 py-1 hover:bg-muted/60"
                            onMouseDown={(event) => handleFormatting(event, '_', '_', 'italic text')}
                        >
                            Italic
                        </button>
                        <button
                            type="button"
                            className="rounded border border-border px-2 py-1 hover:bg-muted/60"
                            onMouseDown={(event) => handleFormatting(event, '\n- ', '', 'bullet item')}
                        >
                            Bullet
                        </button>
                        <button
                            type="button"
                            className="rounded border border-border px-2 py-1 hover:bg-muted/60"
                            onMouseDown={(event) => handleFormatting(event, '[', '](https://)', 'Link text')}
                        >
                            Link
                        </button>
                    </div>
                    <textarea
                        id="body"
                        ref={(element) => {
                            bodyRef = element;
                        }}
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        rows={8}
                        value={bodyBlock.markdown ?? ''}
                        onChange={(event) =>
                            updateBlockByType('body', { markdown: event.target.value })
                        }
                        placeholder="Write your cover letter body..."
                    />
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="signature_font">Signature font</Label>
                        <select
                            id="signature_font"
                            value={cover.signature_font ?? 'Alex Brush'}
                            onChange={(event) =>
                                updateContent((prev) => ({
                                    ...prev,
                                    signature_font: event.target.value,
                                }))
                            }
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        >
                            {[
                                'Alex Brush',
                                'Great Vibes',
                                'Imperial Script',
                                'Mrs Saint Delafield',
                                'WindSong',
                                'Yesteryear',
                            ].map((font) => (
                                <option key={font} value={font}>
                                    {font}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2 rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={Boolean(signatureBlock.enabled)}
                            onChange={(event) =>
                                updateBlockByType('signature', { enabled: event.target.checked })
                            }
                        />
                        Include signature
                    </label>
                    <textarea
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-60"
                        rows={1}
                        disabled={!signatureBlock.enabled}
                        value={signatureBlock.markdown ?? ''}
                        onChange={(event) =>
                            updateBlockByType('signature', {
                                markdown: event.target.value.replace(/\n/g, ' '),
                            })
                        }
                        placeholder="Your Name"
                    />
                </div>
            </div>
        );
    };

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
            key: 'content',
            title: 'Body & Signature',
            render: renderCoverContent,
        },
    ];
};
