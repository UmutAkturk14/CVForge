import { CoverLetterContent, TemplateKey } from '../types';

const renderLines = (text?: string) =>
    (text ?? '')
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line, index) => (
            <p key={`${line}-${index}`} className="text-sm leading-relaxed">
                {line}
            </p>
        ));

type CoverLetterPreviewProps = {
    cover: CoverLetterContent;
    variant: TemplateKey;
};

export function CoverLetterPreview({ cover, variant }: CoverLetterPreviewProps) {
    const cardClass =
        variant === 'modern'
            ? 'bg-gradient-to-br from-emerald-50 to-white dark:from-neutral-900 dark:to-neutral-950'
            : 'bg-white/80 dark:bg-neutral-900/80';

    return (
        <div className="flex flex-col gap-6">
            <div className={`rounded-xl p-6 ${cardClass}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">
                            {cover.sender.full_name || 'Your Name'}
                        </h2>
                        <div className="space-y-1 text-sm text-muted-foreground">
                            {cover.sender.email && <div>{cover.sender.email}</div>}
                            {cover.sender.phone && <div>{cover.sender.phone}</div>}
                            {cover.sender.location && <div>{cover.sender.location}</div>}
                        </div>
                    </div>
                    <div className="space-y-1 text-right text-xs text-muted-foreground">
                        {cover.meta.company_name && <div>{cover.meta.company_name}</div>}
                        {cover.meta.job_title && <div>{cover.meta.job_title}</div>}
                        {cover.meta.job_location && <div>{cover.meta.job_location}</div>}
                        {cover.meta.job_reference && <div>Ref: {cover.meta.job_reference}</div>}
                        {cover.meta.job_url && <div className="truncate">{cover.meta.job_url}</div>}
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {cover.blocks
                        .filter((block) => block.enabled)
                        .map((block, index) => (
                            <div key={`${block.type}-${index}`} className="space-y-1">
                                {block.type !== 'date' && (
                                    <p className="text-sm font-medium text-foreground">
                                        {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                                    </p>
                                )}
                                <div className="text-sm text-muted-foreground leading-relaxed">
                                    {renderLines(block.type === 'date' ? block.value : block.markdown)}
                                </div>
                            </div>
                        ))}
                </div>

                {cover.custom_sections
                    .filter((section) => section.enabled)
                    .map((section, index) => (
                        <div key={`${section.title}-${index}`} className="mt-4 space-y-1">
                            <p className="text-sm font-semibold text-foreground">
                                {section.title || 'Section'}
                            </p>
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                {renderLines(section.markdown)}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
