import React, { useEffect } from 'react';
import { CoverLetterContent, TemplateKey } from '../types';
import languages from '../../../../../app/schemas/languages.json';

const spacingClass = (value?: string): string => {
    if (value === 'compact') return 'space-y-2';
    if (value === 'relaxed') return 'space-y-5';
    return 'space-y-3';
};

const resolvePlaceholders = (
    text: string | undefined,
    cover: CoverLetterContent,
): string => {
    const map: Record<string, string> = {
        company_name: cover.meta.company_name,
        job_title: cover.meta.job_title,
        recipient_name: cover.meta.recipient_name,
        recipient_title: cover.meta.recipient_title,
        full_name: cover.sender.full_name,
    };

    return (text ?? '').replace(
        /\{\{\s*(.+?)\s*}}/g,
        (_, key: string) => map[key] ?? '',
    );
};

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

const applyFormatting = (value: string): string => {
    let html = escapeHtml(value);

    // tiny “markdown-ish” support
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    html = html.replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );

    return html.replace(/\n/g, '<br />');
};

const renderParagraphs = (
    text: string | undefined,
    cover: CoverLetterContent,
    signatureFont?: string,
    isSignature?: boolean,
) => {
    const resolved = resolvePlaceholders(text, cover);
    const paragraphs = resolved
        .split(/\n\s*\n/)
        .filter((value) => value.trim() !== '');

    return paragraphs.map((paragraph, index) => {
        const formatted = applyFormatting(paragraph);

        return (
            <p
                key={`${index}-${paragraph.slice(0, 24)}`}
                className="text-[11.25pt] leading-[1.75] text-neutral-900 [&_a]:font-medium [&_a]:text-neutral-900 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80"
                style={{
                    ...(signatureFont
                        ? {
                              fontFamily: `'${signatureFont}', 'Alex Brush', 'Great Vibes', 'Imperial Script', 'Mrs Saint Delafield', 'WindSong', 'Yesteryear', cursive`,
                          }
                        : {}),
                    ...(isSignature
                        ? { fontSize: '32pt', lineHeight: 1.2, fontWeight: 400 }
                        : {}),
                    textAlign: 'justify',
                }}
                dangerouslySetInnerHTML={{ __html: formatted }}
            />
        );
    });
};

const isLegacyDefault = (value?: string): boolean => {
    if (!value) {
        return false;
    }

    const normalized = value.trim().toLowerCase();
    const patterns = [
        /^\*{0,2}\s*\{\{\s*full_name\s*\}\}\s*\*{0,2}\s*$/i,
        /^\*{0,2}\s*your name\s*\*{0,2}\s*$/i,
        /#position/i,
        /#company/i,
    ];

    return patterns.some((pattern) => pattern.test(normalized));
};

type CoverLetterPreviewProps = {
    cover: CoverLetterContent;
    variant?: TemplateKey;
};

export function CoverLetterPreview({ cover }: CoverLetterPreviewProps) {
    useEffect(() => {
        const id = 'cover-letter-signature-fonts';
        if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.textContent =
                "@import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Imperial+Script&family=Mrs+Saint+Delafield&family=WindSong:wght@400;500&family=Yesteryear&family=Montserrat:wght@400;500;600;700&display=swap');";
            document.head.appendChild(style);
        }
    }, []);

    const layout = cover.layout ?? {
        include_sender_header: true,
        include_meta_line: true,
        paragraph_spacing: 'normal',
    };

    const showSenderHeader = layout.include_sender_header !== false;
    const includeMetaLine = layout.include_meta_line !== false;
    const paragraphSpacing = spacingClass(layout.paragraph_spacing);

    const enabledBlocks = cover.blocks
        .filter((block) => block.enabled)
        .map((block) => ({
            ...block,
            markdown: isLegacyDefault(block.markdown) ? '' : block.markdown,
        }));
    const dateBlock = enabledBlocks.find((block) => block.type === 'date');
    const contentBlocks = enabledBlocks.filter(
        (block) => block.type !== 'date',
    );

    const enabledSections = cover.custom_sections.filter(
        (section) => section.enabled,
    );

    const jobLine = [cover.meta.job_title, cover.meta.company_name]
        .filter(Boolean)
        .join(' • ');
    const language = cover.language ?? 'en';
    const copy =
        (languages as Record<string, any>)?.cover_letter?.[language] ??
        (languages as Record<string, any>)?.cover_letter?.en ?? {
            to: 'To',
            subject: 'Subject',
        };

    const contactItems = [
        cover.sender.email,
        cover.sender.phone,
        cover.sender.location,
    ].filter(Boolean);
    const linkItems = cover.sender.links.filter((link) => link.label || link.url);

    const recipientLines = [
        cover.meta.recipient_name,
        cover.meta.recipient_title,
        cover.meta.company_name,
    ].filter(Boolean);

    const fontImport =
        "@import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Imperial+Script&family=Mrs+Saint+Delafield&family=WindSong:wght@400;500&family=Yesteryear&family=Montserrat:wght@400;500;600;700&display=swap');";

    const fontFamily =
        cover.font === 'Times New Roman'
            ? '"Times New Roman", Times, serif'
            : cover.font === 'Montserrat'
                ? '"Montserrat", "Helvetica Neue", Arial, sans-serif'
                : 'Garamond, "Times New Roman", serif';

    return (
        <div className="w-full bg-neutral-100 px-4 py-8 print:bg-white print:px-0 print:py-0">
            <style id="cover-letter-signature-fonts-inline">{fontImport}</style>
            {/* A4 page */}
            <div
                className={[
                    'mx-auto min-h-[297mm] w-[210mm]',
                    'bg-white text-neutral-900 shadow-sm ring-1 ring-black/5',
                    'px-[18mm] py-[10mm]',
                    'print:mx-0 print:min-h-0 print:w-auto print:px-0 print:py-0 print:shadow-none print:ring-0',
                ].join(' ')}
                style={{ fontFamily }}
            >
                <div className="flex h-full flex-col">
                    {/* Header / Letterhead */}
                    {showSenderHeader && (
                        <header className="pb-5">
                            <div className="flex flex-col items-center justify-center gap-4">
                                {/* Name + date */}
                                <div className="flex flex-wrap items-start justify-between gap-6">
                                    <div className="min-w-0 space-y-1">
                                        <h1 className="truncate text-[21pt] font-semibold tracking-[-0.02em]">
                                            {cover.sender.full_name ||
                                                'Your Name'}
                                        </h1>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        {dateBlock?.value ? (
                                            <>
                                                <div className="text-[10pt] font-medium tracking-[0.18em] text-neutral-600 uppercase">
                                                    Date
                                                </div>
                                                <div className="mt-1 text-[11pt] text-neutral-800">
                                                    {dateBlock.value}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Contact line (clean + classic) */}
                                {contactItems.length > 0 && (
                                    <div className="flex w-full justify-center text-[10.5pt] text-neutral-800">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                            {contactItems.map((item, idx) => (
                                                <React.Fragment key={`${item}-${idx}`}>
                                                    <span className="whitespace-nowrap">
                                                        {item}
                                                    </span>
                                                    {idx < contactItems.length - 1 && (
                                                        <span className="text-neutral-300 select-none">•</span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {linkItems.length > 0 && (
                                    <div className="flex w-full justify-center text-[10.5pt] text-neutral-900">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            {linkItems.map((link, idx) => (
                                                <React.Fragment key={`${link.label}-${idx}`}>
                                                    <a
                                                        href={link.url || '#'}
                                                        className="underline underline-offset-4"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {link.label || link.url || 'Link'}
                                                    </a>
                                                    {idx < linkItems.length - 1 && (
                                                        <span className="text-neutral-300 select-none">•</span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Separator line (subtle but “real letter” vibe) */}
                                <div className="flex w-full items-center justify-center pt-1">
                                    <div className="h-px w-full bg-neutral-200" />
                                </div>
                            </div>
                        </header>
                    )}

                    {/* Recipient + Subject */}
                    <section className="pb-6">
                        <div className="flex flex-col gap-2 text-[11pt] leading-[1.55] text-neutral-800">
                            {(recipientLines.length > 0 || cover.meta.company_name) && (
                                <>
                                        <div className="text-[10pt] font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                                            {copy.to}
                                    </div>
                                    <div className="space-y-0.5">
                                        {cover.meta.recipient_name && (
                                            <div className="truncate font-semibold text-neutral-900">
                                                {cover.meta.recipient_name}
                                            </div>
                                        )}
                                        {cover.meta.recipient_title && (
                                            <div className="truncate text-neutral-800">
                                                {cover.meta.recipient_title}
                                            </div>
                                        )}
                                        {cover.meta.company_name && (
                                            <div className="truncate font-semibold text-neutral-900">
                                                {cover.meta.company_name}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {jobLine && includeMetaLine && (
                                <div className="text-[11pt] font-semibold text-neutral-900 pt-2">
                                    {copy.subject}: {cover.meta.job_title || 'Role'}
                                    {cover.meta.company_name ? ` — ${cover.meta.company_name}` : ''}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Body */}
                    <main className={`flex-1 ${paragraphSpacing}`}>
                        {contentBlocks.map((block, index) => (
                            <div
                                key={`${block.type}-${index}`}
                                className={
                                    block.type === 'signature'
                                        ? 'space-y-2 pt-8'
                                        : 'space-y-2'
                                }
                            >
                                {renderParagraphs(
                                    block.markdown,
                                    cover,
                                    block.type === 'signature'
                                        ? cover.signature_font
                                        : undefined,
                                    block.type === 'signature',
                                )}
                                {block.type === 'signature' && (
                                    <div className="text-[11pt] font-medium text-neutral-800">
                                        {cover.sender.full_name || 'Your Name'}
                                    </div>
                                )}
                            </div>
                        ))}

                        {enabledSections.length > 0 && (
                            <div className="pt-4">
                                <div className="space-y-5">
                                    {enabledSections.map((section, index) => (
                                        <section
                                            key={`${section.title}-${index}`}
                                            className="space-y-2"
                                        >
                                            <h2 className="text-[11.25pt] font-semibold tracking-[-0.01em] text-neutral-900">
                                                {section.title || 'Section'}
                                            </h2>
                                            <div className={paragraphSpacing}>
                                                {renderParagraphs(
                                                    section.markdown,
                                                    cover,
                                                )}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Signature (optional, keeps it letter-like even if content doesn’t include one) */}
                    <footer className="pt-10 text-[11.25pt] text-neutral-900">
                        {
                            !contentBlocks.some((b) =>
                                (b.markdown ?? '')
                                    .toLowerCase()
                                    .includes('sincerely'),
                            )
                        }
                    </footer>
                </div>
            </div>
        </div>
    );
}
